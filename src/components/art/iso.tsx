/** Tiny isometric projection helpers for the line illustrations. */
const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);

export function iso(x: number, y: number, z: number, ox = 0, oy = 0): [number, number] {
  return [ox + (x - y) * C, oy + (x + y) * S - z];
}

const pts = (list: [number, number][]) => list.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

export type BoxTone = { top: string; left: string; right: string; stroke: string };

export const lightTone: BoxTone = { top: "#FFFFFF", left: "#E9EDF2", right: "#DCE2E9", stroke: "#14243A" };

/** Axis-aligned box with its near-bottom corner at (x, y, z). */
export function IsoBox({
  x, y, z, w, d, h, ox, oy, tone = lightTone, strokeOpacity = 0.55,
}: {
  x: number; y: number; z: number; w: number; d: number; h: number; ox: number; oy: number; tone?: BoxTone; strokeOpacity?: number;
}) {
  const p = (a: number, b: number, c: number) => iso(a, b, c, ox, oy);
  const top = [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)];
  const left = [p(x, y + d, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x, y + d, z + h)];
  const right = [p(x + w, y, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x + w, y, z + h)];
  const common = { stroke: tone.stroke, strokeOpacity, strokeWidth: 1, strokeLinejoin: "round" as const };
  return (
    <g>
      <polygon points={pts(top)} fill={tone.top} {...common} />
      <polygon points={pts(left)} fill={tone.left} {...common} />
      <polygon points={pts(right)} fill={tone.right} {...common} />
    </g>
  );
}

export { pts };
