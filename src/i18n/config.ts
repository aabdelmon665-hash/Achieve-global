export const locales = ["en", "tr", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { name: string; dir: "ltr" | "rtl"; ogLocale: string; hreflang: string }> = {
  en: { name: "English", dir: "ltr", ogLocale: "en_US", hreflang: "en" },
  tr: { name: "Türkçe", dir: "ltr", ogLocale: "tr_TR", hreflang: "tr" },
  ar: { name: "العربية", dir: "rtl", ogLocale: "ar_AR", hreflang: "ar" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
