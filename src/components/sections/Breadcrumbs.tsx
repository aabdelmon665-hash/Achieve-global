import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <>
      <nav aria-label={label} className="text-sm">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-white/60">
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-white/90">{c.name}</span>
                ) : (
                  <>
                    <Link href={c.path} className="hover:text-white">{c.name}</Link>
                    <span aria-hidden="true" className="text-white/30">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(items)} />
    </>
  );
}
