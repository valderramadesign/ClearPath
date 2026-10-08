"use client";

import Image, { type StaticImageData } from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

/* ── Nine screens assembling themselves ──────────────────────────────────

   The old application arrives the way an advertiser met it: as one screen,
   which then turns out to be nine. Every cell starts stacked on the middle
   one and travels out to its own place in the table, in rings from the
   centre, and the whole thing is over well before the reveal slider starts
   its wipe.

   The travel is measured rather than derived: each cell asks where the
   middle cell is sitting and keeps the difference. The table can gain a
   gap, a wider column, or a second line of label without the animation
   needing to be told.

   Server-rendered in place and fully visible, so a reader without
   JavaScript, or with reduced motion asked for, or below the width where
   the table exists at all, simply gets the table. */

export type LegacyScreen = { src: StaticImageData; title: string; alt: string };

const COLUMNS = 3;

/** Rings out from the middle: 0 for the centre, 1 for its edges, 2 for the corners. */
const ring = (index: number, rows: number) =>
  Math.abs(Math.floor(index / COLUMNS) - Math.floor((rows - 1) / 2)) +
  Math.abs((index % COLUMNS) - 1);

const RING_MS = 90;
const TRAVEL_MS = 460;
const FADE_MS = 280;

/** Below this the screens are a swipeable strip, not a table, and there is
    no middle cell for them to arrive from. */
const TABLE = "(min-width: 768px)";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Phase =
  /** Server render, and any reader the animation does not apply to. */
  | "idle"
  /** Held back, in place, waiting for the table to come into view. */
  | "armed"
  /** Stacked on the middle cell, one painted frame before the travel. */
  | "set"
  | "playing"
  /** Inline styles dropped, so nothing survives the animation. */
  | "done";

export default function LegacyScreenGrid({
  screens,
  label,
  className,
  cellClassName,
  frameClassName,
  captionClassName,
}: {
  screens: LegacyScreen[];
  /** Accessible name for the list. */
  label: string;
  className?: string;
  cellClassName?: string;
  frameClassName?: string;
  captionClassName?: string;
}) {
  const list = useRef<HTMLOListElement | null>(null);
  const offsets = useRef<{ x: number; y: number }[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");

  const rows = Math.ceil(screens.length / COLUMNS);
  const middle = Math.floor((rows - 1) / 2) * COLUMNS + 1;
  const span = ring(0, rows) * RING_MS + TRAVEL_MS;

  useIsomorphicLayoutEffect(() => {
    if (!window.matchMedia(TABLE).matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("armed");
  }, []);

  useEffect(() => {
    if (phase !== "armed") return;
    const el = list.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const cells = Array.from(el.children) as HTMLElement[];
        const origin = cells[Math.min(middle, cells.length - 1)]?.getBoundingClientRect();
        if (!origin) {
          setPhase("done");
          return;
        }
        offsets.current = cells.map((cell) => {
          const box = cell.getBoundingClientRect();
          return { x: origin.left - box.left, y: origin.top - box.top };
        });
        setPhase("set");
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [phase, middle]);

  /* Two frames, not one: the first commits the stacked position, the second
     lets the transition see something to leave from. */
  useEffect(() => {
    if (phase !== "set") return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setPhase("playing"));
    });
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setTimeout(() => setPhase("done"), span + 80);
    return () => window.clearTimeout(timer);
  }, [phase, span]);

  const cellStyle = (index: number): CSSProperties | undefined => {
    if (phase === "idle" || phase === "done") return undefined;
    if (phase === "armed") return { opacity: 0 };

    const offset = offsets.current[index] ?? { x: 0, y: 0 };
    if (phase === "set") {
      return {
        opacity: 0,
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(0.92)`,
        willChange: "transform, opacity",
      };
    }

    const delay = ring(index, rows) * RING_MS;
    return {
      opacity: 1,
      transform: "translate3d(0, 0, 0) scale(1)",
      willChange: "transform, opacity",
      transition:
        `transform ${TRAVEL_MS}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms,` +
        ` opacity ${FADE_MS}ms ease-out ${delay}ms`,
    };
  };

  return (
    <ol ref={list} aria-label={label} className={className}>
      {screens.map((screen, index) => (
        <li key={screen.title} className={cellClassName} style={cellStyle(index)}>
          <div className={frameClassName}>
            <Image
              src={screen.src}
              alt={screen.alt}
              sizes="(max-width: 768px) 80vw, 30vw"
              className="h-auto w-full"
            />
          </div>
          <p className={captionClassName}>
            <span className="text-white/40">0{index + 1}</span> {screen.title}
          </p>
        </li>
      ))}
    </ol>
  );
}
