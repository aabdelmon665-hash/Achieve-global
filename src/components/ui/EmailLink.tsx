"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

export function EmailLink({ email, className = "", children }: { email: string; className?: string; children?: ReactNode }) {
  return (
    <a
      href={`mailto:${email}`}
      dir="ltr"
      className={className}
      onClick={() => trackEvent("email_click", { address: email })}
    >
      {children ?? email}
    </a>
  );
}
