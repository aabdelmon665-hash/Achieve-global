import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * Every public page lives under a language prefix (/en/, /tr/, /ar/).
 * Requests without one — including the bare domain — are redirected to the
 * English equivalent, so unknown paths end on the localized 404 page.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "/" : pathname}`;
  return NextResponse.redirect(url, pathname === "/" ? 308 : 307);
}

export const config = {
  // Skip API routes, Next.js internals and any file with an extension
  // (robots.txt, sitemap.xml, icons, images, fonts).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
