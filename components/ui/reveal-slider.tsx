"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cx } from "@/lib/cx";

/* ── Before → after, in the reader's own hand ────────────────────────────

   One frame holding both states of a flow, split by a divider the reader
   drags. Everything left of the divider is the before; everything right of
   it is the after. Pulling the handle left wipes the old journey away,
   pulling it right brings it back.

   The frame is a stack of paired rows rather than two stacked layers,
   because each row has to reserve its height once — for whichever of its two
   states is taller — and then hold still. Both states of a row share a
   single grid cell and are clipped against the same divider position, so
   nothing reflows as the divider travels and the devices simply change
   underneath it.

   Below lg the rows flatten out: every before in order, then every after, so
   the two states read as two passages rather than interleaving. The drag is
   an enhancement, never a dependency. */

const clampPct = (n: number) => (n < 0 ? 0 : n > 100 ? 100 : n);

/** Kept to the left of the divider: the before, and the copy that states it. */
const revealLeft = (position: number) => ({ clipPath: `inset(0 ${100 - position}% 0 0)` });

/** Kept to the right of it: the after, and the copy that answers it. */
const revealRight = (position: number) => ({ clipPath: `inset(0 0 0 ${position}%)` });

/** How far one arrow press moves the divider, in percent. Shift multiplies it. */
const KEY_STEP = 2;

/** Slow in, slow out — a wipe that gathers itself and settles rather than stops. */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export type RevealRow = {
  before: ReactNode;
  after: ReactNode;
  /**
   * Where the two states sit when one is shorter than the other. "end" pins
   * both to the row's bottom edge, which is what puts their last lines on a
   * shared line; the default lets each start at the top.
   */
  align?: "start" | "end";
};

export default function RevealSlider({
  rows,
  label,
  initialPosition = 100,
  autoReveal = false,
  autoRevealDuration = 1400,
  dividerWidth = 2,
  framed = true,
  className,
}: {
  /** Paired rows, top to bottom. Each pair shares one cell and one clip. */
  rows: RevealRow[];
  /** Accessible name for the divider handle. */
  label: string;
  /** Where the divider starts, 0 (all after) to 100 (all before). */
  initialPosition?: number;
  /**
   * Play the wipe through to the after state once, the first time the top of
   * the frame's first row reaches the bottom of the sticky bar. A reader who
   * touches the handle before then keeps it: the wipe never takes the control
   * out of their hands.
   */
  autoReveal?: boolean;
  autoRevealDuration?: number;
  dividerWidth?: number;
  /**
   * Draws the rounded container the rows sit in. Turn it off where the rows
   * are meant to stand on the page itself; the divider and its handle are
   * unaffected either way, since they hang off the wrapper rather than the
   * frame.
   */
  framed?: boolean;
  className?: string;
}) {
  const [position, setPosition] = useState(initialPosition);
  const [live, setLive] = useState(false);
  const [dragging, setDragging] = useState(false);
  const box = useRef<HTMLDivElement | null>(null);
  const firstRow = useRef<HTMLDivElement | null>(null);
  const thumb = useRef<HTMLDivElement | null>(null);
  /* The move handler reads this rather than `dragging`, which would still be
     false in the closure if a pointermove lands before React re-renders —
     enough to drop the opening frames of a quick flick. */
  const held = useRef(false);
  /* Same reason, and it also lets the wipe start from wherever the divider
     actually is rather than from where the last render left it. */
  const at = useRef(initialPosition);
  const frame = useRef(0);
  const played = useRef(false);

  const moveDivider = useCallback((next: number) => {
    at.current = next;
    setPosition(next);
  }, []);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const sync = () => setLive(wide.matches);
    sync();
    wide.addEventListener("change", sync);
    return () => wide.removeEventListener("change", sync);
  }, []);

  /* Any deliberate touch of the handle ends the automatic wipe for good,
     mid-flight or before it ever fires. */
  const takeOver = useCallback(() => {
    played.current = true;
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
  }, []);

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    [],
  );

  useEffect(() => {
    if (!live || !autoReveal || played.current) return;
    const row = firstRow.current;
    if (!row) return;

    /* The bar publishes its own height, so the line the copy has to reach is
       wherever the bar actually ends rather than a number copied out of it. */
    const barHeight = () =>
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--case-study-bar-h"),
      ) || 0;

    const play = () => {
      const from = at.current;
      if (from === 0) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        moveDivider(0);
        return;
      }
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / autoRevealDuration);
        moveDivider(from * (1 - ease(t)));
        frame.current = t < 1 ? requestAnimationFrame(step) : 0;
      };
      frame.current = requestAnimationFrame(step);
    };

    const check = () => {
      if (played.current) {
        window.removeEventListener("scroll", check);
        return;
      }
      if (row.getBoundingClientRect().top > barHeight()) return;
      played.current = true;
      window.removeEventListener("scroll", check);
      play();
    };

    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, [live, autoReveal, autoRevealDuration, moveDivider]);

  /* Read straight off the wrapper's box — the same box the divider's `left`
     percentage resolves against — so the divider lands under the pointer at
     any width without a resize listener of its own. */
  const moveTo = useCallback(
    (clientX: number) => {
      const rect = box.current?.getBoundingClientRect();
      if (!rect?.width) return;
      moveDivider(clampPct(((clientX - rect.left) / rect.width) * 100));
    },
    [moveDivider],
  );

  const start = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!live || event.button > 0) return;
    /* Also what stops the drag from selecting the copy it passes over. */
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    takeOver();
    held.current = true;
    setDragging(true);
    moveTo(event.clientX);
    /* The preventDefault above also suppresses the focus the press would
       normally give, so hand it over deliberately: a drag that ends is then
       one the arrow keys can carry on from. */
    thumb.current?.focus({ preventScroll: true });
  };

  const drag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (held.current) moveTo(event.clientX);
  };

  const end = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!held.current) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    held.current = false;
    setDragging(false);
  };

  const key = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? KEY_STEP * 5 : KEY_STEP;
    const next =
      event.key === "ArrowLeft" || event.key === "ArrowDown" ? position - step
      : event.key === "ArrowRight" || event.key === "ArrowUp" ? position + step
      : event.key === "Home" ? 0
      : event.key === "End" ? 100
      : null;
    if (next === null) return;
    event.preventDefault();
    takeOver();
    moveDivider(clampPct(next));
  };

  const shown = Math.round(position);

  return (
    /* The divider and its handle hang off this wrapper rather than the frame,
       so the handle stays whole when it reaches either end instead of being
       cut in half by the frame's own rounding. That also puts them outside
       the frame's subtree, which is why the drag listens here and not one
       level down: a press on the handle — the one place a reader is most
       likely to aim — would never reach a listener on the frame. */
    <div
      ref={box}
      onPointerDown={start}
      onPointerMove={drag}
      onPointerUp={end}
      onPointerCancel={end}
      /* If the capture is ever taken away without a pointerup — the browser
         claiming the pointer, the tab losing it — the drag has to end here or
         the divider keeps following a cursor that is no longer holding it. */
      onLostPointerCapture={end}
      className={cx(
        "relative",
        /* pan-y rather than none: a horizontal drag is ours, but the page
           still has to scroll under a finger on a wide touch screen. */
        live && "cursor-ew-resize touch-pan-y select-none",
        className,
      )}
    >
      <div
        className={cx(
          "relative grid gap-y-10 lg:gap-y-[56px]",
          framed &&
            "overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] py-10 lg:rounded-[40px] lg:py-14",
        )}
      >
        {live ? (
          rows.map((row, index) => (
            <div
              key={index}
              ref={index === 0 ? firstRow : undefined}
              className="grid"
            >
              {/* flow-root keeps each state's own top margin from collapsing
                  out and moving the box the divider cuts. */}
              <div
                className={cx("flow-root [grid-area:1/1]", row.align === "end" && "self-end")}
                style={revealLeft(position)}
              >
                {row.before}
              </div>
              <div
                className={cx("flow-root [grid-area:1/1]", row.align === "end" && "self-end")}
                style={revealRight(position)}
              >
                {row.after}
              </div>
            </div>
          ))
        ) : (
          <>
            {rows.map((row, index) => (
              <Fragment key={`before-${index}`}>{row.before}</Fragment>
            ))}
            {rows.map((row, index) => (
              <Fragment key={`after-${index}`}>{row.after}</Fragment>
            ))}
          </>
        )}
      </div>

      {live ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 z-10 -translate-x-1/2 bg-white/60"
            style={{ left: `${position}%`, width: `${dividerWidth}px` }}
          />
          {/* The thumb carries the slider role on its own. The frame holds
              headings and paragraphs, and a role on that would flatten them
              into the widget. */}
          <div
            ref={thumb}
            role="slider"
            tabIndex={0}
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={shown}
            aria-valuetext={`${shown}% before, ${100 - shown}% after`}
            onKeyDown={key}
            className={cx(
              "theme-invariant-dark absolute top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
              "rounded-full border border-white/30 bg-black/80 text-white backdrop-blur-sm",
              "outline-offset-4 transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
              dragging ? "scale-110" : "hover:scale-105",
            )}
            style={{ left: `${position}%` }}
          >
            <ChevronLeft aria-hidden className="size-4" />
            <ChevronRight aria-hidden className="size-4" />
          </div>
        </>
      ) : null}
    </div>
  );
}
