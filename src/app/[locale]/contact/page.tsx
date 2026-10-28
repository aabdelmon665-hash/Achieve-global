import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { crumbsFor } from "@/lib/crumbs";
import { EXPORTS_MAILBOX_ACTIVE, siteConfig } from "@/config/site";
import { fill } from "@/lib/paths";
import { PageHero } from "@/components/sections/PageHero";
import { InquirySection } from "@/components/forms/InquirySection";
import { EmailLink } from "@/components/ui/EmailLink";
import { Icon } from "@/components/ui/Icon";

type Props = PageProps<"/[locale]/contact">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDictionary(locale);
  const emails = [...new Set(Object.values(siteConfig.emails))].join(" · ");
  return pageMetadata({ locale, route: "contact", title: d.contact.meta.title, description: fill(d.contact.meta.description, { emails }) });
}

export default async function ContactPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const c = dict.contact;

  const channels = [
    { icon: "mail" as const, title: dict.common.generalInquiries, text: c.generalText, email: siteConfig.emails.general },
    { icon: "mail" as const, title: dict.common.exportsInquiries, text: c.exportsText, email: siteConfig.emails.exports },
  ].filter((ch, i) => i === 0 || EXPORTS_MAILBOX_ACTIVE);

  return (
    <>
      <PageHero
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        text={c.hero.text}
        crumbs={crumbsFor(locale, dict, "contact", dict.nav.contact)}
        crumbLabel={dict.nav.breadcrumb}
      />

      <section aria-labelledby="channels-title" className="py-16 lg:py-20">
        <div className="container-page">
          <h2 id="channels-title" className="text-2xl font-semibold tracking-tight">{c.channelsTitle}</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {channels.map((ch) => (
              <li key={ch.title} className="flex flex-col border border-line p-7">
                <Icon name={ch.icon} className="h-6 w-6 text-gold-ink" />
                <h3 className="mt-5 text-base font-semibold">{ch.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{ch.text}</p>
                <EmailLink email={ch.email} className="mt-5 font-semibold break-all text-navy-900 hover:underline" />
              </li>
            ))}
            <li className="flex flex-col border border-line p-7">
              <Icon name="globe" className="h-6 w-6 text-gold-ink" />
              <h3 className="mt-5 text-base font-semibold">{dict.common.officialWebsite}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{c.websiteText}</p>
              <a href={siteConfig.url} dir="ltr" className="mt-5 font-semibold text-navy-900 hover:underline">
                {siteConfig.url.replace("https://", "")}
              </a>
            </li>
          </ul>
          <p className="mt-8 flex items-center gap-2 text-sm text-ink-muted">
            <Icon name="pin" className="h-4 w-4 text-gold-ink" />
            {dict.common.location}
          </p>
        </div>
      </section>

      <InquirySection
        id="contact-form"
        locale={locale}
        dict={dict}
        formType="contact"
        title={c.form.title}
        intro={c.form.intro}
        submitLabel={c.form.submit}
        recipient="general"
      />
    </>
  );
}
