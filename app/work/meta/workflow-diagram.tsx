/* ── The workflow as engineering received it ─────────────────────────────

   Two rows on one 1860-unit drawing, traced from the original diagram so it
   sits exactly where the picture did. The top row is the four qualifying
   checks, dotted because they run upstream and out of the advertiser's
   sight; the bottom row is the path an advertiser actually walks once they
   pass, drawn solid and in the case study's chartreuse. One elbow joins the
   last check to the first screen.

   Colour arrives through custom properties set in globals.css so day mode
   can swap the chartreuse for the same tint the page's accent copy already
   takes, and the checks can move from the white ramp onto the day inks. The
   type inherits the section's League Spartan. */

const VIEW_W = 1860;
const VIEW_H = 780;

const CHECK_Y = 184;
const PATH_Y = 626;
const HALF = 140; // diamond half-diagonal
const BOX_W = 280;
const BOX_H = 100;
const GAP = 4; // breathing room between an arrow tip and the shape it points at
const LINE = 28; // text line height, viewBox units

const CHECKS: { x: number; lines: string[] }[] = [
  { x: 332, lines: ["MI eligible"] },
  { x: 725, lines: ["Business verified"] },
  { x: 1118, lines: ["Match LE with BV", "information"] },
  { x: 1511, lines: ["Run Moody’s", "API check on LE"] },
];

type Station = { kind: "box" | "diamond"; x: number; lines: string[] };

const PATH: Station[] = [
  { kind: "box", x: 148, lines: ["Pre-approved", "entry point"] },
  { kind: "box", x: 538, lines: ["How it works"] },
  { kind: "diamond", x: 922, lines: ["Display LE", "information + terms", "and conditions"] },
  { kind: "box", x: 1308, lines: ["Success"] },
  { kind: "box", x: 1698, lines: ["Redirect to", "Accounts page"] },
];

const halfWidth = (station: Station) => (station.kind === "box" ? BOX_W / 2 : HALF);

function diamondPoints(cx: number, cy: number) {
  return `${cx},${cy - HALF} ${cx + HALF},${cy} ${cx},${cy + HALF} ${cx - HALF},${cy}`;
}

/* The elbow from the last check to the first screen: straight down, a
   30-unit turn, straight across, another turn, straight down to the box. */
const ELBOW = (() => {
  const last = CHECKS[CHECKS.length - 1];
  const first = PATH[0];
  const r = 30;
  const runY = 450;
  const top = CHECK_Y + HALF;
  const end = PATH_Y - BOX_H / 2 - GAP;
  return [
    `M${last.x} ${top}`,
    `V${runY - r}`,
    `A${r} ${r} 0 0 1 ${last.x - r} ${runY}`,
    `H${first.x + r}`,
    `A${r} ${r} 0 0 0 ${first.x} ${runY + r}`,
    `V${end}`,
  ].join(" ");
})();

function Label({
  x,
  y,
  lines,
  fill,
}: {
  x: number;
  y: number;
  lines: string[];
  fill: string;
}) {
  const start = y - ((lines.length - 1) * LINE) / 2;
  return (
    <text
      x={x}
      y={start}
      fill={fill}
      fontSize={24}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {lines.map((line, index) => (
        <tspan key={line} x={x} dy={index === 0 ? 0 : LINE}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export default function WorkflowDiagram({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-labelledby="mi-workflow-title"
      className={["mi-workflow-diagram", className].filter(Boolean).join(" ")}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title id="mi-workflow-title">{label}</title>

      <defs>
        <radialGradient id="mi-shape-fill">
          <stop offset="0" stopColor="var(--mi-fill-in)" />
          <stop offset="1" stopColor="var(--mi-fill-out)" />
        </radialGradient>
        <marker
          id="mi-head-check"
          markerUnits="userSpaceOnUse"
          markerWidth="14"
          markerHeight="14"
          refX="14"
          refY="7"
          orient="auto"
        >
          <path d="M0 0 14 7 0 14Z" fill="var(--mi-check)" />
        </marker>
        <marker
          id="mi-head-path"
          markerUnits="userSpaceOnUse"
          markerWidth="14"
          markerHeight="14"
          refX="14"
          refY="7"
          orient="auto"
        >
          <path d="M0 0 14 7 0 14Z" fill="var(--mi-path)" />
        </marker>
      </defs>

      {/* Upstream checks */}
      <g stroke="var(--mi-check)" strokeWidth="2">
        {CHECKS.slice(1).map((check, index) => {
          const prev = CHECKS[index];
          return (
            <line
              key={check.x}
              x1={prev.x + HALF + GAP}
              y1={CHECK_Y}
              x2={check.x - HALF - GAP}
              y2={CHECK_Y}
              markerEnd="url(#mi-head-check)"
            />
          );
        })}
      </g>
      <g stroke="var(--mi-check)" strokeWidth="2.5" strokeDasharray="0.5 6" fill="url(#mi-shape-fill)">
        {CHECKS.map((check) => (
          <polygon key={check.x} points={diamondPoints(check.x, CHECK_Y)} />
        ))}
      </g>
      {CHECKS.map((check) => (
        <Label key={check.x} x={check.x} y={CHECK_Y} lines={check.lines} fill="var(--mi-check-text)" />
      ))}

      {/* The approved path */}
      <g stroke="var(--mi-path)" strokeWidth="2" fill="none">
        <path d={ELBOW} markerEnd="url(#mi-head-path)" />
        {PATH.slice(1).map((station, index) => {
          const prev = PATH[index];
          return (
            <line
              key={station.x}
              x1={prev.x + halfWidth(prev) + GAP}
              y1={PATH_Y}
              x2={station.x - halfWidth(station) - GAP}
              y2={PATH_Y}
              markerEnd="url(#mi-head-path)"
            />
          );
        })}
      </g>
      <g stroke="var(--mi-path)" strokeWidth="2.5" fill="url(#mi-shape-fill)">
        {PATH.map((station) =>
          station.kind === "box" ? (
            <rect
              key={station.x}
              x={station.x - BOX_W / 2}
              y={PATH_Y - BOX_H / 2}
              width={BOX_W}
              height={BOX_H}
            />
          ) : (
            <polygon key={station.x} points={diamondPoints(station.x, PATH_Y)} />
          ),
        )}
      </g>
      {PATH.map((station) => (
        <Label key={station.x} x={station.x} y={PATH_Y} lines={station.lines} fill="var(--mi-path)" />
      ))}
    </svg>
  );
}
