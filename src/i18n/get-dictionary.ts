import "server-only";
import type { Locale } from "./config";
import en from "./dictionaries/en";
import tr from "./dictionaries/tr";
import ar from "./dictionaries/ar";

export type { Dictionary } from "./dictionaries/en";

const dictionaries = { en, tr, ar };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
