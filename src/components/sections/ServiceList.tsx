/** Numbered grid of service areas used on the division pages. */
export function ServiceList({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.title} className="bg-white p-8">
          <span className="font-display text-sm font-semibold text-gold-ink tabular-nums" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
          <p className="mt-3 leading-relaxed text-ink-muted">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}
