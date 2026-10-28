import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

export function Notice({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="flex gap-4 border-s-2 border-gold bg-mist p-6">
      <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink" />
      <div className="text-sm leading-relaxed text-charcoal">
        {title && <p className="mb-2 font-semibold text-navy-900">{title}</p>}
        {children}
      </div>
    </aside>
  );
}
