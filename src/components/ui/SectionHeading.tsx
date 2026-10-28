import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  align = "start",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  id?: string;
  align?: "start" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <Tag id={id} className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </Tag>
      {intro && <p className="mt-5 text-lg leading-relaxed text-ink-muted">{intro}</p>}
    </div>
  );
}
