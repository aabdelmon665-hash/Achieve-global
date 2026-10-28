import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { href } from "@/lib/paths";
import { Logo } from "./Logo";
import { HeaderNav } from "./HeaderNav";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const n = dict.nav;
  const items = [
    { href: href(locale, "home"), label: n.home, fullLabel: n.home },
    { href: href(locale, "about"), label: n.about, fullLabel: n.about },
    { href: href(locale, "industrial"), label: n.industrialShort, fullLabel: n.industrial },
    { href: href(locale, "food"), label: n.foodShort, fullLabel: n.food },
    { href: href(locale, "business"), label: n.businessShort, fullLabel: n.business },
    { href: href(locale, "contact"), label: n.contact, fullLabel: n.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href={href(locale, "home")} aria-label={`ACHIEVE GLOBAL — ${n.home}`} className="shrink-0">
          <Logo />
        </Link>
        <HeaderNav
          locale={locale}
          items={items}
          quote={{ href: href(locale, "quote"), label: n.requestQuote }}
          labels={{ openMenu: n.openMenu, closeMenu: n.closeMenu, language: n.language, mainNavigation: n.mainNavigation }}
        />
      </div>
    </header>
  );
}
