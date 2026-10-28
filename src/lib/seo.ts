import type { Metadata } from "next";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { RouteKey } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { absoluteUrl, href } from "./paths";

export const OG_IMAGE = { url: "/og/achieve-global-og.png", width: 1200, height: 630 };

/** Canonical + hreflang alternates for a page that exists in every language. */
export function alternatesFor(locale: Locale, route: RouteKey): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeMeta[l].hreflang] = absoluteUrl(href(l, route));
  languages["x-default"] = absoluteUrl(href("en", route));
  return { canonical: absoluteUrl(href(locale, route)), languages };
}

export function pageMetadata({
  locale,
  route,
  title,
  description,
  absoluteTitle = false,
}: {
  locale: Locale;
  route: RouteKey;
  title: string;
  description: string;
  absoluteTitle?: boolean;
}): Metadata {
  const dict = getDictionary(locale);
  const fullTitle = absoluteTitle ? title : `${title} | ${dict.meta.titleSuffix}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternatesFor(locale, route),
    openGraph: {
      type: "website",
      siteName: siteConfig.brandName,
      title: fullTitle,
      description,
      url: absoluteUrl(href(locale, route)),
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].ogLocale),
      images: [{ ...OG_IMAGE, alt: dict.meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
