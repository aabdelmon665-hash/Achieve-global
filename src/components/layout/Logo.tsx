/**
 * Typographic placeholder wordmark. Replace with the official logo files
 * once supplied (see docs/OWNER_INFORMATION_REQUIRED.md).
 */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="3" fill="#14243A" />
      <path d="M11 29 20 10l9 19" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="miter" />
      <path d="M8 23.5h24" stroke="#B69A65" strokeWidth="2" />
    </svg>
  );
}

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const text = tone === "dark" ? "text-navy-900" : "text-white";
  return (
    <span className="inline-flex items-center gap-3" dir="ltr">
      <LogoMark />
      <span className={`font-display text-[15px] leading-none tracking-[0.16em] ${text}`} style={{ fontFamily: "var(--font-display)" }}>
        <span className="font-bold">ACHIEVE</span> <span className="font-medium opacity-80">GLOBAL</span>
      </span>
    </span>
  );
}
