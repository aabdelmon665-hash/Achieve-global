import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

type Variant = "primary" | "light" | "outline" | "outlineLight" | "gold";

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-sm px-6 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-200 focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  primary: "bg-navy-900 text-white hover:bg-navy-800",
  light: "bg-white text-navy-900 hover:bg-mist",
  outline: "border border-navy-900/25 text-navy-900 hover:border-navy-900 hover:bg-navy-900 hover:text-white",
  outlineLight: "border border-white/30 text-white hover:border-white hover:bg-white/10",
  gold: "bg-gold text-navy-950 hover:bg-gold-soft",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {arrow && (
        <Icon
          name="arrow"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
        />
      )}
    </Link>
  );
}

export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-sm font-semibold text-navy-900 underline-offset-4 hover:underline ${className}`}
    >
      {children}
      <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
    </Link>
  );
}
