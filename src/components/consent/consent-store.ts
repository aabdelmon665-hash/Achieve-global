export const OPEN_CONSENT_EVENT = "ag:open-consent";
const KEY = "ag-consent-v1";

export type ConsentState = { analytics: boolean; decidedAt: string };

export function readConsent(): ConsentState | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    return typeof parsed.analytics === "boolean" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean) {
  const state: ConsentState = { analytics, decidedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private mode): the choice applies to this page view only.
  }
  return state;
}
