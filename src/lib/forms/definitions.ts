/**
 * Inquiry form definitions shared by the browser and the server.
 * Labels live in the dictionaries (forms.fields.<name>); validation lives here
 * so both sides apply exactly the same rules.
 */
import { isCountryCode } from "./countries";

export const formTypes = ["industrial", "food", "business", "contact"] as const;
export type FormType = (typeof formTypes)[number];

export const contactCategories = ["general", "industrial", "food", "business", "partnership", "other"] as const;
export type ContactCategory = (typeof contactCategories)[number];

export const brandOptions = ["existing", "privateLabel", "both", "undecided"] as const;
export const serviceOptions = ["establishment", "marketEntry", "partnerResearch", "professionals", "administrative", "other"] as const;

export type FieldKind = "text" | "email" | "textarea" | "select" | "country" | "date";

export type FieldDef = {
  name: string;
  kind: FieldKind;
  required: boolean;
  maxLength: number;
  /** Option keys for `select`; labels are in forms.options.<optionsKey>. */
  options?: readonly string[];
  optionsKey?: "brand" | "service" | "category";
  autoComplete?: string;
  /** Spans both columns on wide screens. */
  wide?: boolean;
};

const fullName: FieldDef = { name: "fullName", kind: "text", required: true, maxLength: 120, autoComplete: "name" };
const companyName: FieldDef = { name: "companyName", kind: "text", required: true, maxLength: 160, autoComplete: "organization" };
const businessEmail: FieldDef = { name: "email", kind: "email", required: true, maxLength: 160, autoComplete: "email" };
const country: FieldDef = { name: "country", kind: "country", required: true, maxLength: 2, autoComplete: "country" };

export const formDefinitions: Record<FormType, FieldDef[]> = {
  industrial: [
    fullName,
    companyName,
    businessEmail,
    country,
    { name: "product", kind: "text", required: true, maxLength: 200, wide: true },
    { name: "quantity", kind: "text", required: true, maxLength: 120 },
    { name: "deliveryDate", kind: "date", required: false, maxLength: 10 },
    { name: "specifications", kind: "textarea", required: false, maxLength: 3000, wide: true },
    { name: "details", kind: "textarea", required: false, maxLength: 3000, wide: true },
  ],
  food: [
    fullName,
    companyName,
    businessEmail,
    country,
    { name: "foodProduct", kind: "text", required: true, maxLength: 200, wide: true },
    { name: "brandRequirement", kind: "select", required: true, maxLength: 20, options: brandOptions, optionsKey: "brand" },
    { name: "orderQuantity", kind: "text", required: true, maxLength: 120 },
    { name: "targetMarket", kind: "text", required: true, maxLength: 160, wide: true },
    { name: "details", kind: "textarea", required: false, maxLength: 3000, wide: true },
  ],
  business: [
    fullName,
    { ...companyName, name: "companyNameOptional", required: false },
    businessEmail,
    { ...country, name: "residenceCountry" },
    { name: "service", kind: "select", required: true, maxLength: 20, options: serviceOptions, optionsKey: "service", wide: true },
    { name: "description", kind: "textarea", required: true, maxLength: 3000, wide: true },
  ],
  contact: [
    fullName,
    { ...companyName, required: false },
    { ...businessEmail, name: "contactEmail" },
    country,
    { name: "category", kind: "select", required: true, maxLength: 20, options: contactCategories, optionsKey: "category" },
    { name: "subject", kind: "text", required: true, maxLength: 160 },
    { name: "message", kind: "textarea", required: true, maxLength: 5000, wide: true },
  ],
};

export type ErrorCode = "required" | "invalidEmail" | "tooLong" | "invalidOption" | "invalidDate" | "consentRequired";

// Pragmatic address check; the mail provider performs the definitive one.
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type ValidationResult =
  | { ok: true; values: Record<string, string> }
  | { ok: false; errors: Record<string, ErrorCode> };

/** Validate untrusted input against a form definition. Unknown fields are dropped. */
export function validateForm(type: FormType, input: Record<string, unknown>): ValidationResult {
  const errors: Record<string, ErrorCode> = {};
  const values: Record<string, string> = {};

  for (const field of formDefinitions[type]) {
    const raw = input[field.name];
    const value = typeof raw === "string" ? raw.trim() : "";

    if (!value) {
      if (field.required) errors[field.name] = "required";
      continue;
    }
    if (value.length > field.maxLength) {
      errors[field.name] = "tooLong";
      continue;
    }
    if (field.kind === "email" && !EMAIL_RE.test(value)) {
      errors[field.name] = "invalidEmail";
      continue;
    }
    if (field.kind === "country" && !isCountryCode(value)) {
      errors[field.name] = "invalidOption";
      continue;
    }
    if (field.kind === "select" && !field.options?.includes(value)) {
      errors[field.name] = "invalidOption";
      continue;
    }
    if (field.kind === "date" && (!DATE_RE.test(value) || Number.isNaN(Date.parse(value)))) {
      errors[field.name] = "invalidDate";
      continue;
    }
    values[field.name] = value;
  }

  if (input.consent !== true && input.consent !== "true" && input.consent !== "on") {
    errors.consent = "consentRequired";
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, values };
}

export function isFormType(v: unknown): v is FormType {
  return typeof v === "string" && (formTypes as readonly string[]).includes(v);
}
