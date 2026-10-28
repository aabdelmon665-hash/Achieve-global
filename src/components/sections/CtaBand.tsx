import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { href } from "@/lib/paths";
import { ButtonLink } from "@/components/ui/Button";

export function CtaBand({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section aria-labelledby="cta-title" className="on-dark bg-navy-900 text-white">
      <div className="container-page grid gap-10 py-20 lg:grid-cols-12 lg:items-center lg:py-24">
        <div className="lg:col-span-8">
          <span className="mb-6 block h-px w-12 bg-gold" aria-hidden="true" />
          <h2 id="cta-title" className="text-3xl font-semibold tracking-tight !text-white sm:text-4xl">
            {dict.home.cta.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-white/75">{dict.home.cta.text}</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <ButtonLink href={href(locale, "contact")} variant="light" arrow>
            {dict.common.contactTeam}
          </ButtonLink>
          <ButtonLink href={href(locale, "quote")} variant="outlineLight">
            {dict.common.requestQuote}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
