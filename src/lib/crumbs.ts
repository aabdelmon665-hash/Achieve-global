import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { RouteKey } from "@/config/routes";
import { href } from "./paths";

export function crumbsFor(locale: Locale, dict: Dictionary, route: RouteKey, name: string) {
  return [
    { name: dict.nav.home, path: href(locale, "home") },
    { name, path: href(locale, route) },
  ];
}
