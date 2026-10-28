/**
 * Central company and site configuration.
 *
 * Only verified information belongs here. Fields set to `null` are not yet
 * confirmed by the company owner: they are hidden on public pages (or shown as
 * a clearly marked placeholder inside the legal templates) until filled in.
 * See docs/OWNER_INFORMATION_REQUIRED.md.
 */
export const siteConfig = {
  url: "https://achieveglobal.com.tr",
  brandName: "ACHIEVE GLOBAL",
  legalName: "ACHIEVE GLOBAL DANIŞMANLIK VE DIŞ TİCARET LİMİTED ŞİRKETİ",
  city: "Istanbul",
  countryCode: "TR",

  emails: {
    general: "info@achieveglobal.com.tr",
    exports: "exports@achieveglobal.com.tr",
    /** Contact for KVKK / GDPR data-subject requests. */
    privacy: "info@achieveglobal.com.tr",
  },

  /** Unverified details — keep null until confirmed. */
  legal: {
    registeredAddress: null as string | null,
    tradeRegistryNumber: null as string | null,
    mersisNumber: null as string | null,
    taxOffice: null as string | null,
    taxNumber: null as string | null,
    kepAddress: null as string | null,
  },
  phone: null as string | null,
  /** Add official profile URLs only once the accounts exist, e.g. { linkedin: "https://..." } */
  social: {} as Record<string, string>,
} as const;

export type SiteConfig = typeof siteConfig;
