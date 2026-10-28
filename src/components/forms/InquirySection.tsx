import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { FormType } from "@/lib/forms/definitions";
import { countryOptions } from "@/lib/forms/countries";
import { href } from "@/lib/paths";
import { siteConfig } from "@/config/site";
import { EmailLink } from "@/components/ui/EmailLink";
import { InquiryForm } from "./InquiryForm";

/** Form block with an explanatory column; used on every inquiry page. */
export function InquirySection({
  id = "inquiry",
  locale,
  dict,
  formType,
  title,
  intro,
  submitLabel,
  recipient,
  aside,
}: {
  id?: string;
  locale: Locale;
  dict: Dictionary;
  formType: FormType;
  title: string;
  intro: string;
  submitLabel: string;
  recipient: "general" | "exports";
  aside?: ReactNode;
}) {
  const email = siteConfig.emails[recipient];
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 bg-mist">
      <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-4">
          <span className="mb-6 block h-px w-12 bg-gold" aria-hidden="true" />
          <h2 id={`${id}-title`} className="text-3xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-5 leading-relaxed text-ink-muted">{intro}</p>
          <div className="mt-8 border-t border-line pt-6 text-sm">
            <p className="text-ink-muted">{recipient === "exports" ? dict.common.exportsInquiries : dict.common.generalInquiries}</p>
            <EmailLink email={email} className="mt-1 inline-block font-semibold text-navy-900 hover:underline" />
          </div>
          {aside}
        </div>
        <div className="border border-line bg-white p-6 sm:p-10 lg:col-span-8">
          <InquiryForm
            formType={formType}
            locale={locale}
            labels={dict.forms}
            submitLabel={submitLabel}
            privacyHref={href(locale, "privacy")}
            fallbackEmail={email}
            countries={countryOptions(locale)}
          />
        </div>
      </div>
    </section>
  );
}
