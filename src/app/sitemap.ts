import type { MetadataRoute } from "next";
import { locales, localeMeta } from "@/i18n/config";
import { sitemapRoutes } from "@/config/routes";
import { absoluteUrl, href } from "@/lib/paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return sitemapRoutes.flatMap(({ key, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: absoluteUrl(href(locale, key)),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [localeMeta[l].hreflang, absoluteUrl(href(l, key))])),
          "x-default": absoluteUrl(href("en", key)),
        },
      },
    })),
  );
}
