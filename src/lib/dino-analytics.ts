import type { AnalyticsEventType, LeadPayload } from "./analytics-store";

export type TrackPayload = { type: AnalyticsEventType; label?: string; href?: string; leadId?: string; lead?: LeadPayload };
export function getSessionId() {
  try {
    const key = "dino-analytics-session";
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const next = crypto.randomUUID();
    localStorage.setItem(key, next);
    return next;
  } catch { return undefined; }
}
export function getAttribution() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(["source", "medium", "campaign", "content"].map(key => [key, params.get(`utm_${key}`) || undefined]));
}
export function analyticsBody(payload: TrackPayload) {
  return { ...payload, path: window.location.pathname, sessionId: getSessionId(), attribution: getAttribution() };
}
export function trackAnalytics(payload: TrackPayload) {
  const body = JSON.stringify(analyticsBody(payload));
  try {
    if (navigator.sendBeacon?.("/api/analytics", new Blob([body], { type: "application/json" }))) return;
    void fetch("/api/analytics", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(() => {});
  } catch { /* Analytics must never prevent a user action. */ }
}
