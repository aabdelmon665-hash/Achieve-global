"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { analyticsAvailable, analyticsId } from "@/lib/analytics";
import { OPEN_CONSENT_EVENT, readConsent, writeConsent } from "./consent-store";

type Labels = {
  title: string;
  text: string;
  accept: string;
  reject: string;
  customize: string;
  save: string;
  necessaryTitle: string;
  necessaryText: string;
  analyticsTitle: string;
  analyticsText: string;
  policyLink: string;
  alwaysOn: string;
};

/**
 * Cookie consent banner and consent-gated analytics loader.
 * Renders nothing at all while no analytics provider is configured, because
 * the site then uses no technologies that require consent.
 */
export function ConsentManager({ labels, policyHref }: { labels: Labels; policyHref: string }) {
  const [analytics, setAnalytics] = useState(false);
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [draft, setDraft] = useState(false);

  useEffect(() => {
    if (!analyticsAvailable) return;
    const stored = readConsent();
    // Reading browser storage is only possible after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setAnalytics(stored.analytics);
    else setOpen(true);
    const reopen = () => {
      setDraft(readConsent()?.analytics ?? false);
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!analyticsAvailable) return null;

  const decide = (value: boolean) => {
    writeConsent(value);
    // Withdrawing consent: reload so already-loaded scripts are discarded.
    if (analytics && !value) window.location.reload();
    setAnalytics(value);
    setOpen(false);
    setDetails(false);
  };

  return (
    <>
      {analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${analyticsId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-sm border border-line bg-white p-6 shadow-2xl shadow-navy-950/20 sm:inset-x-auto sm:end-6 sm:bottom-6"
        >
          <h2 id="consent-title" className="text-base font-semibold">{labels.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {labels.text}{" "}
            <Link href={policyHref} className="font-medium text-navy-900 underline underline-offset-2">
              {labels.policyLink}
            </Link>
          </p>

          {details && (
            <fieldset className="mt-5 space-y-3 border-t border-line pt-5">
              <legend className="sr-only">{labels.customize}</legend>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-navy-900">{labels.necessaryTitle}</p>
                  <p className="text-xs text-ink-muted">{labels.necessaryText}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-ink-muted">{labels.alwaysOn}</span>
              </div>
              <label className="flex cursor-pointer items-start justify-between gap-4">
                <span>
                  <span className="block text-sm font-semibold text-navy-900">{labels.analyticsTitle}</span>
                  <span className="block text-xs text-ink-muted">{labels.analyticsText}</span>
                </span>
                <input
                  type="checkbox"
                  checked={draft}
                  onChange={(e) => setDraft(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-navy-900"
                />
              </label>
            </fieldset>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {details ? (
              <button type="button" onClick={() => decide(draft)} className="rounded-sm bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white">
                {labels.save}
              </button>
            ) : (
              <>
                <button type="button" onClick={() => decide(true)} className="rounded-sm bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white">
                  {labels.accept}
                </button>
                <button type="button" onClick={() => decide(false)} className="rounded-sm bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white">
                  {labels.reject}
                </button>
                <button type="button" onClick={() => setDetails(true)} className="rounded-sm border border-line px-4 py-2.5 text-sm font-semibold text-navy-900">
                  {labels.customize}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
