import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/sections/LegalPage";

type Props = PageProps<"/[locale]/privacy-policy">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const doc = getDictionary(locale).legal.privacy;
  return pageMetadata({ locale, route: "privacy", title: doc.metaTitle, description: doc.metaDescription });
}

export default async function PrivacyPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return <LegalPage locale={locale} dict={dict} doc={dict.legal.privacy} route="privacy" />;
}
