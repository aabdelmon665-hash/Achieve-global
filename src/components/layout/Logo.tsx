import Image from "next/image";
import logo from "../../../public/brand/achieve-global-logo.png";

/**
 * Official ACHIEVE GLOBAL logo (original: assets/brand/achieve-global-logo-original.png).
 * Shown unaltered. It is designed for light backgrounds, so on dark surfaces
 * it sits on a white plate rather than being recoloured.
 */
export function Logo({ variant = "header", priority = false }: { variant?: "header" | "footer"; priority?: boolean }) {
  if (variant === "footer") {
    return (
      <span className="inline-flex rounded-sm bg-white p-3">
        <Image src={logo} alt="ACHIEVE GLOBAL" sizes="104px" className="h-[104px] w-auto" />
      </span>
    );
  }
  return (
    <Image
      src={logo}
      alt="ACHIEVE GLOBAL"
      priority={priority}
      sizes="(min-width: 1280px) 72px, 58px"
      className="h-[58px] w-auto xl:h-[72px]"
    />
  );
}
