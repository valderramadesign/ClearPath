"use client";

import { useRef, type CSSProperties } from "react";
import { type StaticImageData } from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";

export type DashboardVariant =
  | "action"
  | "brief"
  | "console"
  | "next-best-action"
  | "care-journey"
  | "guided-concierge";

type Props = {
  image: StaticImageData;
  alt: string;
  variant: DashboardVariant;
  className?: string;
  style?: CSSProperties;
};

/**
 * Stitch-style "being generated" reveal for the Discovery dashboards.
 *
 * Instead of fading zones, each dashboard is assembled one component at a
 * time — exactly the mechanic Stitch uses: fully-formed pieces (a nav item, a
 * KPI card, a panel section) pop onto a shimmering canvas in build order while
 * a purple cursor hops beside each new component. Every piece is revealed via
 * its own clip-path window over the same image — no extra assets.
 *
 * Rects are [x, y, w, h] in each PNG's own pixel grid, mapped to percentages
 * against image.width / image.height, so 1x and 2x exports both work. They
 * were authored against the Figma frame and verified against the source.
 * A full-image crossfade at the end fills hairline gaps
 * (container borders, dividers) not covered by component rects.
 */
const STEPS: Record<DashboardVariant, [number, number, number, number][]> = {
  // Minimal Action-First Planning Dashboard (PNG 1280x1031)
  action: [
    [24, 64, 207, 96], // product name
    [12, 160, 231, 40], // nav 1
    [12, 204, 231, 44], // nav 2
    [12, 252, 231, 45], // nav 3
    [12, 301, 231, 43], // nav 4
    [12, 348, 231, 44], // nav 5
    [24, 960, 207, 40], // Create Scenario
    [304, 12, 576, 38], // search
    [1072, 10, 184, 43], // top-right actions
    [304, 112, 180, 124], // heading
    [304, 236, 196, 48], // sub copy
    [508, 246, 292, 38], // filter dropdowns
    [304, 332, 90, 126], // KPI 1
    [405, 332, 91, 126], // KPI 2
    [507, 332, 91, 126], // KPI 3
    [608, 332, 91, 126], // KPI 4
    [710, 332, 91, 126], // KPI 5
    [304, 506, 240, 37], // action list heading
    [304, 555, 496, 205], // action card 1
    [304, 772, 496, 203], // action card 2
    [872, 114, 336, 78], // panel header
    [872, 216, 336, 43], // workflow stepper
    [872, 283, 336, 92], // what changed
    [872, 399, 336, 60], // why it matters
    [872, 483, 336, 142], // recommended action
    [872, 649, 336, 95], // expandable sections
  ],
  // Decision Brief Dashboard (PNG 1280x1040)
  brief: [
    [24, 64, 220, 88], // product name
    [24, 168, 207, 42], // Create Scenario
    [12, 234, 231, 40], // nav 1
    [12, 278, 231, 44], // nav 2
    [12, 326, 231, 45], // nav 3
    [12, 375, 231, 43], // nav 4
    [12, 422, 231, 44], // nav 5
    [280, 17, 320, 30], // page title
    [1096, 14, 160, 34], // top-right actions
    [293, 101, 271, 30], // period tabs
    [576, 101, 436, 30], // dropdowns
    [280, 143, 700, 17], // freshness row
    [304, 246, 600, 28], // hero badge + heading
    [304, 286, 594, 116], // hero narrative
    [304, 414, 594, 66], // recommended box
    [304, 569, 600, 46], // evidence buttons
    [970, 245, 262, 21], // decisions heading
    [946, 278, 310, 173], // decision card 1
    [946, 463, 310, 153], // decision card 2
    [280, 714, 476, 16], // what changed heading
    [305, 754, 207, 122], // stat card 1
    [524, 754, 207, 122], // stat card 2
    [305, 896, 207, 122], // stat card 3
    [524, 896, 207, 122], // stat card 4
    [780, 714, 476, 16], // business impact heading
    [780, 754, 476, 110], // impact rows 1–2
    [780, 876, 476, 110], // impact rows 3–4
  ],
  // Promotion Profitability Console (PNG 1280x1040)
  console: [
    [24, 64, 207, 48], // product name
    [12, 160, 231, 40], // nav 1
    [12, 204, 231, 44], // nav 2
    [12, 252, 231, 45], // nav 3
    [12, 301, 231, 43], // nav 4
    [12, 348, 231, 44], // nav 5
    [24, 736, 207, 40], // sidebar action
    [280, 11, 305, 41], // page title
    [896, 18, 360, 26], // header status pills
    [280, 76, 186, 50], // filter: date range
    [478, 76, 186, 50], // filter: geography
    [675, 76, 186, 50], // filter: business line
    [873, 76, 186, 50], // filter: campaign type
    [1123, 94, 133, 32], // apply button
    [280, 163, 226, 158], // summary card 1
    [530, 163, 226, 158], // summary card 2
    [780, 163, 226, 158], // summary card 3
    [1030, 163, 226, 158], // summary card 4
    [280, 345, 643, 271], // campaign decision queue
    [280, 640, 643, 396], // portfolio visualization
    [973, 371, 257, 20], // detail panel intro
    [973, 415, 257, 61], // detail panel status
    [973, 500, 257, 106], // detail metrics
    [973, 630, 257, 83], // detail breakdown
    [973, 737, 257, 123], // detail recommendation
    [973, 884, 257, 140], // detail actions
  ],
  // Patient Portal — Next Best Action (PNG 2560x3036, 2x export)
  "next-best-action": [
    [65, 37, 327, 53], // product name
    [995, 37, 294, 53], // nav 1–2
    [1314, 51, 234, 27], // nav 3–4
    [1559, 52, 204, 28], // nav 5–6
    [2380, 52, 116, 29], // sign out
    [65, 206, 1485, 95], // greeting
    [65, 337, 858, 35], // sub copy
    [65, 487, 609, 47], // "what needs your attention"
    [64, 588, 1606, 546], // action card 1
    [64, 1168, 1606, 498], // action card 2
    [64, 1700, 1606, 502], // action card 3
    [65, 2281, 463, 48], // "your upcoming care"
    [64, 2382, 1606, 420], // upcoming card
    [1719, 487, 223, 47], // "shortcuts"
    [1717, 588, 382, 371], // shortcut tile 1
    [2114, 588, 386, 360], // shortcut tile 2
    [1717, 985, 382, 366], // shortcut tile 3
    [2114, 985, 386, 361], // shortcut tile 4
    [1719, 1444, 781, 48], // "everything else"
    [1717, 1510, 783, 146], // list row 1
    [1717, 1656, 783, 114], // list row 2
    [1717, 1770, 783, 114], // list row 3
    [1717, 1884, 783, 114], // list row 4
    [1717, 1998, 783, 114], // list row 5
  ],
  // Patient Portal — My Care Journey (PNG 2560x3562, 2x export)
  "care-journey": [
    [65, 31, 327, 66], // product name
    [608, 31, 896, 66], // search
    [1734, 46, 405, 45], // nav 1–3
    [2188, 53, 60, 27], // nav 4
    [2380, 53, 116, 27], // sign out
    [66, 213, 1067, 165], // page title
    [1854, 213, 642, 165], // viewing care for
    [98, 482, 268, 28], // tab 1
    [432, 484, 182, 27], // tab 2
    [681, 484, 135, 27], // tab 3
    [884, 484, 145, 27], // tab 4
    [1096, 483, 141, 28], // tab 5
    [77, 652, 179, 592], // timeline rail 1
    [256, 632, 1424, 612], // timeline card 1
    [82, 1328, 174, 420], // timeline rail 2
    [256, 1308, 1424, 438], // timeline card 2
    [92, 1832, 164, 764], // timeline rail 3
    [256, 1812, 1424, 782], // timeline card 3
    [77, 2672, 179, 60], // timeline rail 4
    [256, 2660, 1424, 698], // timeline card 4
    [1717, 632, 783, 534], // who is doing what panel
  ],
  // Patient Portal — Guided AI Concierge (PNG 2560x2094, 2x export)
  "guided-concierge": [
    [65, 26, 327, 76], // product name
    [869, 51, 214, 32], // nav 1–3
    [1091, 43, 611, 51], // nav 4–5
    [1768, 52, 66, 31], // nav 6
    [2311, 26, 185, 76], // sign out
    [65, 209, 1032, 63], // page title
    [65, 318, 1035, 31], // sub copy
    [64, 402, 1616, 100], // ask input
    [64, 566, 308, 164], // suggestion 1
    [604, 566, 421, 164], // suggestion 2
    [1145, 566, 491, 164], // suggestion 3
    [64, 746, 379, 116], // suggestion 4
    [604, 746, 402, 116], // suggestion 5
    [1145, 746, 316, 116], // suggestion 6
    [114, 976, 795, 99], // transcript: question
    [114, 1178, 1551, 99], // transcript: answer lead
    [228, 1296, 174, 29], // transcript: options label
    [226, 1362, 1439, 164], // transcript: options
    [227, 1585, 515, 40], // transcript: next-step label
    [226, 1670, 1439, 108], // transcript: next step
    [1717, 194, 783, 562], // side panel: open tasks
    [1717, 820, 783, 216], // side panel: emergency notice
    [1717, 1100, 783, 444], // side panel: talk to someone
  ],
};

const RECT_SCALE_BASE = 1280; // rect authoring width; bleed scales up for 2x exports
const PAD = 5; // px bleed around each rect so anti-aliased edges aren't clipped
const BASE_DELAY = 0.15;
const STEP = 0.095;
const POP = 0.32;
const POP_EASE = [0.34, 1.4, 0.64, 1] as const; // slight overshoot — the Stitch "pop"
const EASE = [0.25, 0.1, 0.25, 1] as const;

// Dark grey shimmer — the "generating" canvas the components pop onto.
const SHIMMER =
  "radial-gradient(90% 70% at 18% 22%, rgba(255,255,255,0.07), transparent 62%)," +
  "radial-gradient(85% 75% at 82% 26%, rgba(255,255,255,0.05), transparent 62%)," +
  "radial-gradient(95% 85% at 60% 90%, rgba(255,255,255,0.05), transparent 62%)," +
  "radial-gradient(80% 80% at 94% 82%, rgba(255,255,255,0.04), transparent 62%)," +
  "linear-gradient(135deg, #262629, #18181b)";

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export default function DashboardAssembleReveal({ image, alt, variant, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <motion.div
        ref={ref}
        className={className}
        style={style}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <img src={image.src} alt={alt} className="absolute inset-0 h-full w-full object-contain" />
      </motion.div>
    );
  }

  const frameW = image.width;
  const frameH = image.height;
  const scale = frameW / RECT_SCALE_BASE;
  const pad = PAD * scale; // same visual bleed on 1x and 2x exports
  const steps = STEPS[variant].map(([x, y, w, h], i) => {
    const top = clamp(((y - pad) / frameH) * 100, 0, 100);
    const left = clamp(((x - pad) / frameW) * 100, 0, 100);
    const bottom = clamp(100 - ((y + h + pad) / frameH) * 100, 0, 100);
    const right = clamp(100 - ((x + w + pad) / frameW) * 100, 0, 100);
    return {
      clip: `inset(${top}% ${right}% ${bottom}% ${left}%)`,
      // pop scales from the component's own center
      origin: `${clamp(((x + w / 2) / frameW) * 100, 0, 100)}% ${clamp(((y + h / 2) / frameH) * 100, 0, 100)}%`,
      // cursor lands just off the component's bottom-right corner
      cx: clamp(((x + w + 10 * scale) / frameW) * 100, 2, 96),
      cy: clamp(((y + h + 6 * scale) / frameH) * 100, 3, 96),
      delay: BASE_DELAY + i * STEP,
    };
  });

  const lastDelay = steps[steps.length - 1].delay;
  const endDelay = lastDelay + POP + 0.1;
  const cursorDur = endDelay + 0.35;
  const cursorTimes = steps.map((s) => s.delay / cursorDur);

  return (
    <div ref={ref} className={className} style={style}>
      {/* Shimmer canvas the components draw onto; fades once the build lands */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: SHIMMER, backgroundSize: "170% 170%" }}
        initial={{ opacity: 1, backgroundPosition: "0% 0%" }}
        animate={inView ? { opacity: 0, backgroundPosition: "100% 100%" } : {}}
        transition={{
          opacity: { duration: 0.7, ease: EASE, delay: endDelay },
          backgroundPosition: { duration: endDelay, ease: "easeInOut" },
        }}
      />

      {/* Components popping in one at a time, in build order */}
      {steps.map((s) => (
        <motion.div
          key={s.clip}
          aria-hidden
          className="absolute inset-0"
          style={{ clipPath: s.clip, transformOrigin: s.origin }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            opacity: { duration: 0.16, ease: "easeOut", delay: s.delay },
            scale: { duration: POP, ease: POP_EASE, delay: s.delay },
          }}
        >
          <img src={image.src} alt="" className="absolute inset-0 h-full w-full object-contain" />
        </motion.div>
      ))}

      {/* Full image crossfades in at the end — covers borders/dividers between rects */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: endDelay }}
      >
        <img src={image.src} alt={alt} className="absolute inset-0 h-full w-full object-contain" />
      </motion.div>

      {/* Purple cursor hopping beside each component as it lands */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-20"
        style={{ translateX: "-50%", translateY: "-50%" }}
        initial={{ opacity: 0, left: `${steps[0].cx}%`, top: `${steps[0].cy}%` }}
        animate={
          inView
            ? {
                opacity: [0, 1, 1, 1, 0],
                left: steps.map((s) => `${s.cx}%`),
                top: steps.map((s) => `${s.cy}%`),
              }
            : {}
        }
        transition={{
          left: { duration: cursorDur, ease: "easeInOut", times: cursorTimes },
          top: { duration: cursorDur, ease: "easeInOut", times: cursorTimes },
          opacity: { duration: cursorDur, ease: "easeInOut", times: [0, 0.05, 0.5, 0.92, 1] },
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          className="drop-shadow-[0_0_6px_rgba(140,86,255,0.6)]"
        >
          <path
            d="M3 2.5 L3 18.2 L7.1 14.3 L9.7 20 L12.4 18.8 L9.8 13.1 L15.3 12.9 Z"
            fill="#8c56ff"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
