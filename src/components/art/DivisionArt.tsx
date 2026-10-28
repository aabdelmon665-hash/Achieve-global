import { IsoBox, iso, pts } from "./iso";

/** Restrained line illustrations used until genuine photography is supplied. */

const frame = "h-full w-full";

function Ground({ ox, oy, w, d }: { ox: number; oy: number; w: number; d: number }) {
  const corners = [iso(-20, -20, 0, ox, oy), iso(w, -20, 0, ox, oy), iso(w, d, 0, ox, oy), iso(-20, d, 0, ox, oy)];
  return <polygon points={pts(corners)} fill="#14243A" fillOpacity="0.04" stroke="#14243A" strokeOpacity="0.12" strokeDasharray="3 4" />;
}

function IBeam({ x, y, z, len, ox, oy }: { x: number; y: number; z: number; len: number; ox: number; oy: number }) {
  return (
    <g>
      <IsoBox x={x} y={y} z={z} w={len} d={36} h={5} ox={ox} oy={oy} />
      <IsoBox x={x} y={y + 15} z={z + 5} w={len} d={6} h={30} ox={ox} oy={oy} />
      <IsoBox x={x} y={y} z={z + 35} w={len} d={36} h={5} ox={ox} oy={oy} />
    </g>
  );
}

export function IndustrialArt({ className = frame }: { className?: string }) {
  const ox = 215;
  const oy = 70;
  return (
    <svg viewBox="0 0 480 300" className={className} aria-hidden="true" focusable="false">
      <Ground ox={ox} oy={oy} w={330} d={130} />
      {/* beam stack */}
      {[0, 44, 88].map((y) => (
        <IBeam key={`a${y}`} x={0} y={y} z={0} len={190} ox={ox} oy={oy} />
      ))}
      {[22, 66].map((y) => (
        <IBeam key={`b${y}`} x={0} y={y} z={40} len={190} ox={ox} oy={oy} />
      ))}
      {/* plate stack */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <IsoBox key={i} x={225} y={10} z={i * 7} w={90} d={110} h={7} ox={ox} oy={oy} />
      ))}
      {/* accent: one plate edge */}
      <polyline
        points={pts([iso(315, 10, 42, ox, oy), iso(315, 120, 42, ox, oy), iso(225, 120, 42, ox, oy)])}
        fill="none"
        stroke="#B69A65"
        strokeWidth="2"
      />
    </svg>
  );
}

export function FoodArt({ className = frame }: { className?: string }) {
  const ox = 230;
  const oy = 52;
  const carton = 46;
  const cartonH = 34;
  const boxes: { x: number; y: number; z: number }[] = [];
  for (let layer = 0; layer < 3; layer++)
    for (let y = 0; y < 3; y++)
      for (let x = 0; x < 3; x++) {
        if (layer === 2 && x === 2 && y === 2) continue; // an open space on top reads as a real pallet
        boxes.push({ x: x * carton, y: y * carton, z: 14 + layer * cartonH });
      }
  boxes.sort((a, b) => a.z - b.z || a.x + a.y - (b.x + b.y));

  const smallOx = 95;
  const smallOy = 150;

  return (
    <svg viewBox="0 0 480 300" className={className} aria-hidden="true" focusable="false">
      <Ground ox={ox} oy={oy} w={160} d={160} />
      {/* pallet */}
      <IsoBox x={0} y={0} z={0} w={138} d={138} h={4} ox={ox} oy={oy} />
      {[0, 63, 126].map((y) => (
        <IsoBox key={y} x={0} y={y} z={4} w={138} d={12} h={6} ox={ox} oy={oy} />
      ))}
      <IsoBox x={0} y={0} z={10} w={138} d={138} h={4} ox={ox} oy={oy} />
      {boxes.map((b, i) => (
        <g key={i}>
          <IsoBox x={b.x} y={b.y} z={b.z} w={carton} d={carton} h={cartonH} ox={ox} oy={oy} />
          {/* sealing tape */}
          <line
            x1={iso(b.x, b.y + carton / 2, b.z + cartonH, ox, oy)[0]}
            y1={iso(b.x, b.y + carton / 2, b.z + cartonH, ox, oy)[1]}
            x2={iso(b.x + carton, b.y + carton / 2, b.z + cartonH, ox, oy)[0]}
            y2={iso(b.x + carton, b.y + carton / 2, b.z + cartonH, ox, oy)[1]}
            stroke="#B69A65"
            strokeWidth="1.6"
          />
        </g>
      ))}
      {/* a few loose retail packs */}
      {[0, 1, 2].map((i) => (
        <IsoBox key={`p${i}`} x={i * 22} y={0} z={0} w={16} d={8} h={34 - i * 4} ox={smallOx} oy={smallOy} />
      ))}
    </svg>
  );
}

export function BusinessArt({ className = frame }: { className?: string }) {
  const stroke = { fill: "#FFFFFF", stroke: "#14243A", strokeOpacity: 0.7, strokeWidth: 1.3, strokeLinejoin: "round" as const };
  const minaret = (x: number, top: number) => (
    <g>
      <rect x={x - 3.5} y={top} width="7" height={226 - top} {...stroke} />
      <rect x={x - 6} y={top + 30} width="12" height="4" {...stroke} />
      <rect x={x - 6} y={top + 62} width="12" height="4" {...stroke} />
      <path d={`M${x - 3.5} ${top} L${x} ${top - 26} L${x + 3.5} ${top} Z`} {...stroke} />
    </g>
  );
  return (
    <svg viewBox="0 0 480 300" className={className} aria-hidden="true" focusable="false">
      {/* background blocks */}
      <g fill="#14243A" fillOpacity="0.05" stroke="#14243A" strokeOpacity="0.18">
        <rect x="24" y="196" width="40" height="30" />
        <rect x="60" y="206" width="34" height="20" />
        <rect x="272" y="200" width="44" height="26" />
        <rect x="312" y="190" width="24" height="36" />
        <rect x="396" y="204" width="30" height="22" />
      </g>

      {/* mosque */}
      {minaret(104, 112)}
      {minaret(248, 112)}
      <rect x="120" y="190" width="112" height="36" {...stroke} />
      <path d="M120 194 A16 16 0 0 1 152 194 Z" {...stroke} />
      <path d="M200 194 A16 16 0 0 1 232 194 Z" {...stroke} />
      <rect x="142" y="178" width="68" height="14" {...stroke} />
      <path d="M140 179 A36 36 0 0 1 212 179 Z" {...stroke} />
      <line x1="176" y1="143" x2="176" y2="130" stroke="#B69A65" strokeWidth="1.6" />
      {[134, 152, 170, 188, 206].map((x) => (
        <path key={x} d={`M${x} 226 v-14 a4 4 0 0 1 8 0 v14`} fill="none" stroke="#14243A" strokeOpacity="0.4" />
      ))}

      {/* tower */}
      <rect x="350" y="134" width="30" height="92" {...stroke} />
      <rect x="346" y="128" width="38" height="8" {...stroke} />
      <path d="M347 128 L365 84 L383 128 Z" {...stroke} />
      {[150, 172, 194].map((y) => (
        <path key={y} d={`M361 ${y + 12} v-8 a4 4 0 0 1 8 0 v8`} fill="none" stroke="#14243A" strokeOpacity="0.45" />
      ))}

      {/* bridge */}
      <path d="M430 226 V150 M438 226 V150 M428 150 h12" fill="none" stroke="#14243A" strokeOpacity="0.6" strokeWidth="1.3" />
      <path d="M434 150 Q458 196 480 200 M434 150 Q412 196 380 205" fill="none" stroke="#14243A" strokeOpacity="0.45" />
      <line x1="370" y1="208" x2="480" y2="208" stroke="#14243A" strokeOpacity="0.5" strokeWidth="1.3" />

      {/* shoreline & water */}
      <line x1="16" y1="226" x2="464" y2="226" stroke="#14243A" strokeOpacity="0.7" strokeWidth="1.3" />
      <g stroke="#14243A" strokeOpacity="0.22" strokeDasharray="14 10">
        <line x1="40" y1="242" x2="440" y2="242" />
        <line x1="80" y1="256" x2="400" y2="256" strokeDashoffset="8" />
        <line x1="130" y1="270" x2="350" y2="270" />
      </g>
      <line x1="150" y1="242" x2="230" y2="242" stroke="#B69A65" strokeWidth="1.6" />
    </svg>
  );
}

export const divisionArt = {
  industrial: IndustrialArt,
  food: FoodArt,
  business: BusinessArt,
} as const;
