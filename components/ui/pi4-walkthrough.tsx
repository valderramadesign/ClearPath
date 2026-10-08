"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import screenProduct from "@/components/videos/Pi4_Slideshow/Clean/Pi4 0.png";
import screenSheet from "@/components/videos/Pi4_Slideshow/Clean/Pi4 1.png";
import screenCheckout from "@/components/videos/Pi4_Slideshow/Clean/Pi4 2.png";
import screenDetails from "@/components/videos/Pi4_Slideshow/Clean/Pi4 3.png";
import screenBirthday from "@/components/videos/Pi4_Slideshow/Clean/Pi4 4.png";
import screenConsent from "@/components/videos/Pi4_Slideshow/Clean/Pi4 5.png";
import screenApproved from "@/components/videos/Pi4_Slideshow/Clean/Pi4 6.png";
import screenReceipt from "@/components/videos/Pi4_Slideshow/Clean/Pi4 7.png";
import handSprite from "@/components/videos/Pi4_Slideshow/Clean/hand.png";
import { cx } from "@/lib/cx";

/* ── The Pay in 4 walkthrough ────────────────────────────────────────────

   The redesigned flow replayed as one continuous take: the recording's
   stills crossfade inside the page's iPhone shell while a hand cursor
   travels between the controls it pressed. The machinery is the same as
   the PayPal DE walkthroughs — a clock ref advanced by
   requestAnimationFrame, one paint writer, an IntersectionObserver that
   pauses it off screen. Server render, no-JS, and reduced motion hold the
   first still with the hand at rest, so the animation is an enhancement,
   never a dependency. */

type DemoPoint = { x: number; y: number };

/* Every stop here presses; the screen answers mid-press. A state change on
   the same page dissolves quickly, a page change more slowly. */
type DemoStop = DemoPoint & {
  press?: { layer: number; fade: number };
  /** Extra seconds to linger once the press has settled, for screens whose
      callouts need reading before the hand moves on. */
  hold?: number;
};

type DemoTail = { layer: number; wait: number; fade: number };

/* Where the hand goes, as fractions of the 1572×3408 screen raster,
   measured off the recording's own cursor positions. */
const PAY_IN_4_STOPS: DemoStop[] = [
  { x: 0.8511, y: 0.7961, press: { layer: 1, fade: 0.38 } }, // Learn more, under the PayPal button
  { x: 0.5, y: 0.9023, press: { layer: 2, fade: 0.38 }, hold: 3.4 }, // continue with Pay in 4, into checkout
  /* Pay in 4 arrives already selected on the checkout, so there is nothing
     to go back up and choose: the hand stays on the CTA it just used and
     presses Continue in the same place. */
  { x: 0.4994, y: 0.9024, press: { layer: 3, fade: 0.38 }, hold: 0.7 }, // continue, on to the application
  { x: 0.5025, y: 0.512, press: { layer: 4, fade: 0.24 }, hold: 0.7 }, // date-of-birth field
  { x: 0.0827, y: 0.674, press: { layer: 5, fade: 0.24 } }, // consent checkbox
  { x: 0.4975, y: 0.9041, press: { layer: 6, fade: 0.38 } }, // agree and apply
  { x: 0.4975, y: 0.8947, press: { layer: 7, fade: 0.38 } }, // pay, on the approved checkout
];

/* The hand enters and leaves through the bottom bezel, so the loop's seam
   is two absences rather than a jump. */
const DEMO_ENTER: DemoPoint = { x: 0.45, y: 1.16 };
const DEMO_LEAVE: DemoPoint = { x: 0.58, y: 1.16 };

/* Seconds. A press is a dip and release; a fade starts mid-press. */
const DEMO_DWELL = 0.24;
const DEMO_PRESS = 0.43;
const DEMO_PRESS_DOWN = 0.17;
const DEMO_SETTLE = 0.26;

/* The screen raster is tall; distances are measured isotropically so a
   vertical run is not undercounted when pacing a travel. */
const DEMO_ASPECT = 3408 / 1572;

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

/* The whole take, compiled once: hand travels, press moments, and screen
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

  /* The hand leaves before the recording is finished: the thank-you screen
     gets its read unaccompanied, and the loop closes on the product page
     it started from. */
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

/* Hand pose at one moment: position, visibility, and how deep into a press
   it is. Travels bow slightly off the straight line so a run between two
   controls reads as a hand, not a tween. */
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

const PAY_IN_4_SCREENS: StaticImageData[] = [
  screenProduct,
  screenSheet,
  screenCheckout,
  screenDetails,
  screenBirthday,
  screenConsent,
  screenApproved,
  screenReceipt,
];

const PAY_IN_4_DEMO = compileDemo(PAY_IN_4_STOPS, [
  { layer: 0, wait: 2.1, fade: 0.56 }, // the receipt gets its read, and the product page comes back
]);

/* The shell is the page's DeviceShell drawn client-side — same radius
   chain, rail padding and hardware — in a black cherry finish, so the
   featured device reads as the sixth phone in the lineup rather than a
   different prop. */
const BLACK_CHERRY = {
  rail: "linear-gradient(155deg,#6B2A34 0%,#451820 30%,#23090D 55%,#571F28 78%,#310E14 100%)",
  button: "#451820",
};

/* The screen's box inside the shell, in cqw: 1.6 rail padding plus 1.8
   bezel off each side. The hand hangs outside the screen, so its base
   position has to be stated in the shell's own units rather than as a
   percentage of the screen. */
const SCREEN_INSET = 3.4;
const SCREEN_W = 100 - 2 * SCREEN_INSET;
const SCREEN_H = SCREEN_W * DEMO_ASPECT;

/* ── Callouts ────────────────────────────────────────────────────────────

   The recording carried white annotations naming what each screen was
   doing. They are re-set here as type rather than baked into the stills, so
   they scale with the device and can be timed: a rule bracketing the part
   of the screen being pointed at, and the note left-aligned beside it,
   both in the shell's own units. Geometry is taken off the original
   frames — rule a little under 2% of the device wide, held clear of the
   case, the note a comfortable gap further out again. */
const NOTE_RULE_W = 1.7;
const NOTE_SHELL_GAP = 2.6;
const NOTE_TEXT_GAP = 3.4;
const NOTE_TEXT_W = 58;
const NOTE_RAIL_W = NOTE_TEXT_W + NOTE_TEXT_GAP + NOTE_RULE_W;
const NOTE_FONT = 4.6;
/** Seconds a note takes to draw in, and to give way again. */
const NOTE_DRAW = 0.42;

/* Room the notes need to the right of the case comes to
   NOTE_RAIL_W + NOTE_SHELL_GAP = 65.7% of the device's width. The page
   reserves it as --pi4-rail beside the animation's column. */

type DemoNote = {
  layer: number;
  text: string;
  /** Vertical extent of the rule, as fractions of the screen raster. */
  top: number;
  bottom: number;
  /** Seconds after the screen lands before the note draws, and — where one
      screen carries two passes — when it gives way to the next. */
  at: number;
  until?: number;
};

const PAY_IN_4_NOTES: DemoNote[] = [
  { layer: 0, text: "Show credit options\nin checkout", top: 0.7758, bottom: 0.8178, at: 0.25 },
  /* The checkout gets the recording's two passes over it: first what the
     page says, then what it lets you do. */
  { layer: 2, text: "Value propositions\nclear on checkout", top: 0.142, bottom: 0.2004, at: 0.25, until: 1.75 },
  { layer: 2, text: "Above the fold", top: 0.2245, bottom: 0.2823, at: 0.38, until: 1.75 },
  { layer: 2, text: "Terms 1-click away", top: 0.2242, bottom: 0.2826, at: 1.95 },
  { layer: 2, text: "Clear terms\nbefore applying", top: 0.3157, bottom: 0.5643, at: 2.08 },
  { layer: 2, text: "Edit details\nafter applying", top: 0.5915, bottom: 0.7485, at: 2.21 },
  { layer: 3, text: "Preferred payment\nmethod selected", top: 0.3592, bottom: 0.441, at: 0.25 },
  { layer: 4, text: "Use of birthday instead\nof phone number", top: 0.466, bottom: 0.5478, at: 0.25 },
];

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The redesigned Pay in 4 flow replaying inside a black cherry iPhone.
 * `className` sets the rendered width; everything inside is sized in
 * container units off it.
 */
export default function Pi4Walkthrough({ className }: { className?: string }) {
  const screens = PAY_IN_4_SCREENS;
  const script = PAY_IN_4_DEMO;
  const base = script.stops[0];

  /* Animation is gated on hydration and the user's motion preference; until
     both clear, the figure is the server render: first still, hand at rest. */
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
  const notes = useRef<Array<HTMLDivElement | null>>([]);
  const rules = useRef<Array<HTMLSpanElement | null>>([]);
  /* Seeded to match the server render — first still showing — so the clock's
     first frame does not read the stack as empty. */
  const alphas = useRef<number[]>(PAY_IN_4_SCREENS.map((_, index) => (index === 0 ? 1 : 0)));
  /* How long each screen has been fully landed, which is what the notes on
     it are timed against. The opening screen starts settled, so its note is
     already drawn at rest. */
  const settled = useRef<number[]>(PAY_IN_4_SCREENS.map((_, index) => (index === 0 ? 999 : 0)));
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
      /* A note belongs to its screen: it draws a beat after that screen has
         landed and dissolves with it, so it can never be read against the
         wrong thing. */
      for (let index = 0; index < PAY_IN_4_NOTES.length; index += 1) {
        const note = PAY_IN_4_NOTES[index];
        const group = notes.current[index];
        if (!group) continue;
        const held = settled.current[note.layer];
        const drawn = clamp01((held - note.at) / NOTE_DRAW);
        const gone = note.until === undefined ? 0 : clamp01((held - note.until) / NOTE_DRAW);
        group.style.opacity = (alphas.current[note.layer] * drawn * (1 - gone)).toFixed(3);
        const rule = rules.current[index];
        if (rule) rule.style.transform = `scaleY(${drawn.toFixed(3)})`;
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
      for (let index = 0; index < settled.current.length; index += 1) {
        settled.current[index] =
          alphas.current[index] > 0.999 ? settled.current[index] + elapsed / 1000 : 0;
      }
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
      aria-label="Animated walkthrough of the redesigned Pay in 4 flow: from a product page, a cursor opens the Pay in 4 sheet, confirms details on the single review-and-apply page, and pays with the approved plan. Callouts mark the credit options shown in checkout, the value propositions and terms carried above the fold on checkout, the terms shown in full before applying, the shipping details still open to edit after applying, the preferred payment method already selected, and the date of birth asked for in place of a phone number."
      className={cx("relative", className)}
      style={{ containerType: "inline-size" }}
    >
      <div className="relative rounded-[12.4cqw] p-[1.6cqw]" style={{ backgroundImage: BLACK_CHERRY.rail }}>
        <span aria-hidden="true" className="absolute w-[1cqw] rounded-[0.4cqw] left-[-0.5cqw] top-[21.5%] h-[3.4%]" style={{ background: BLACK_CHERRY.button }} />
        <span aria-hidden="true" className="absolute w-[1cqw] rounded-[0.4cqw] left-[-0.5cqw] top-[27.8%] h-[5.6%]" style={{ background: BLACK_CHERRY.button }} />
        <span aria-hidden="true" className="absolute w-[1cqw] rounded-[0.4cqw] left-[-0.5cqw] top-[35.2%] h-[5.6%]" style={{ background: BLACK_CHERRY.button }} />
        <span aria-hidden="true" className="absolute w-[1cqw] rounded-[0.4cqw] right-[-0.5cqw] top-[26.5%] h-[9%]" style={{ background: BLACK_CHERRY.button }} />

        <div className="rounded-[10.8cqw] bg-[#08080A] p-[1.8cqw]">
          <div
            ref={screen}
            className="relative w-full overflow-hidden rounded-[8cqw] bg-white"
            style={{ aspectRatio: "1572 / 3408" }}
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
                  sizes="(max-width: 1024px) 300px, 380px"
                  className="object-cover"
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
                  left: "-7.53cqw",
                  top: "-7.53cqw",
                  width: "15.06cqw",
                  height: "15.06cqw",
                  background:
                    "radial-gradient(circle, rgba(0,160,255,0.161) 0%, rgba(0,160,255,0.161) 89.8%, rgba(0,160,255,0.235) 93.7%, rgba(0,160,255,0.235) 96.9%, rgba(0,160,255,0) 100%)",
                }}
              />
            </div>
          </div>
        </div>
        {/* The hand is above the glass, so it clips at the device outline
            instead: reaching a control at the edge of the screen it laps
            onto the bezel, the way a real one would. Its mover carries the
            same offset, written from the same pose, over the screen's first
            stop, which is the bezel inset plus that fraction of the
            screen. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ borderRadius: "12.4cqw" }}
        >
          <div
            ref={handPositioner}
            className="absolute h-0 w-0"
            style={{
              left: `${(SCREEN_INSET + base.x * SCREEN_W).toFixed(3)}cqw`,
              top: `${(SCREEN_INSET + base.y * SCREEN_H).toFixed(3)}cqw`,
            }}
          >
            {/* Presses pivot about the fingertip, which sits at the circle's
                edge rather than the sprite's corner. */}
            <div
              ref={hand}
              className="absolute"
              style={{
                left: "-0.593cqw",
                top: "2.608cqw",
                width: "11.26cqw",
                transformOrigin: "25.8% 10.9%",
              }}
            >
              <Image src={handSprite} alt="" sizes="48px" className="block h-auto w-full" />
            </div>
          </div>
        </div>
        {/* The callouts hang off the right of the case. Absolute, so they
            cost the shell no width and every container unit inside it keeps
            its meaning; the page reserves the room beside the column. Below
            lg the phone is centred with no margin to hang them in, so they
            sit the breakpoint out. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 hidden lg:block"
          style={{ left: `calc(100% + ${NOTE_SHELL_GAP}cqw)`, width: `${NOTE_RAIL_W}cqw` }}
        >
          {PAY_IN_4_NOTES.map((note, index) => (
            <div
              key={`${note.layer}-${note.text}`}
              ref={(node) => {
                notes.current[index] = node;
              }}
              className="absolute inset-x-0 flex items-center justify-start"
              style={{
                top: `${(SCREEN_INSET + note.top * SCREEN_H).toFixed(3)}cqw`,
                height: `${((note.bottom - note.top) * SCREEN_H).toFixed(3)}cqw`,
                gap: `${NOTE_TEXT_GAP}cqw`,
                opacity: note.layer === 0 ? 1 : 0,
              }}
            >
              {/* Drawn top-down as it arrives, so the eye is taken to the
                  top of the region it brackets first. The rule leads the
                  row so it stays nearest the case and the note reads
                  outward from it. */}
              <span
                ref={(node) => {
                  rules.current[index] = node;
                }}
                className="h-full shrink-0 rounded-full bg-white"
                style={{
                  width: `${NOTE_RULE_W}cqw`,
                  transformOrigin: "top",
                  transform: note.layer === 0 ? undefined : "scaleY(0)",
                }}
              />
              <p
                className="whitespace-pre-line text-left leading-[1.35] text-white/70"
                style={{ fontFamily: "var(--font-league-spartan)", fontSize: `${NOTE_FONT}cqw` }}
              >
                {note.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
