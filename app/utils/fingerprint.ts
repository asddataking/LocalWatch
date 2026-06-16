export function getFingerprintId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("localwatch_fingerprint");
  if (!id) {
    id = "lw_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem("localwatch_fingerprint", id);
  }
  return id;
}
