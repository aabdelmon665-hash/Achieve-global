import "server-only";
import type { FormType } from "@/lib/forms/definitions";
import type { EmailConfig } from "./config";

/**
 * Destination inbox for a submission.
 *  - Food trading & export / export quotations → exports inbox
 *  - Industrial sourcing → sourcing inbox (defaults to general)
 *  - Business services, general, partnership, other → general inbox
 */
export function resolveRecipient(type: FormType, values: Record<string, string>, c: EmailConfig): string {
  switch (type) {
    case "food":
      return c.toExports;
    case "industrial":
      return c.toSourcing;
    case "business":
      return c.toGeneral;
    case "contact":
      if (values.category === "food") return c.toExports;
      if (values.category === "industrial") return c.toSourcing;
      return c.toGeneral;
    default:
      return c.toGeneral;
  }
}
