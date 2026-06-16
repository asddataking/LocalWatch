import { mutation } from "./_generated/server";

const seedReports = [
  {
    category: "Suspicious Activity",
    title: "Unknown vehicle parked for hours",
    description: "A dark SUV has been parked on the street for over 4 hours with the engine running. Driver does not appear to be going anywhere.",
    locationText: "Military St, Port Huron",
    latitude: 43.0009,
    longitude: -82.4249,
    anonymous: true,
  },
  {
    category: "Traffic",
    title: "Pothole causing near-accidents",
    description: "Large pothole near the intersection causing cars to swerve suddenly. Several near-misses observed this morning.",
    locationText: "Gratiot Ave & Water St, Port Huron",
    latitude: 42.9965,
    longitude: -82.4352,
    anonymous: false,
  },
  {
    category: "Missing Pet",
    title: "Missing tabby cat — Whiskers",
    description: "Orange and white tabby cat, approximately 2 years old. Answers to Whiskers. Last seen near Elmwood Ave. Has a blue collar. Please contact if found.",
    locationText: "Elmwood Ave, Port Huron",
    latitude: 43.0087,
    longitude: -82.4181,
    anonymous: false,
  },
  {
    category: "Hazard",
    title: "Downed power line after storm",
    description: "Power line is down and touching the road surface. Area is sparking. DTE Energy notified but has not yet arrived. Avoid the area.",
    locationText: "Lapeer Rd, Kimball Township",
    latitude: 42.9768,
    longitude: -82.5012,
    anonymous: false,
  },
  {
    category: "Scam Alert",
    title: "Door-to-door solar scam reported",
    description: "Multiple neighbors report pushy salespeople claiming to be from DTE. They are asking for personal info and utility account numbers. Do NOT provide any info.",
    locationText: "Wadhams Rd, Kimball Township",
    latitude: 42.9712,
    longitude: -82.5234,
    anonymous: true,
  },
  {
    category: "Crime",
    title: "Package theft from porch",
    description: "Security camera captured an individual taking packages from front porches on this street between 2–4pm. Individual wearing a red hoodie.",
    locationText: "Krafft Rd, Fort Gratiot",
    latitude: 43.0421,
    longitude: -82.4692,
    anonymous: false,
  },
  {
    category: "Weather",
    title: "Flash flooding on low road",
    description: "Water is over 12 inches deep on this stretch of road after last night's heavy rain. Road is not closed but is dangerous. Use alternate route.",
    locationText: "River Rd, Fort Gratiot",
    latitude: 43.0358,
    longitude: -82.4815,
    anonymous: false,
  },
  {
    category: "Suspicious Activity",
    title: "Individuals checking car door handles",
    description: "Two individuals seen slowly walking through the parking lot and checking door handles of parked vehicles at around midnight.",
    locationText: "Gratiot Ave, Marysville",
    latitude: 42.9126,
    longitude: -82.4848,
    anonymous: true,
  },
  {
    category: "Traffic",
    title: "Stop sign knocked down",
    description: "Stop sign at this intersection has been knocked over and is lying on the ground. Drivers are not stopping. Reported to city but sign is still down.",
    locationText: "Huron Blvd, Marysville",
    latitude: 42.9098,
    longitude: -82.4762,
    anonymous: false,
  },
  {
    category: "Hazard",
    title: "Abandoned shopping cart blocking sidewalk",
    description: "Shopping cart has been blocking the accessible ramp of the sidewalk for two days. Wheelchair users are forced into the street.",
    locationText: "Michigan Ave, Marysville",
    latitude: 42.9157,
    longitude: -82.4901,
    anonymous: true,
  },
];

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("reports").collect();
    if (existing.length > 0) {
      return { message: "Seed data already exists, skipping." };
    }
    const now = Date.now();
    for (let i = 0; i < seedReports.length; i++) {
      const report = seedReports[i];
      await ctx.db.insert("reports", {
        ...report,
        photoStorageId: undefined,
        status: i < 2 ? "Multiple Witnesses" : "Community Reported",
        confirmations: i < 2 ? 3 : 0,
        disputes: 0,
        createdAt: now - i * 3600000, // space them 1 hour apart
      });
    }
    return { message: `Seeded ${seedReports.length} reports successfully.` };
  },
});
