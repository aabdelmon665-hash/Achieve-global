import { siteConfig } from "@/config/site";
import { routes, type RouteKey } from "@/config/routes";
import type { Locale } from "@/i18n/config";

/** Relative, trailing-slash path for a page, e.g. /tr/contact/ */
export function href(locale: Locale, key: RouteKey, hash?: string) {
  const slug = routes[key];
  const path = slug ? `/${locale}/${slug}/` : `/${locale}/`;
  return hash ? `${path}#${hash}` : path;
}

/** Absolute URL on the official domain. */
export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

/** Replace {{tokens}} in a translated string. */
export function fill(text: string, vars: Record<string, string>) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => vars[k] ?? `{{${k}}}`);
}
