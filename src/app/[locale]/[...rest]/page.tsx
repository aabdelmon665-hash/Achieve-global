import { notFound } from "next/navigation";

/** Any unknown path under a language prefix renders the localized 404 page. */
export default function CatchAll() {
  notFound();
}
