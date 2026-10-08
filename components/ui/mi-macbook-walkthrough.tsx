"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import screenAccounts from "@/components/images/Monthly invoicing Images/MI_Flow_Clean/flow-1-accounts.png";
import screenHowItWorks from "@/components/images/Monthly invoicing Images/MI_Flow_Clean/flow-2-how-it-works.png";
import screenConfirm from "@/components/images/Monthly invoicing Images/MI_Flow_Clean/flow-3-confirm.png";
import screenApproved from "@/components/images/Monthly invoicing Images/MI_Flow_Clean/flow-4-approved.png";
import screenCreditLines from "@/components/images/Monthly invoicing Images/MI_Flow_Clean/flow-5-credit-lines.png";
import handSprite from "@/components/videos/Pi4_Slideshow/Clean/hand.png";
import { cx } from "@/lib/cx";

/* ── The Monthly Invoicing walkthrough ───────────────────────────────────

   The delivered three-step application replayed as one continuous take
   inside a Space Black MacBook Pro: a cursor travels between the controls
   it pressed and the screen answers mid-press. Same machinery as the
   PayPal walkthroughs — a clock ref advanced by requestAnimationFrame, one
   paint writer, an IntersectionObserver that pauses it off screen. Server
   render, no-JS and reduced motion hold the first still with the cursor at
   rest, so the animation is an enhancement, never a dependency.

   The stills are the recording's own frames with its baked-in cursor
   removed, so the pointer here is live type-and-CSS rather than pixels: it
   moves with the device, and its stops are the positions measured off the
   original composite. */

type DemoPoint = { x: number; y: number };

type DemoStop = DemoPoint & {
  press?: { layer: number; fade: number };
  /** Extra seconds to linger once the press has settled, for screens whose
      content needs reading before the cursor moves on. */
  hold?: number;
};

type DemoTail = { layer: number; wait: number; fade: number };

/* Where the cursor goes, as fractions of the screen raster, measured off
   the recording's own cursor positions before they were cleaned out. */
const MI_STOPS: DemoStop[] = [
  { x: 0.3644, y: 0.1827, press: { layer: 1, fade: 0.34 }, hold: 1.6 }, // see how it works, on the accounts banner
  { x: 0.633, y: 0.703, press: { layer: 2, fade: 0.34 }, hold: 1.8 }, // get started, out of the explainer
  { x: 0.644, y: 0.8024, press: { layer: 3, fade: 0.38 }, hold: 1.4 }, // submit the confirmed details
  { x: 0.6481, y: 0.5666, press: { layer: 4, fade: 0.38 } }, // done, back to accounts
];

/* The cursor enters and leaves below the display, so the loop's seam is two
   absences rather than a jump. */
const DEMO_ENTER: DemoPoint = { x: 0.45, y: 1.18 };
const DEMO_LEAVE: DemoPoint = { x: 0.58, y: 1.18 };

/* Seconds. A press is a dip and release; a fade starts mid-press. */
const DEMO_DWELL = 0.24;
const DEMO_PRESS = 0.43;
const DEMO_PRESS_DOWN = 0.17;
const DEMO_SETTLE = 0.26;

/* The screen raster is wide; distances are measured isotropically so a
   vertical run is not overcounted when pacing a travel. */
const RASTER_W = 3426;
const RASTER_H = 2214;
const DEMO_ASPECT = RASTER_H / RASTER_W;

function demoDistance(a: DemoPoint, b: DemoPoint): number {
  return Math.hypot(b.x - a.x, (b.y - a.y) * DEMO_ASPECT);
}

function demoEase(p: number): number {
  return p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
}

type DemoTravel = {
  from: DemoPoint;
  to: DemoPoint;
  start: number;
  duration: number;
  alphaFrom: number;
  alphaTo: number;
};

type DemoScript = {
  stops: DemoStop[];
  travels: DemoTravel[];
  presses: number[];
  fades: Array<{ layer: number; start: number; duration: number }>;
  /** Seconds the take runs before the clock wraps. */
  run: number;
};

/* The whole take, compiled once: cursor travels, press moments and screen
   fades, all on one clock. Travels pace themselves by distance. */
function compileDemo(stops: DemoStop[], tail: DemoTail[]): DemoScript {
  const travels: DemoTravel[] = [];
  const presses: number[] = [];
  const fades: Array<{ layer: number; start: number; duration: number }> = [];

  let time = 0.35;
  let at = DEMO_ENTER;

  stops.forEach((stop, index) => {
    const duration = Math.min(1.4, 0.46 + 0.74 * demoDistance(at, stop));
    travels.push({
      from: at,
      to: stop,
      start: time,
      duration,
      alphaFrom: index === 0 ? 0 : 1,
      alphaTo: 1,
    });
    time += duration + DEMO_DWELL;
    at = stop;
    if (!stop.press) {
      time += stop.hold ?? 0;
      return;
    }
    presses.push(time);
    fades.push({
      layer: stop.press.layer,
      start: time + DEMO_PRESS_DOWN,
      duration: stop.press.fade,
    });
    time += DEMO_PRESS + DEMO_SETTLE + (stop.hold ?? 0);
  });

  /* The cursor leaves before the recording is finished: the account with
     its credit lines gets its read unaccompanied, and the loop closes on
     the page it started from. */
  travels.push({ from: at, to: DEMO_LEAVE, start: time, duration: 0.62, alphaFrom: 1, alphaTo: 0 });
  time += 0.62;
  for (const step of tail) {
    time += step.wait;
    fades.push({ layer: step.layer, start: time, duration: step.fade });
    time += step.fade;
  }
  time += 0.15;

  return { stops, travels, presses, fades, run: time };
}

/* Cursor pose at one moment: position, visibility, and how deep into a
   press it is. Travels bow slightly off the straight line so a run between
   two controls reads as a hand, not a tween. */
function demoHandAt(
  script: DemoScript,
  time: number,
): { x: number; y: number; alpha: number; press: number } {
  let resting = DEMO_ENTER;
  let alpha = 0;
  for (const leg of script.travels) {
    if (time < leg.start) break;
    if (time < leg.start + leg.duration) {
      const p = demoEase((time - leg.start) / leg.duration);
      const dx = leg.to.x - leg.from.x;
      const dy = leg.to.y - leg.from.y;
      const span = Math.hypot(dx, dy * DEMO_ASPECT) || 1;
      const bow = Math.sin(Math.PI * p) * span * 0.07;
      return {
        x: leg.from.x + dx * p + ((-dy * DEMO_ASPECT) / span) * bow,
        y: leg.from.y + dy * p + (dx / span / DEMO_ASPECT) * bow,
        alpha: leg.alphaFrom + (leg.alphaTo - leg.alphaFrom) * p,
        press: 0,
      };
    }
    resting = leg.to;
    alpha = leg.alphaTo;
  }
  let press = 0;
  for (const start of script.presses) {
    if (time >= start && time < start + DEMO_PRESS) {
      const local = time - start;
      press =
        local < DEMO_PRESS_DOWN
          ? demoEase(local / DEMO_PRESS_DOWN)
          : 1 - demoEase((local - DEMO_PRESS_DOWN) / (DEMO_PRESS - DEMO_PRESS_DOWN));
      break;
    }
  }
  return { x: resting.x, y: resting.y, alpha, press };
}

/* Layer opacities at one moment. Each fade dissolves whatever is showing
   into its layer, so the stack is always a partition of one and a wrapped
   clock lands on the right screen. */
function demoLayersAt(script: DemoScript, time: number, out: number[]): void {
  out.fill(0);
  out[0] = 1;
  for (const fade of script.fades) {
    if (time <= fade.start) break;
    const p = Math.min(1, (time - fade.start) / fade.duration);
    for (let index = 0; index < out.length; index += 1) out[index] *= 1 - p;
    out[fade.layer] += p;
  }
}

const MI_SCREENS: StaticImageData[] = [
  screenAccounts,
  screenHowItWorks,
  screenConfirm,
  screenApproved,
  screenCreditLines,
];

const MI_DEMO = compileDemo(MI_STOPS, [
  { layer: 0, wait: 2.4, fade: 0.6 }, // the credit lines get their read, and the loop returns
]);

/* ── The machine ─────────────────────────────────────────────────────────

   Drawn rather than photographed, so it stays sharp at any width and the
   screen is real markup underneath. Every length is in cqw — percent of
   the figure's own width — off a 16-inch MacBook Pro measured against its
   355.7mm case: the deck is the widest part and takes the full 100, the
   lid sits fractionally inside it. The notch is deliberately left off:
   these captures run to the top edge of the display, and a notch would
   sit over the application's own chrome. */
const DECK_H = 2.87;
const LID_W = 97.2;
const BEZEL_X = 1.15;
const BEZEL_TOP = 2.3;
const BEZEL_BOTTOM = 1.3;
const SCREEN_W = LID_W - 2 * BEZEL_X;
const SCREEN_H = SCREEN_W * DEMO_ASPECT;
const LID_H = BEZEL_TOP + SCREEN_H + BEZEL_BOTTOM;

/* Space Black: a very dark anodised grey that still catches an edge. */
const DECK_FILL =
  "linear-gradient(180deg,#5D5960 0%,#434046 14%,#302D34 46%,#232025 76%,#141215 100%)";
const LID_FILL = "linear-gradient(184deg,#1C1B21 0%,#131217 40%,#0D0C10 74%,#0A090C 100%)";

/* The pointer, in the screen's own terms: the circle the app draws under
   the touch and the hand above it, both carried at the ratios the original
   composite used. */
const CIRCLE_D = SCREEN_W * 0.052;
/* On a phone the machine is small enough that the app-scale pointer drops
   under 20px and stops reading, so the pair takes a pixel floor and keeps
   its ratios off whatever size wins. */
const CURSOR = `max(${CIRCLE_D.toFixed(4)}cqw, 30px)`;
const cursor = (ratio: number) => `calc(${CURSOR} * ${ratio})`;

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The delivered Monthly Invoicing application replaying inside a Space
 * Black MacBook Pro. `className` sets the rendered width; everything
 * inside is sized in container units off it.
 */
export default function MiMacbookWalkthrough({ className }: { className?: string }) {
  const screens = MI_SCREENS;
  const script = MI_DEMO;
  const base = script.stops[0];

  /* Animation is gated on hydration and the user's motion preference; until
     both clear, the figure is the server render: first still, cursor at
     rest on the control it opens with. */
  const [motionOk, setMotionOk] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionOk(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const stage = useRef<HTMLDivElement | null>(null);
  const screen = useRef<HTMLDivElement | null>(null);
  const positioner = useRef<HTMLDivElement | null>(null);
  const handPositioner = useRef<HTMLDivElement | null>(null);
  const circle = useRef<HTMLDivElement | null>(null);
  const hand = useRef<HTMLDivElement | null>(null);
  const layers = useRef<Array<HTMLDivElement | null>>([]);
  /* Seeded to match the server render — first still showing — so the
     clock's first frame does not read the stack as empty. */
  const alphas = useRef<number[]>(MI_SCREENS.map((_, index) => (index === 0 ? 1 : 0)));
  /* Screen box in px, measured: the poses are fractions of the screen, and
     cqw cannot reach an inline transform. */
  const size = useRef({ w: 0, h: 0 });
  const onScreen = useRef(false);
  const clock = useRef(0);

  const registerLayer = useCallback((index: number, node: HTMLDivElement | null) => {
    layers.current[index] = node;
  }, []);

  const paint = useCallback(
    (time: number) => {
      const box = size.current;
      const pose = demoHandAt(script, time);
      const move = `translate3d(${((pose.x - base.x) * box.w).toFixed(2)}px, ${((pose.y - base.y) * box.h).toFixed(2)}px, 0)`;
      if (positioner.current) positioner.current.style.transform = move;
      if (handPositioner.current) handPositioner.current.style.transform = move;
      const alpha = pose.alpha.toFixed(3);
      if (circle.current) {
        circle.current.style.opacity = alpha;
        circle.current.style.transform = `scale(${(1 - 0.12 * pose.press).toFixed(4)})`;
      }
      if (hand.current) {
        hand.current.style.opacity = alpha;
        hand.current.style.transform = `scale(${(1 - 0.06 * pose.press).toFixed(4)})`;
      }
      demoLayersAt(script, time, alphas.current);
      for (let index = 0; index < screens.length; index += 1) {
        const node = layers.current[index];
        if (node) node.style.opacity = alphas.current[index].toFixed(3);
      }
    },
    [base.x, base.y, screens.length, script],
  );

  useIsomorphicLayoutEffect(() => {
    if (!motionOk) return;
    const node = screen.current;
    if (!node) return;
    const measure = () => {
      size.current = { w: node.clientWidth, h: node.clientHeight };
      paint(clock.current);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [motionOk, paint]);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!motionOk) return;
    let frame = 0;
    let previous = 0;
    const step = (stamp: number) => {
      frame = requestAnimationFrame(step);
      /* Clamped so a backgrounded tab does not resume with one huge jump. */
      const elapsed = previous ? Math.min(stamp - previous, 64) : 0;
      previous = stamp;
      if (!onScreen.current) return;
      const ahead = clock.current + elapsed / 1000;
      clock.current = ahead >= script.run ? ahead - script.run : ahead;
      paint(clock.current);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [motionOk, paint, script]);

  return (
    <div
      ref={stage}
      role="img"
      aria-label="Animated walkthrough of the delivered Monthly Invoicing application, shown on a laptop: from the Ads Manager accounts page, a cursor opens the monthly invoicing explainer, starts the application, confirms the legal and billing details on one page, and closes an approval screen showing a sample credit line, returning to the accounts page with monthly invoicing in place."
      className={cx("relative", className)}
      style={{ containerType: "inline-size" }}
    >
      {/* Lid. The whole front face is display glass, so the bezel is the
          same black as the frame and only the machined edge separates
          them. */}
      <div
        className="relative mx-auto"
        style={{
          width: `${LID_W}cqw`,
          height: `${LID_H}cqw`,
          borderRadius: "1.9cqw",
          backgroundImage: LID_FILL,
          /* The page ground is the same black as the case, so the machined
             chamfer is the only thing separating them: a bright inner edge,
             a soft outer one, and the shadow the machine sits in. */
          boxShadow:
            "inset 0 0 0 0.11cqw rgba(255,255,255,0.26), inset 0 0.14cqw 0.34cqw rgba(255,255,255,0.07), 0 0 0 0.07cqw rgba(255,255,255,0.055), 0 2.4cqw 5cqw rgba(0,0,0,0.55)",
        }}
      >
        {/* Camera, where the notch would be. */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 rounded-full"
          style={{
            top: `${(BEZEL_TOP / 2 - 0.21).toFixed(3)}cqw`,
            width: "0.42cqw",
            height: "0.42cqw",
            marginLeft: "-0.21cqw",
            background: "radial-gradient(circle at 35% 30%,#3A3A42 0%,#141419 60%,#0E0E12 100%)",
          }}
        />

        <div
          ref={screen}
          className="absolute overflow-hidden bg-white"
          style={{
            left: `${BEZEL_X}cqw`,
            top: `${BEZEL_TOP}cqw`,
            width: `${SCREEN_W}cqw`,
            height: `${SCREEN_H}cqw`,
            borderRadius: "0.85cqw",
          }}
        >
          {screens.map((still, index) => (
            <div
              key={index}
              ref={(node) => registerLayer(index, node)}
              aria-hidden
              className="absolute inset-0"
              style={{ opacity: index === 0 ? 1 : 0 }}
            >
              <Image
                src={still}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1200px"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          {/* The touch circle is drawn by the app, so it lives inside the
              screen and clips with it. The base position is the first
              stop, so the static render is exactly the first still. */}
          <div
            ref={positioner}
            className="absolute h-0 w-0"
            style={{ left: `${(base.x * 100).toFixed(3)}%`, top: `${(base.y * 100).toFixed(3)}%` }}
          >
            <div
              ref={circle}
              aria-hidden
              className="absolute rounded-full"
              style={{
                left: cursor(-0.5),
                top: cursor(-0.5),
                width: CURSOR,
                height: CURSOR,
                background:
                  "radial-gradient(circle, rgba(0,160,255,0.161) 0%, rgba(0,160,255,0.161) 89.8%, rgba(0,160,255,0.235) 93.7%, rgba(0,160,255,0.235) 96.9%, rgba(0,160,255,0) 100%)",
              }}
            />
          </div>
        </div>

        {/* The hand is above the glass, so it clips at the lid outline
            instead: reaching a control at the edge of the screen it laps
            onto the bezel, the way a real one would. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ borderRadius: "1.9cqw" }}
        >
          <div
            ref={handPositioner}
            className="absolute h-0 w-0"
            style={{
              left: `${(BEZEL_X + base.x * SCREEN_W).toFixed(3)}cqw`,
              top: `${(BEZEL_TOP + base.y * SCREEN_H).toFixed(3)}cqw`,
            }}
          >
            {/* Presses pivot about the fingertip, which sits inside the
                circle rather than at the sprite's corner. */}
            <div
              ref={hand}
              className="absolute"
              style={{
                left: cursor(-0.039376),
                top: cursor(0.173174),
                width: cursor(0.74767),
                transformOrigin: "25.8% 10.9%",
                filter: "drop-shadow(0 0.15cqw 0.35cqw rgba(0,0,0,0.32))",
              }}
            >
              <Image src={handSprite} alt="" sizes="64px" className="block h-auto w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Deck: the front edge of the case, the widest part of the machine,
          with the shadow the open lid casts into the thumb scoop. */}
      <div className="relative w-full" style={{ height: `${DECK_H}cqw` }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: DECK_FILL,
            borderRadius: `0 0 ${(DECK_H * 0.42).toFixed(3)}cqw ${(DECK_H * 0.42).toFixed(3)}cqw`,
            boxShadow: "inset 0 0.06cqw 0 rgba(255,255,255,0.22)",
          }}
        />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-0"
          style={{
            width: "17cqw",
            height: `${(DECK_H * 0.62).toFixed(3)}cqw`,
            marginLeft: "-8.5cqw",
            borderRadius: "0 0 4cqw 4cqw",
            background: "linear-gradient(180deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0) 100%)",
          }}
        />
      </div>
    </div>
  );
}
