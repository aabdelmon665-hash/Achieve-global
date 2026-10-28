/** Locale-independent route slugs. Each page exists under /en, /tr and /ar. */
export const routes = {
  home: "",
  about: "about",
  industrial: "industrial-trading-sourcing",
  food: "food-trading-export",
  business: "business-services-turkiye",
  contact: "contact",
  quote: "request-a-quote",
  privacy: "privacy-policy",
  cookies: "cookie-policy",
  terms: "terms-of-use",
} as const;

export type RouteKey = keyof typeof routes;

/** Pages listed in the sitemap, with a relative crawl priority. */
export const sitemapRoutes: { key: RouteKey; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
  { key: "home", priority: 1, changeFrequency: "monthly" },
  { key: "industrial", priority: 0.9, changeFrequency: "monthly" },
  { key: "food", priority: 0.9, changeFrequency: "monthly" },
  { key: "business", priority: 0.8, changeFrequency: "monthly" },
  { key: "about", priority: 0.7, changeFrequency: "monthly" },
  { key: "quote", priority: 0.8, changeFrequency: "monthly" },
  { key: "contact", priority: 0.8, changeFrequency: "monthly" },
  { key: "privacy", priority: 0.2, changeFrequency: "yearly" },
  { key: "cookies", priority: 0.2, changeFrequency: "yearly" },
  { key: "terms", priority: 0.2, changeFrequency: "yearly" },
];
