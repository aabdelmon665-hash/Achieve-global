import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/sections/LegalPage";

type Props = PageProps<"/[locale]/cookie-policy">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const doc = getDictionary(locale).legal.cookies;
  return pageMetadata({ locale, route: "cookies", title: doc.metaTitle, description: doc.metaDescription });
}

export default async function CookiePage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return <LegalPage locale={locale} dict={dict} doc={dict.legal.cookies} route="cookies" />;
}
