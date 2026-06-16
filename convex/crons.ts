import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Run the nightly cleanup action every day at midnight (UTC)
crons.daily(
  "nightly-ai-cleanup",
  { hourUTC: 0, minuteUTC: 0 },
  api.cleanup.runNightlyCleanup
);

export default crons;
