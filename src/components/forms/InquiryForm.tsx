"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { contactCategories, formDefinitions, validateForm, type ErrorCode, type FieldDef, type FormType } from "@/lib/forms/definitions";
import { fill } from "@/lib/paths";
import { trackEvent } from "@/lib/analytics";
import { Icon } from "@/components/ui/Icon";

type Labels = Dictionary["forms"];
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "success" } | { kind: "error"; message: string };

type Props = {
  formType: FormType;
  locale: Locale;
  labels: Labels;
  submitLabel: string;
  privacyHref: string;
  fallbackEmail: string;
  countries: { value: string; label: string }[];
};

const inputBase =
  "block w-full rounded-sm border bg-white px-4 py-3 text-[15px] text-charcoal shadow-none transition-colors placeholder:text-ink-muted/60 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/10";

export function InquiryForm({ formType, locale, labels, submitLabel, privacyHref, fallbackEmail, countries }: Props) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);
  const [errors, setErrors] = useState<Record<string, ErrorCode>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [defaultCategory, setDefaultCategory] = useState("");

  const fields = formDefinitions[formType];

  useEffect(() => {
    startedAt.current = Date.now();
    if (formType !== "contact") return;
    // Allow links such as /en/contact/?category=partnership to preselect a category.
    const requested = new URLSearchParams(window.location.search).get("category") ?? "";
    // URL is only readable after mount; static pages cannot know it at build time.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if ((contactCategories as readonly string[]).includes(requested)) setDefaultCategory(requested);
  }, [formType]);

  useEffect(() => {
    if (status.kind === "success") successRef.current?.focus();
  }, [status.kind]);

  const fieldId = (name: string) => `${uid}-${name}`;

  function focusFirstError(errs: Record<string, ErrorCode>) {
    const first = [...fields.map((f) => f.name), "consent"].find((n) => errs[n]);
    if (first) document.getElementById(fieldId(first))?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const data = new FormData(e.currentTarget);
    const values: Record<string, unknown> = {};
    for (const f of fields) values[f.name] = String(data.get(f.name) ?? "");
    values.consent = data.get("consent") === "on";

    const result = validateForm(formType, values);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus({ kind: "error", message: labels.errors.summary });
      focusFirstError(result.errors);
      return;
    }

    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/inquiry/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType,
          locale,
          fields: { ...result.values, consent: true },
          website: String(data.get("website") ?? ""),
          startedAt: startedAt.current,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, ErrorCode> };
      if (res.ok && body.ok) {
        setStatus({ kind: "success" });
        trackEvent("inquiry_submitted", { form: formType });
        formRef.current?.reset();
        return;
      }
      if (body.error === "validation" && body.fields) {
        setErrors(body.fields);
        setStatus({ kind: "error", message: labels.errors.summary });
        focusFirstError(body.fields);
        return;
      }
      const key = (body.error ?? "sendFailed") as keyof Labels["status"];
      const template = key in labels.status ? labels.status[key] : labels.status.sendFailed;
      setStatus({ kind: "error", message: fill(template, { email: fallbackEmail }) });
    } catch {
      setStatus({ kind: "error", message: labels.status.network });
    }
  }

  function clearError(name: string) {
    if (!errors[name]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  if (status.kind === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border border-success/30 bg-success/5 p-8 focus:outline-none">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-white">
            <Icon name="check" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-semibold text-navy-900">{labels.status.successTitle}</p>
            <p className="mt-2 text-ink-muted">{labels.status.successText}</p>
            <button
              type="button"
              onClick={() => {
                startedAt.current = Date.now();
                setStatus({ kind: "idle" });
              }}
              className="mt-5 text-sm font-semibold text-navy-900 underline underline-offset-4"
            >
              {labels.status.sendAnother}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fieldLabels = labels.fields as Record<string, { label: string; placeholder: string }>;
  const optionLabels = labels.options as Record<string, Record<string, string>>;

  function renderControl(f: FieldDef) {
    const id = fieldId(f.name);
    const err = errors[f.name];
    const describedBy = err ? `${id}-error` : undefined;
    const common = {
      id,
      name: f.name,
      "aria-invalid": err ? true : undefined,
      "aria-describedby": describedBy,
      "aria-required": f.required || undefined,
      onChange: () => clearError(f.name),
      className: `${inputBase} ${err ? "border-danger" : "border-line"}`,
    };
    const placeholder = fieldLabels[f.name]?.placeholder || undefined;

    switch (f.kind) {
      case "textarea":
        return <textarea {...common} rows={5} maxLength={f.maxLength} placeholder={placeholder} />;
      case "country":
        return (
          <select {...common} defaultValue="" autoComplete="country">
            <option value="" disabled>{labels.countryPlaceholder}</option>
            {countries.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        );
      case "select":
        return (
          <select {...common} key={f.name === "category" ? defaultCategory : undefined} defaultValue={f.name === "category" ? defaultCategory : ""}>
            <option value="" disabled>{labels.selectPlaceholder}</option>
            {f.options?.map((o) => (
              <option key={o} value={o}>{optionLabels[f.optionsKey!]?.[o] ?? o}</option>
            ))}
          </select>
        );
      case "date":
        return <input {...common} type="date" min={new Date().toISOString().slice(0, 10)} />;
      default:
        return (
          <input
            {...common}
            type={f.kind === "email" ? "email" : "text"}
            inputMode={f.kind === "email" ? "email" : undefined}
            dir={f.kind === "email" ? "ltr" : undefined}
            maxLength={f.maxLength}
            autoComplete={f.autoComplete}
            placeholder={placeholder}
          />
        );
    }
  }

  const sending = status.kind === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-busy={sending} className="space-y-6">
      {status.kind === "error" && (
        <div role="alert" className="flex gap-3 border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">{labels.status.errorTitle}</p>
            <p className="mt-1">{status.message}</p>
          </div>
        </div>
      )}

      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        {fields.map((f) => {
          const id = fieldId(f.name);
          const err = errors[f.name];
          return (
            <div key={f.name} className={f.wide || f.kind === "textarea" ? "sm:col-span-2" : undefined}>
              <label htmlFor={id} className="mb-2 block text-sm font-medium text-navy-900">
                {fieldLabels[f.name]?.label ?? f.name}
                {f.required ? (
                  <span className="text-danger" aria-hidden="true"> *</span>
                ) : (
                  <span className="font-normal text-ink-muted"> ({labels.optional})</span>
                )}
              </label>
              {renderControl(f)}
              {err && (
                <p id={`${id}-error`} className="mt-2 text-sm text-danger">
                  {labels.errors[err]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Honeypot — hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>{labels.honeypotLabel}</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id={fieldId("consent")}
            name="consent"
            type="checkbox"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${fieldId("consent")}-error` : undefined}
            onChange={() => clearError("consent")}
            className="mt-1 h-5 w-5 shrink-0 accent-navy-900"
          />
          <label htmlFor={fieldId("consent")} className="text-sm leading-relaxed text-charcoal">
            {labels.consent.before}
            <Link href={privacyHref} target="_blank" className="font-medium text-navy-900 underline underline-offset-2">
              {labels.consent.link}
            </Link>
            {labels.consent.after}
            <span className="text-danger" aria-hidden="true"> *</span>
          </label>
        </div>
        {errors.consent && (
          <p id={`${fieldId("consent")}-error`} className="mt-2 text-sm text-danger">
            {labels.errors.consentRequired}
          </p>
        )}
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">{labels.privacyNote}</p>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full items-center justify-center gap-2.5 rounded-sm bg-navy-900 px-8 py-4 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-navy-800 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {sending ? labels.status.sending : submitLabel}
        {!sending && <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" />}
      </button>
    </form>
  );
}
