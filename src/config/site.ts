/**
 * Central company and site configuration.
 *
 * Only verified information belongs here. Fields set to `null` are not yet
 * confirmed by the company owner: they are hidden on public pages (or shown as
 * a clearly marked placeholder inside the legal templates) until filled in.
 * See docs/OWNER_INFORMATION_REQUIRED.md.
 */
const GENERAL_EMAIL = "info@achieveglobal.com.tr";
const EXPORTS_EMAIL = "exports@achieveglobal.com.tr";

/**
 * Set to false if the site goes live before exports@achieveglobal.com.tr can
 * receive mail. While false, the exports address is not shown anywhere and
 * food/export inquiries are delivered to info@ instead, so no message is lost.
 * The hosting variable EMAIL_TO_EXPORTS, when set, still takes precedence for
 * form delivery.
 */
export const EXPORTS_MAILBOX_ACTIVE = true;

export const siteConfig = {
  url: "https://achieveglobal.com.tr",
  brandName: "ACHIEVE GLOBAL",
  legalName: "ACHIEVE GLOBAL DANIŞMANLIK VE DIŞ TİCARET LİMİTED ŞİRKETİ",
  city: "Istanbul",
  countryCode: "TR",

  emails: {
    general: GENERAL_EMAIL,
    /** Food trading & export inquiries. Equals the general inbox while the exports mailbox is pending. */
    exports: EXPORTS_MAILBOX_ACTIVE ? EXPORTS_EMAIL : GENERAL_EMAIL,
    /** Contact for KVKK / GDPR data-subject requests. */
    privacy: GENERAL_EMAIL,
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
