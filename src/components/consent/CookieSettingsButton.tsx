"use client";

import type { ReactNode } from "react";
import { OPEN_CONSENT_EVENT } from "./consent-store";

export function CookieSettingsButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>
      {children}
    </button>
  );
}
