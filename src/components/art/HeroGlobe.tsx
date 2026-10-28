/**
 * Wireframe globe with routes radiating from Istanbul. Decorative: the
 * destination points are abstract and do not represent specific markets.
 */
const R = 210;
const CX = 280;
const CY = 280;
const LON0 = 22; // central meridian, degrees east
const toRad = (d: number) => (d * Math.PI) / 180;

function project(lat: number, lon: number): [number, number] {
  const x = CX + R * Math.cos(toRad(lat)) * Math.sin(toRad(lon - LON0));
  const y = CY - R * Math.sin(toRad(lat));
  return [x, y];
}

const hub = project(41, 29);
const destinations: [number, number][] = [
  [52, -2], [48, 12], [25, 50], [24, 55], [31, 30], [6, 3], [-26, 28], [40, 70], [1, 104], [36, -6], [60, 25], [-5, 40],
].map(([lat, lon]) => project(lat, lon));

function arc([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  // Lift the control point perpendicular to the chord, away from the globe centre.
  let nx = -dy / len;
  let ny = dx / len;
  if ((mx - CX) * nx + (my - CY) * ny < 0) { nx = -nx; ny = -ny; }
  const lift = Math.min(70, len * 0.35);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${(mx + nx * lift).toFixed(1)} ${(my + ny * lift).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export function HeroGlobe({ label, tone = "dark", className = "" }: { label?: string; tone?: "dark" | "light"; className?: string }) {
  const line = tone === "dark" ? "#FFFFFF" : "#14243A";
  const faint = tone === "dark" ? 0.1 : 0.12;
  const rim = tone === "dark" ? 0.32 : 0.35;
  const latitudes = [-60, -40, -20, 0, 20, 40, 60];
  const meridians = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75];

  return (
    <svg viewBox="0 0 560 560" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`glow-${tone}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={tone === "dark" ? "#2A4466" : "#FFFFFF"} stopOpacity={tone === "dark" ? 0.55 : 1} />
          <stop offset="100%" stopColor={tone === "dark" ? "#14243A" : "#F4F6F8"} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={CX} cy={CY} r={R + 50} fill={`url(#glow-${tone})`} />

      {/* outer instrument ring */}
      <circle cx={CX} cy={CY} r={R + 34} fill="none" stroke={line} strokeOpacity={faint} />
      {Array.from({ length: 72 }, (_, i) => {
        const a = toRad(i * 5);
        const r1 = R + 34;
        const r2 = R + (i % 6 === 0 ? 44 : 39);
        return (
          <line
            key={i}
            x1={CX + r1 * Math.cos(a)} y1={CY + r1 * Math.sin(a)}
            x2={CX + r2 * Math.cos(a)} y2={CY + r2 * Math.sin(a)}
            stroke={line} strokeOpacity={i % 6 === 0 ? rim : faint}
          />
        );
      })}

      {/* graticule */}
      <g fill="none" stroke={line} strokeOpacity={faint} strokeWidth="1">
        {latitudes.map((lat) => {
          const y = CY - R * Math.sin(toRad(lat));
          const half = R * Math.cos(toRad(lat));
          return <line key={lat} x1={CX - half} x2={CX + half} y1={y} y2={y} />;
        })}
        {meridians.map((m) => (
          <ellipse key={m} cx={CX} cy={CY} rx={Math.abs(R * Math.sin(toRad(m)))} ry={R} />
        ))}
      </g>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={line} strokeOpacity={rim} strokeWidth="1.25" />

      {/* routes */}
      <g fill="none" stroke="#B69A65" strokeWidth="1.4" strokeLinecap="round">
        {destinations.map((d, i) => (
          <path key={i} d={arc(hub, d)} strokeOpacity={0.85} strokeDasharray={i % 3 === 0 ? "0" : "3 5"} />
        ))}
      </g>
      {destinations.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={tone === "dark" ? "#14243A" : "#FFFFFF"} stroke="#B69A65" strokeWidth="1.4" />
      ))}

      {/* hub */}
      <circle cx={hub[0]} cy={hub[1]} r="16" fill="#B69A65" fillOpacity="0.16" />
      <circle cx={hub[0]} cy={hub[1]} r="6.5" fill="#B69A65" />
      {label && (
        <g>
          <line x1={hub[0] + 10} y1={hub[1] - 10} x2={hub[0] + 42} y2={hub[1] - 42} stroke="#B69A65" strokeWidth="1" />
          <text
            x={hub[0] + 48}
            y={hub[1] - 46}
            fill={line}
            fillOpacity="0.85"
            fontSize="13"
            letterSpacing="2.5"
            fontFamily="Inter Variable, Arial, sans-serif"
            fontWeight="600"
          >
            {label}
          </text>
        </g>
      )}
    </svg>
  );
}
