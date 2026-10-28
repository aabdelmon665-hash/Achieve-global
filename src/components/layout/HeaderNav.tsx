"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { Icon } from "@/components/ui/Icon";

type NavItem = { href: string; label: string; fullLabel: string };

type Props = {
  locale: Locale;
  items: NavItem[];
  quote: { href: string; label: string };
  labels: { openMenu: string; closeMenu: string; language: string; mainNavigation: string };
};

/** Same page in another language: swap the first path segment. */
function switchLocalePath(pathname: string, target: Locale) {
  const parts = pathname.split("/");
  parts[1] = target;
  return parts.join("/") || `/${target}/`;
}

function isActive(pathname: string, href: string, locale: Locale) {
  if (href === `/${locale}/`) return pathname === href || pathname === `/${locale}`;
  return pathname.startsWith(href.replace(/\/$/, ""));
}

function LanguageLinks({ locale, pathname, label, full = false }: { locale: Locale; pathname: string; label: string; full?: boolean }) {
  return (
    <nav aria-label={label}>
      <ul className={full ? "grid grid-cols-3 gap-2" : "flex items-center"}>
        {locales.map((l) => {
          const current = l === locale;
          return (
            <li key={l}>
              <a
                href={switchLocalePath(pathname, l)}
                hrefLang={localeMeta[l].hreflang}
                lang={l}
                aria-current={current ? "true" : undefined}
                className={
                  full
                    ? `block rounded-sm border px-3 py-2.5 text-center text-sm ${current ? "border-navy-900 bg-navy-900 text-white" : "border-line text-navy-900 hover:border-navy-900"}`
                    : `block px-2 py-1 text-xs font-semibold tracking-wider ${current ? "text-navy-900" : "text-ink-muted hover:text-navy-900"}`
                }
              >
                {full ? localeMeta[l].name : l === "ar" ? "عربي" : l.toUpperCase()}
                {!full && current && <span className="mx-auto mt-0.5 block h-px w-full bg-gold" aria-hidden="true" />}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function HeaderNav({ locale, items, quote, labels }: Props) {
  const pathname = usePathname() || `/${locale}/`;
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the menu when navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1280 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      {/* Desktop */}
      <nav aria-label={labels.mainNavigation} className="hidden xl:block">
        <ul className="flex items-center gap-1">
          {items.map((item) => {
            const active = isActive(pathname, item.href, locale);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={item.fullLabel !== item.label ? item.fullLabel : undefined}
                  aria-current={active ? "page" : undefined}
                  className={`relative block px-3 py-2 text-[13.5px] font-medium transition-colors ${active ? "text-navy-900" : "text-ink-muted hover:text-navy-900"}`}
                >
                  {item.label}
                  {active && <span className="absolute inset-x-3 -bottom-px h-px bg-gold" aria-hidden="true" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden items-center gap-4 xl:flex">
        <LanguageLinks locale={locale} pathname={pathname} label={labels.language} />
        <Link
          href={quote.href}
          className="rounded-sm bg-navy-900 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-navy-800"
        >
          {quote.label}
        </Link>
      </div>

      {/* Mobile & tablet */}
      <div className="flex items-center gap-2 xl:hidden">
        <Link
          href={quote.href}
          className="hidden rounded-sm bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white sm:inline-block"
        >
          {quote.label}
        </Link>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-navy-900 hover:bg-mist"
        >
          <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          <span className="sr-only">{open ? labels.closeMenu : labels.openMenu}</span>
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 top-[var(--header-h)] bottom-0 z-40 overflow-y-auto border-t border-line bg-white xl:hidden"
      >
        <div className="container-page flex min-h-full flex-col py-6">
          <nav aria-label={labels.mainNavigation}>
            <ul className="divide-y divide-line">
              {items.map((item) => {
                const active = isActive(pathname, item.href, locale);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between py-4 text-lg font-medium ${active ? "text-navy-900" : "text-charcoal"}`}
                    >
                      {item.fullLabel}
                      <Icon name="arrow" className={`h-4 w-4 rtl:-scale-x-100 ${active ? "text-gold" : "text-line"}`} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold tracking-widest text-ink-muted uppercase">{labels.language}</p>
            <LanguageLinks locale={locale} pathname={pathname} label={labels.language} full />
          </div>
          <Link
            href={quote.href}
            className="mt-8 block rounded-sm bg-navy-900 px-6 py-4 text-center font-semibold text-white"
          >
            {quote.label}
          </Link>
        </div>
      </div>
    </>
  );
}
