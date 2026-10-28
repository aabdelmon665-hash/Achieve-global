import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { href } from "@/lib/paths";
import { DivisionVisual } from "@/components/art/DivisionVisual";
import { Icon } from "@/components/ui/Icon";

const keys = ["industrial", "food", "business"] as const;
const letters = ["A", "B", "C"];

export function DivisionCards({ locale, dict, headingLevel = "h3" }: { locale: Locale; dict: Dictionary; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {dict.home.divisions.items.map((item, i) => {
        const key = keys[i];
        return (
          <li key={key}>
            <article className="group relative flex h-full flex-col border border-line bg-white transition-shadow duration-300 hover:shadow-xl hover:shadow-navy-900/8">
              <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
                <DivisionVisual division={key} locale={locale} />
                <span className="absolute start-0 top-0 bg-navy-900 px-3 py-1.5 text-xs font-semibold tracking-widest text-white">
                  {dict.common.division} {letters[i]}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <H className="text-xl font-semibold">{item.title}</H>
                <p className="mt-3 flex-1 leading-relaxed text-ink-muted">{item.text}</p>
                <Link
                  href={href(locale, key)}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-900 after:absolute after:inset-0 after:content-['']"
                >
                  {dict.common.learnMore}
                  <span className="sr-only">: {item.title}</span>
                  <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                </Link>
              </div>
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100 rtl:origin-right" aria-hidden="true" />
            </article>
          </li>
        );
      })}
    </ul>
  );
}
