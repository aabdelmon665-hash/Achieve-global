import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const gaEnabled = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

// Third-party origins are only allowed when the corresponding feature is configured.
const ga = gaEnabled
  ? {
      script: " https://www.googletagmanager.com",
      connect: " https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
      img: " https://*.google-analytics.com https://www.googletagmanager.com",
    }
  : { script: "", connect: "", img: "" };

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${ga.script}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${ga.img}`,
  "font-src 'self'",
  `connect-src 'self'${ga.connect}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Images are pre-sized at build time (scripts/build-brand-assets.mjs), so
    // no runtime optimizer is needed — Cloudflare's would require Images billing.
    unoptimized: true,
  },
  async redirects() {
    return [
      // Every page lives under a language prefix; send the bare domain to English.
      { source: "/", destination: "/en/", permanent: true },
      // Paths without a language prefix (and that are not files, API or Next.js
      // internals) go to their English equivalent, ending on the localized 404.
      {
        source: "/:path((?!en(?:/|$)|tr(?:/|$)|ar(?:/|$)|api(?:/|$)|_next(?:/|$)|cdn-cgi(?:/|$))[^.]*)",
        destination: "/en/:path",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
