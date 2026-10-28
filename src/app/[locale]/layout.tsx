import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, locales, localeMeta } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteConfig } from "@/config/site";
import { href } from "@/lib/paths";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsentManager } from "@/components/consent/ConsentManager";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/seo/JsonLd";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: dict.meta.home.title, template: `%s | ${dict.meta.titleSuffix}` },
    description: dict.meta.home.description,
    applicationName: siteConfig.brandName,
    formatDetection: { telephone: false, address: false, email: false },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#14243A",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} dir={localeMeta[locale].dir}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-navy-900 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          {dict.nav.skipToContent}
        </a>
        <Header locale={locale} dict={dict} />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
        <ConsentManager labels={dict.consent} policyHref={href(locale, "cookies")} />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema(locale, siteConfig.brandName)} />
      </body>
    </html>
  );
}
