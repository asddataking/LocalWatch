import { action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";

// 1. Query to get recent reports (last 24 hours)
export const getRecentReports = internalQuery({
  args: {},
  handler: async (ctx) => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return await ctx.db
      .query("reports")
      .filter((q) => q.and(q.gte(q.field("createdAt"), oneDayAgo), q.neq(q.field("isSpam"), true)))
      .collect();
  },
});

// 2. Mutation to flag a report as spam
export const flagReportAsSpam = internalMutation({
  args: { id: v.id("reports") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { isSpam: true });
  },
});

// 3. Action that calls Gemini to analyze reports
export const runNightlyCleanup = action({
  args: {},
  handler: async (ctx) => {
    // We only want to run this if we have an API key set
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not set. Skipping AI cleanup.");
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Fetch recent reports using our internal query
    const recentReports = await ctx.runQuery(internal.cleanup.getRecentReports);
    
    if (recentReports.length === 0) {
      console.log("No new reports to clean up.");
      return;
    }

    let spamCount = 0;

    for (const report of recentReports) {
      // Craft the prompt for Gemini
      const prompt = `You are a moderation AI for a community safety app. 
Evaluate the following user-submitted report to determine if it is obvious SPAM, FAKE, GIBBERISH, or highly MALICIOUS.

Title: ${report.title}
Description: ${report.description}
Category: ${report.category}

Return ONLY the word "SPAM" if it is fake/spam/gibberish. 
Return ONLY the word "OK" if it appears to be a reasonable attempt at a report (even if it's mundane or poorly spelled).`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const text = response.text?.trim().toUpperCase() || "OK";
        
        if (text.includes("SPAM")) {
          // It's spam! Call our internal mutation to hide it.
          await ctx.runMutation(internal.cleanup.flagReportAsSpam, { id: report._id });
          spamCount++;
          console.log(`Flagged report as spam: "${report.title}"`);
        }
      } catch (error) {
        console.error("Error evaluating report with Gemini:", error);
      }
    }

    console.log(`Nightly cleanup complete. Flagged ${spamCount} out of ${recentReports.length} reports as spam.`);
  },
});
