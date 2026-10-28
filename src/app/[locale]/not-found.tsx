import type { Metadata } from "next";
import Link from "next/link";
import { locale as localeParam } from "next/root-params";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { href } from "@/lib/paths";

async function currentLocale() {
  const value = await localeParam();
  return value && isLocale(value) ? value : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await currentLocale());
  return { title: dict.notFound.metaTitle, robots: { index: false } };
}

export default async function NotFound() {
  const locale = await currentLocale();
  const dict = getDictionary(locale);
  const t = dict.notFound;

  return (
    <section className="container-page flex min-h-[60vh] flex-col justify-center py-24">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">{t.title}</h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{t.text}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={href(locale, "home")} className="rounded-sm bg-navy-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-navy-800">
          {t.home}
        </Link>
        <Link href={href(locale, "contact")} className="rounded-sm border border-navy-900/25 px-6 py-3.5 text-sm font-semibold text-navy-900 hover:border-navy-900">
          {dict.nav.contact}
        </Link>
      </div>
    </section>
  );
}
