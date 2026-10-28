/**
 * Official ACHIEVE GLOBAL logo (original: assets/brand/achieve-global-logo-original.png).
 * Shown unaltered from pre-sized files made by scripts/build-brand-assets.mjs.
 * It is designed for light backgrounds, so on dark surfaces it sits on a
 * white plate rather than being recoloured.
 */
const srcSet = [120, 180, 240, 320].map((w) => `/brand/achieve-global-logo-${w}.webp ${w}w`).join(", ");

export function Logo({ variant = "header", priority = false }: { variant?: "header" | "footer"; priority?: boolean }) {
  if (variant === "footer") {
    return (
      <span className="inline-flex rounded-sm bg-white p-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static files */}
        <img
          src="/brand/achieve-global-logo-240.webp"
          srcSet={srcSet}
          sizes="106px"
          width={240}
          height={236}
          alt="ACHIEVE GLOBAL"
          loading="lazy"
          decoding="async"
          className="h-[104px] w-auto"
        />
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- pre-sized static files
    <img
      src="/brand/achieve-global-logo-180.webp"
      srcSet={srcSet}
      sizes="(min-width: 1280px) 73px, 59px"
      width={180}
      height={177}
      alt="ACHIEVE GLOBAL"
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className="h-[58px] w-auto xl:h-[72px]"
    />
  );
}
