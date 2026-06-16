export const STATUS_DISPLAY: Record<string, { label: string; cls: string; icon: string }> = {
  UNVERIFIED: { label: "Community Reported", cls: "status-reported", icon: "📢" },
  VERIFIED: { label: "Verified", cls: "status-witnesses", icon: "✓" },
  HIDDEN: { label: "Hidden", cls: "status-review", icon: "🔍" },
  "NEEDS REVIEW": { label: "Needs Review", cls: "status-review", icon: "🔍" },
};

export function getStatusDisplay(status: string) {
  return STATUS_DISPLAY[status] ?? { label: "Community Reported", cls: "status-reported", icon: "📢" };
}

export function isVerifiedStatus(status: string): boolean {
  return status === "VERIFIED";
}
