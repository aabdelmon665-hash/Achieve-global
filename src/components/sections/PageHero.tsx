import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/** Dark introductory band used at the top of every inner page. */
export function PageHero({
  eyebrow,
  title,
  text,
  crumbs,
  crumbLabel,
  aside,
  children,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  crumbs: Crumb[];
  crumbLabel: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="on-dark relative overflow-hidden bg-navy-900 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />
      <div className={`container-page relative grid gap-12 py-14 lg:py-20 ${aside ? "lg:grid-cols-12 lg:items-center" : ""}`}>
        <div className={aside ? "lg:col-span-7" : "max-w-3xl"}>
          <Breadcrumbs items={crumbs} label={crumbLabel} />
          <p className="eyebrow mt-10">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight !text-white sm:text-5xl">{title}</h1>
          {text && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{text}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" aria-hidden="true" />
    </section>
  );
}
