export function HeroAnimation() {
  return (
    <svg
      viewBox="0 0 600 360"
      className="h-full w-full"
      role="img"
      aria-label="An SD card sliding into a camera"
    >
      {/* ---------- Camera body (front 3/4 line-art) ---------- */}
      <g fill="none" stroke="#0e0e10" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        {/* viewfinder bump on top */}
        <path d="M225 95 L255 95 L260 110 L220 110 Z" />

        {/* main body */}
        <rect x="135" y="110" width="220" height="150" rx="8" />

        {/* grip on right side */}
        <path d="M355 130 Q380 135 380 170 Q380 220 355 235" />

        {/* lens outer */}
        <circle cx="245" cy="190" r="58" />
        {/* lens mid ring */}
        <circle cx="245" cy="190" r="46" />
        {/* lens glass */}
        <circle cx="245" cy="190" r="32" fill="#0e0e10" />
        {/* lens highlight */}
        <ellipse cx="232" cy="178" rx="8" ry="5" fill="#fafaf7" stroke="none" />

        {/* mode dial */}
        <circle cx="320" cy="135" r="10" />

        {/* shutter button */}
        <circle cx="345" cy="125" r="5" />

        {/* small viewfinder window */}
        <rect x="155" y="125" width="20" height="14" rx="2" />

        {/* brand placeholder line */}
        <line x1="270" y1="130" x2="305" y2="130" />

        {/* SD card slot on right edge of body */}
        <rect x="385" y="180" width="6" height="36" rx="1" fill="#0e0e10" />
        <line x1="385" y1="180" x2="385" y2="216" strokeWidth="1" />
      </g>

      {/* LED indicator (blinks when card seats) */}
      <circle cx="365" cy="155" r="4" fill="#0e0e10" className="led-light" />

      {/* ---------- SD card (animates leftward into slot) ---------- */}
      <g className="sd-card">
        {/* card body, chamfered top-right corner */}
        <g
          fill="#fafaf7"
          stroke="#0e0e10"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path d="M600 175 L600 225 L520 225 L520 178 L523 175 Z" />
          {/* contact stripes */}
          <line x1="528" y1="183" x2="528" y2="195" />
          <line x1="535" y1="183" x2="535" y2="195" />
          <line x1="542" y1="183" x2="542" y2="195" />
          <line x1="549" y1="183" x2="549" y2="195" />
          <line x1="556" y1="183" x2="556" y2="195" />
          <line x1="563" y1="183" x2="563" y2="195" />
          <line x1="570" y1="183" x2="570" y2="195" />
          {/* lock switch nub */}
          <rect x="592" y="200" width="6" height="9" />
        </g>
        {/* label area */}
        <text
          x="560"
          y="218"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#0e0e10"
          fontFamily="ui-sans-serif, system-ui"
          letterSpacing="1"
        >
          PICKA.
        </text>
      </g>

      {/* ---------- Shutter flash overlay (subtle) ---------- */}
      <circle cx="245" cy="190" r="58" fill="#fafaf7" className="shutter-flash" />
    </svg>
  );
}
