"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import screenActivities from "@/components/images/Teacher'sApp/Flow/flow-1-activities.png";
import screenRoster from "@/components/images/Teacher'sApp/Flow/flow-2-roster.png";
import screenRosterEthan from "@/components/images/Teacher'sApp/Flow/flow-3-roster-ethan.png";
import screenRosterOliver from "@/components/images/Teacher'sApp/Flow/flow-4-roster-oliver.png";
import screenRosterReady from "@/components/images/Teacher'sApp/Flow/flow-5-roster-ready.png";
import screenMeals from "@/components/images/Teacher'sApp/Flow/flow-6-meals.png";
import screenMealsBanana from "@/components/images/Teacher'sApp/Flow/flow-7-meals-banana.png";
import screenMealsReady from "@/components/images/Teacher'sApp/Flow/flow-8-meals-ready.png";
import screenSuccess from "@/components/images/Teacher'sApp/Flow/flow-9-success.png";
import handSprite from "@/components/videos/Pi4_Slideshow/Clean/hand.png";
import {
  GalaxyPhoneShell,
  PHONE_BEZEL_TOP,
  PHONE_BEZEL_X,
  PHONE_SCREEN_W,
  phoneScreenH,
} from "@/components/ui/galaxy-phone-shell";
import { cx } from "@/lib/cx";

/* ── The Ms. Sunshine walkthrough ────────────────────────────────────────

   One snack, logged the way a teacher logs it: a thumb travels across the
   handset, opens meals, picks the three children who ate, chooses what was
   served, and the record is already with the parents. Same machinery as
   the Monthly Invoicing walkthrough — a clock ref advanced by
   requestAnimationFrame, one paint writer, an IntersectionObserver that
   pauses it off screen. Server render, no-JS and reduced motion hold the
   first still with the pointer at rest, so the animation is an
   enhancement, never a dependency.

   The stills are the prototype's own screens with its baked-in pointer
   removed, so the pointer here is live type-and-CSS rather than pixels: it
   moves with the device, and its stops are the positions measured off the
   original captures. */

type DemoPoint = { x: number; y: number };

type DemoStop = DemoPoint & {
  press?: { layer: number; fade: number };
  /** Extra seconds to linger once the press has settled, for screens whose
      content needs reading before the pointer moves on. */
  hold?: number;
};

type DemoTail = { layer: number; wait: number; fade: number };

/* Where the pointer goes, as fractions of the screen raster, measured off
   the prototype's own pointer positions before they were cleaned out. */
const FLOW_STOPS: DemoStop[] = [
  { x: 0.1847, y: 0.38502, press: { layer: 1, fade: 0.3 }, hold: 0.55 }, // meals and snacks
  { x: 0.82711, y: 0.23169, press: { layer: 2, fade: 0.22 } }, // Ethan James Parker
  { x: 0.82711, y: 0.46052, press: { layer: 3, fade: 0.22 } }, // Oliver Bennett
  { x: 0.8296, y: 0.69051, press: { layer: 4, fade: 0.22 }, hold: 0.45 }, // Haruto Tanaka
  { x: 0.75, y: 0.90561, press: { layer: 5, fade: 0.3 }, hold: 0.5 }, // continue, to the menu
  { x: 0.20274, y: 0.31064, press: { layer: 6, fade: 0.22 } }, // banana
  { x: 0.51368, y: 0.6024, press: { layer: 7, fade: 0.22 }, hold: 0.45 }, // peanut butter sandwich
  { x: 0.76741, y: 0.90217, press: { layer: 8, fade: 0.3 }, hold: 1.5 }, // continue, and it is logged
  { x: 0.8097, y: 0.94108, press: { layer: 0, fade: 0.34 }, hold: 0.5 }, // back to school, the loop closes
];

/* The pointer enters and leaves below the display, so the loop's seam is
   two absences rather than a jump. */
const DEMO_ENTER: DemoPoint = { x: 0.42, y: 1.08 };
const DEMO_LEAVE: DemoPoint = { x: 0.6, y: 1.08 };

/* Seconds. A press is a dip and release; a fade starts mid-press. */
const DEMO_DWELL = 0.2;
const DEMO_PRESS = 0.4;
const DEMO_PRESS_DOWN = 0.16;
const DEMO_SETTLE = 0.22;

/* The screen raster is tall; distances are measured isotropically so a
   vertical run down the roster is not undercounted when pacing a travel. */
const RASTER_W = 1608;
const RASTER_H = 3496;
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

/* The whole take, compiled once: pointer travels, press moments and screen
   fades, all on one clock. Travels pace themselves by distance. */
function compileDemo(stops: DemoStop[], tail: DemoTail[]): DemoScript {
  const travels: DemoTravel[] = [];
  const presses: number[] = [];
  const fades: Array<{ layer: number; start: number; duration: number }> = [];

  let time = 0.35;
  let at = DEMO_ENTER;

  stops.forEach((stop, index) => {
    const duration = Math.min(1.15, 0.42 + 0.42 * demoDistance(at, stop));
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

  travels.push({ from: at, to: DEMO_LEAVE, start: time, duration: 0.55, alphaFrom: 1, alphaTo: 0 });
  time += 0.55;
  for (const step of tail) {
    time += step.wait;
    fades.push({ layer: step.layer, start: time, duration: step.fade });
    time += step.fade;
  }
  time += 0.4;

  return { stops, travels, presses, fades, run: time };
}

/* Pointer pose at one moment: position, visibility, and how deep into a
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

const FLOW_SCREENS: StaticImageData[] = [
  screenActivities,
  screenRoster,
  screenRosterEthan,
  screenRosterOliver,
  screenRosterReady,
  screenMeals,
  screenMealsBanana,
  screenMealsReady,
  screenSuccess,
];

const FLOW_DEMO = compileDemo(FLOW_STOPS, []);

/* The handset is drawn in galaxy-phone-shell, which the parent feed in the
   Impact section shares, so both are the same device down to the bezel.
   The stills set its screen ratio. */
const SCREEN_W = PHONE_SCREEN_W;
const SCREEN_H = phoneScreenH(DEMO_ASPECT);

/* The pointer, in the screen's own terms: the circle the application draws
   under the touch and the hand above it, both carried at the ratios the
   original captures used. */
const CIRCLE_D = SCREEN_W * 0.156716;
/* Narrow columns take the handset well under phone size, where the
   app-scale pointer stops reading, so the pair takes a pixel floor and
   keeps its ratios off whatever size wins. */
const CURSOR = `max(${CIRCLE_D.toFixed(4)}cqw, 34px)`;
const cursor = (ratio: number) => `calc(${CURSOR} * ${ratio})`;

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The tested Ms. Sunshine prototype replaying inside a Galaxy S25 Ultra.
 * `className` sets the rendered width; everything inside is sized in
 * container units off it.
 */
export default function SunshinePhoneWalkthrough({ className }: { className?: string }) {
  const screens = FLOW_SCREENS;
  const script = FLOW_DEMO;
  const base = script.stops[0];

  /* Animation is gated on hydration and the user's motion preference; until
     both clear, the figure is the server render: first still, pointer at
     rest on the tile it opens with. */
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
  const alphas = useRef<number[]>(FLOW_SCREENS.map((_, index) => (index === 0 ? 1 : 0)));
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
      aria-label="Animated walkthrough of the Ms. Sunshine prototype on a phone: from the day's activities a teacher opens meals and snacks, selects Ethan, Oliver and Haruto from the roster, continues to the menu, chooses a banana and a peanut butter sandwich, and confirms — the snack is logged for all three children and their parents at once."
      className={cx("relative", className)}
      style={{ containerType: "inline-size" }}
    >
      <GalaxyPhoneShell
        aspect={DEMO_ASPECT}
        screenRef={screen}
        overlay={
          <div
            ref={handPositioner}
            className="absolute h-0 w-0"
            style={{
              left: `${(PHONE_BEZEL_X + base.x * SCREEN_W).toFixed(3)}cqw`,
              top: `${(PHONE_BEZEL_TOP + base.y * SCREEN_H).toFixed(3)}cqw`,
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
                filter: "drop-shadow(0 0.4cqw 0.9cqw rgba(0,0,0,0.34))",
              }}
            >
              <Image src={handSprite} alt="" sizes="96px" className="block h-auto w-full" />
            </div>
          </div>
        }
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
              sizes="(max-width: 768px) 72vw, (max-width: 1280px) 34vw, 400px"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        {/* The touch circle is drawn by the application, so it lives inside
            the screen and clips with it. The base position is the first
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
      </GalaxyPhoneShell>
    </div>
  );
}
