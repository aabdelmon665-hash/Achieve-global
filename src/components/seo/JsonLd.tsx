import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/paths";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot break out of the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Only facts confirmed by the company are included. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.brandName,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.png"),
    email: siteConfig.emails.general,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressCountry: siteConfig.countryCode,
      ...(siteConfig.legal.registeredAddress ? { streetAddress: siteConfig.legal.registeredAddress } : {}),
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: siteConfig.emails.general,
        availableLanguage: ["English", "Turkish", "Arabic"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: siteConfig.emails.exports,
        availableLanguage: ["English", "Turkish", "Arabic"],
      },
    ],
    ...(Object.keys(siteConfig.social).length ? { sameAs: Object.values(siteConfig.social) } : {}),
  };
}

export function websiteSchema(locale: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name,
    inLanguage: locale,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
