/**
 * Consent-aware analytics helpers.
 *
 * No tracking script is loaded unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set
 * AND the visitor has accepted analytics. Until then these calls are no-ops.
 */
export const analyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const analyticsAvailable = Boolean(analyticsId);

export type AnalyticsEvent =
  | "inquiry_submitted"
  | "email_click"
  | "quote_cta_click";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: AnalyticsEvent, params: Record<string, string> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
