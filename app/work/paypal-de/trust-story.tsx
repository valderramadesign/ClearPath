"use client";

/**
 * PayPal Germany — "Solving for Trust".
 *
 * The page is built around one equation — Trust = Flexibility − Friction +
 * Transparency + Control — that starts unresolved and is solved one variable
 * at a time. The equation itself is the sticky element: it pins under the top
 * bar and holds while a timeline runs beneath it, so each variable resolves in
 * the reader's view at the moment its stop makes the argument.
 *
 * That timeline is a reel of stops travelling out of the depth toward the
 * reader, alternating either side of an invisible centre. It runs on a clock
 * rather than on scroll — how far the clock has got, not how far the page has
 * moved, is what solves the terms — and the dot beneath it scrubs that clock
 * in both directions. The clock is circular: after the closing line passes,
 * the equation hands its variables back and the argument is made again.
 *
 * Motion is deliberately narrower than the site-wide ScrollFade (±60px,
 * re-triggering): everything outside the reel is once-only, 8–24px,
 * opacity/transform only. Server render and no-JS show the finished story —
 * every variable solved, every reveal settled — so the progression is an
 * enhancement, never a dependency. Reduced motion keeps the state changes but
 * makes them immediate, and leaves the reel entirely under the reader's hand.
 */

import Image, { type StaticImageData } from "next/image";
import womanOnHerPhone from "@/components/images/PayPal DE/WomanOnHerPhone.png";
import payIn30DaysPhone from "@/components/images/PayPal DE/v1-PayIn30Days/paypal-pay-in-30-days-iphone-17-pro-max-cosmic-orange.png";
import ratenzahlungPhone from "@/components/images/PayPal DE/v1-Ratenzahlung/paypal-ratenzahlung-status-bar-iphone-17-pro-max-deep-blue.png";
import macbookCheckout from "@/components/images/PayPal DE/v1-Ratenzahlung/macbook-paypal-german-commercial-glass-table-v2-4k.png";
import legacyApplicationPhoneRow from "@/components/images/PayPal DE/v1-Ratenzahlung/paypal_de_v1_android_s26_ultra_five_phone_row.png";
import redesignedApplicationPhoneFan from "@/components/images/PayPal DE/paypal_de_iphone17_white_three_phone_fan_tight.png";
import payIn30DaysConfirmPhone from "@/components/images/PayPal DE/v1-PayIn30Days/paypal-pay-in-30-days-confirm-iphone-17-pro-max-cosmic-orange.png";
import ratenzahlungReviewPhone from "@/components/images/PayPal DE/v1-Ratenzahlung/paypal-ratenzahlung-binding-request-iphone-17-pro-max-deep-blue.png";
import snoozePaymentPhoneRow from "@/components/images/PayPal DE/v1-PayIn30Days/iphone17_five_phone_row_v6.png";
import demoCheckout from "@/components/images/PayPal DE/v1-Ratenzahlung/Ratenzahlung Prototype Movie/Clean/Ratenzahlung 0.png";
import demoTerms from "@/components/images/PayPal DE/v1-Ratenzahlung/Ratenzahlung Prototype Movie/Clean/Ratenzahlung 1.png";
import demoApplication from "@/components/images/PayPal DE/v1-Ratenzahlung/Ratenzahlung Prototype Movie/Clean/Ratenzahlung 3.png";
import demoBirthday from "@/components/images/PayPal DE/v1-Ratenzahlung/Ratenzahlung Prototype Movie/Clean/Ratenzahlung 4.png";
import demoConsent from "@/components/images/PayPal DE/v1-Ratenzahlung/Ratenzahlung Prototype Movie/Clean/Ratenzahlung 5.png";
import demoSubmitted from "@/components/images/PayPal DE/v1-Ratenzahlung/Ratenzahlung Prototype Movie/Clean/Ratenzahlung 6.png";
import demoApproved from "@/components/images/PayPal DE/v1-Ratenzahlung/Ratenzahlung Prototype Movie/Clean/Ratenzahlung 7.png";
import demoSchedule from "@/components/images/PayPal DE/v1-PayIn30Days/PayIn30Days Movie/Pay in 30 Days 1.png";
import demoConfirm from "@/components/images/PayPal DE/v1-PayIn30Days/PayIn30Days Movie/Pay in 30 Days 2.png";
import demoPaid from "@/components/images/PayPal DE/v1-PayIn30Days/PayIn30Days Movie/Pay in 30 Days 3.png";
import demoHand from "@/components/images/PayPal DE/v1-Ratenzahlung/Ratenzahlung Prototype Movie/Clean/hand.png";
import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  CASE_STUDY_BODY_CLASS,
  CASE_STUDY_FOCUS_CLASS,
  CASE_STUDY_LABEL_TIGHT_CLASS,
  CASE_STUDY_METRIC_LABEL_CLASS,
  CASE_STUDY_METRIC_VALUE_CLASS,
  CASE_STUDY_SUPPORTING_CLASS,
  cx,
} from "@/components/case-study";
import { CTA_PILL_SIZE } from "@/components/ui/cta-pill";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const ACCENT = "#eb2f2f";
const GUTTER = "px-5 lg:px-[24px]";

/* ── Equation state ─────────────────────────────────────────────────────── */

type TermKey = "transparency" | "control" | "flexibility" | "friction";
type TermState = "unsolved" | "solved" | "removed";

const TERM_LABEL: Record<TermKey, string> = {
  transparency: "Transparency",
  control: "Control",
  flexibility: "Flexibility",
  friction: "Friction",
};

type SolvedMap = Record<TermKey, boolean>;

const NONE_SOLVED: SolvedMap = {
  transparency: false,
  control: false,
  flexibility: false,
  friction: false,
};

const MotionContext = createContext<{ hydrated: boolean; motionOk: boolean }>({
  hydrated: false,
  motionOk: false,
});

/* The whole map at once rather than a variable at a time: the reel loops, and
   what it hands back at the end of a pass is every variable it has taken. */
const EquationContext = createContext<{
  solved: SolvedMap;
  /* "Trust" is a variable too until the reel says otherwise: it waits at the
     weight of the terms it is made of, and only lights when the closing line
     lands. */
  lit: boolean;
  settle: (solved: SolvedMap, lit: boolean) => void;
}>({ solved: NONE_SOLVED, lit: false, settle: () => {} });

const useMotion = () => useContext(MotionContext);
const useEquation = () => useContext(EquationContext);

/* ── Motion primitives ──────────────────────────────────────────────────── */

/* Runs before paint on the client so above-the-fold elements are marked
   visible in the same frame that hides them — no flash of hidden content. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useIsomorphicLayoutEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Once-only visibility trigger. Elements already on screen when the page
 * hydrates (or restored mid-page) count as seen and never animate.
 */
function useOnceVisible<T extends HTMLElement>(options?: {
  threshold?: number;
}): { ref: RefObject<T | null>; shown: boolean } {
  const { motionOk } = useMotion();
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  const threshold = options?.threshold ?? 0.2;

  useIsomorphicLayoutEffect(() => {
    if (!motionOk || visible) return;
    const node = ref.current;
    if (!node) return;
    if (node.getBoundingClientRect().top < window.innerHeight) {
      setVisible(true);
      return;
    }
    /* The huge top margin keeps anything scrolled past still "intersecting",
       so an instant jump (End key, anchor link, scrollbar drag) that skips an
       element entirely still reveals it. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "100000px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [motionOk, visible, threshold]);

  return { ref, shown: visible || !motionOk };
}

function revealStyleFor(
  shown: boolean,
  motionOk: boolean,
  options?: { delay?: number; distance?: number; duration?: number },
): CSSProperties | undefined {
  if (!motionOk) return undefined;
  const { delay = 0, distance = 16, duration = 600 } = options ?? {};
  return {
    opacity: shown ? 1 : 0,
    transform: shown ? "none" : `translateY(${distance}px)`,
    transition: `opacity ${duration}ms ${EASE} ${delay}ms, transform ${duration}ms ${EASE} ${delay}ms`,
  };
}

type RevealProps = {
  as?: "div" | "p" | "h2" | "h3";
  id?: string;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
  children: ReactNode;
};

function Reveal({
  as = "div",
  id,
  className,
  delay = 0,
  distance = 16,
  duration = 600,
  children,
}: RevealProps) {
  const { motionOk } = useMotion();
  const { ref, shown } = useOnceVisible<HTMLDivElement>();
  const Tag = as as "div";
  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      style={revealStyleFor(shown, motionOk, { delay, distance, duration })}
    >
      {children}
    </Tag>
  );
}

/* ── Equation rendering ─────────────────────────────────────────────────── */

/**
 * One variable of the equation. An invisible bold twin reserves the width of
 * the solved weight, so the word never reflows the line when it changes state.
 */
function EquationWord({
  label,
  state,
  className,
}: {
  label: string;
  state: TermState;
  className?: string;
}) {
  const { motionOk } = useMotion();
  const duration = motionOk ? 500 : 0;
  const delay = motionOk ? 150 : 0;
  return (
    <span className={cx("relative inline-block whitespace-nowrap", className)}>
      <span aria-hidden className="invisible font-normal">
        {label}
      </span>
      <span
        className={cx(
          "absolute left-0 top-0",
          state === "solved" && "font-normal text-white",
          state === "unsolved" && "font-light text-white/45",
          state === "removed" && "font-light text-white/35",
        )}
        style={{ transition: `color ${duration}ms ${EASE}` }}
      >
        {label}
      </span>
      <span
        aria-hidden
        className="absolute left-0 right-0 -bottom-[6px] lg:-bottom-[8px] h-[2px]"
        style={{
          backgroundColor: ACCENT,
          transform: state === "solved" ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left center",
          transition: `transform ${duration}ms ${EASE} ${delay}ms`,
        }}
      />
      <span
        aria-hidden
        className="absolute left-0 right-0 top-[54%] h-[2px]"
        style={{
          backgroundColor: ACCENT,
          transform: state === "removed" ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left center",
          transition: `transform ${duration}ms ${EASE} ${delay}ms`,
        }}
      />
    </span>
  );
}

type EquationUnit = { op: string | null; content: "trust" | TermKey };

const OPEN_UNITS: EquationUnit[] = [
  { op: null, content: "trust" },
  { op: "=", content: "flexibility" },
  { op: "−", content: "friction" },
  { op: "+", content: "transparency" },
  { op: "+", content: "control" },
];

const RESOLVED_UNITS: EquationUnit[] = [
  { op: null, content: "flexibility" },
  { op: "−", content: "friction" },
  { op: "+", content: "transparency" },
  { op: "+", content: "control" },
  { op: "=", content: "trust" },
];

/** The full equation on one wrapping line. Line breaks land between units. */
function EquationLine({
  arrangement,
  stateFor,
  className,
  trustClassName,
  trustStyle,
  opClassName = "text-white/45",
  unitStyle,
}: {
  arrangement: "open" | "resolved";
  stateFor: (term: TermKey) => TermState;
  className?: string;
  trustClassName?: string;
  trustStyle?: CSSProperties;
  opClassName?: string;
  unitStyle?: (index: number) => CSSProperties | undefined;
}) {
  const units = arrangement === "open" ? OPEN_UNITS : RESOLVED_UNITS;
  return (
    <span className={cx("flex flex-wrap items-baseline gap-x-[0.5em] gap-y-[0.5em]", className)}>
      {units.map((unit, index) => (
        <span
          key={unit.content}
          className="inline-flex items-baseline gap-[0.45em] whitespace-nowrap"
          style={unitStyle?.(index)}
        >
          {unit.op && <span className={cx("font-light", opClassName)}>{unit.op}</span>}
          {unit.content === "trust" ? (
            <span className={cx("font-serif", trustClassName)} style={trustStyle}>
              Trust
            </span>
          ) : (
            <EquationWord label={TERM_LABEL[unit.content]} state={stateFor(unit.content)} />
          )}
        </span>
      ))}
    </span>
  );
}

/* ── 1 · Opening statement ──────────────────────────────────────────────── */

function OpeningStatement() {
  /* Sits as close under the facts row as the facts row sits under the
     headline. The row carries its own bottom padding (24/42px), so this
     margin is the remainder of that 48/69px gap, not the whole of it. */
  return (
    <section aria-labelledby="opening-title" className="mt-6 lg:mt-[27px]">
      <h2 id="opening-title" className="sr-only">
        The need behind the trust equation
      </h2>
      <Reveal className="theme-invariant-dark relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/15 lg:aspect-[16/9] lg:rounded-[30px]">
        <Image
          src={womanOnHerPhone}
          alt="A woman inspecting a delivery against the PayPal app on her phone at her kitchen counter."
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent lg:bg-gradient-to-r lg:from-black/85 lg:via-black/30 lg:to-transparent" />
        <p
          className={cx(
            CASE_STUDY_BODY_CLASS,
            "absolute bottom-0 left-0 right-0 p-6 text-white lg:right-auto lg:max-w-[560px] lg:p-12",
          )}
        >
          German customers wanted flexibility without feeling pushed into debt: time to inspect a
          purchase before paying, and predictable installments for larger costs. Friction and
          uncertainty weakened trust at the moments of choice{" "}
          <span className="whitespace-nowrap">and commitment.</span>
        </p>
      </Reveal>
      {/* The bet and its cost, set at the body scale in the two columns this
          page already uses for paired copy — the eyebrow above each one carries
          the hierarchy, so the copy itself reads at full body weight. */}
      <Reveal className="mt-8 flex flex-col gap-8 lg:mt-[46px] lg:flex-row lg:gap-[46px]">
        <div className="lg:w-1/2">
          <p className={CASE_STUDY_LABEL_TIGHT_CLASS}>The Strategic Bet</p>
          {/* TODO(verify): the bet is stated from the strategy documents of the
              time; confirm the wording against the approved product brief. */}
          <p className={cx(CASE_STUDY_BODY_CLASS, "mt-3 max-w-[688px] text-white/80 lg:mt-4")}>
            Adoption would grow if customers could understand the cost earlier, complete fewer
            unnecessary steps, and retain control{" "}
            <span className="whitespace-nowrap">after purchase.</span>
          </p>
        </div>
        <div className="lg:w-1/2">
          <p className={CASE_STUDY_LABEL_TIGHT_CLASS}>The Tradeoff</p>
          <p className={cx(CASE_STUDY_BODY_CLASS, "mt-3 max-w-[688px] text-white/80 lg:mt-4")}>
            A faster application could not come at the expense of an informed decision. We removed
            unnecessary steps while keeping costs, terms, and{" "}
            <span className="whitespace-nowrap">commitment clear.</span>
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ── 2 · The equation ───────────────────────────────────────────────────── */

const EQUATION_CLASS = "text-[clamp(22px,5vw,40px)] font-light";
const EQUATION_TRUST_CLASS = "text-[clamp(38px,8vw,64px)] leading-none tracking-[-0.01em]";

/**
 * The equation, and the only one on the page. It arrives unsolved and takes
 * each variable as the reel below it passes the stop that argues for it — then
 * gives all four back when the reel returns to the top.
 *
 * It carries no margin of its own: the wrapper that pins it against the top
 * bar sets the distance off the hero, and a top pad here would eat into it.
 */
function EquationHeadline() {
  const { hydrated, motionOk } = useMotion();
  const { solved, lit } = useEquation();
  const line = useOnceVisible<HTMLDivElement>({ threshold: 0.4 });

  const stateFor = (term: TermKey): TermState => {
    const isSolved = hydrated ? solved[term] : true;
    if (!isSolved) return "unsolved";
    return term === "friction" ? "removed" : "solved";
  };

  return (
    <section aria-labelledby="equation-title">
      <h2 id="equation-title" className="sr-only">
        The trust equation
      </h2>
      <div ref={line.ref} aria-hidden>
        <EquationLine
          arrangement="open"
          stateFor={stateFor}
          className={EQUATION_CLASS}
          trustClassName={cx(
            EQUATION_TRUST_CLASS,
            /* Pre-hydration it reads as lit, matching the terms' own
               server-rendered "solved" state. */
            !hydrated || lit ? "text-white/90" : "text-white/45",
          )}
          trustStyle={{ transition: `color ${motionOk ? 500 : 0}ms ${EASE}` }}
          unitStyle={(index) =>
            revealStyleFor(line.shown, motionOk, {
              delay: index * 110,
              distance: 12,
              duration: 550,
            })
          }
        />
      </div>
      <p className="sr-only">
        The trust equation: trust equals flexibility, minus friction, plus transparency, plus
        control. Each variable is solved by the work described below.
      </p>
    </section>
  );
}

/* ── 3 · The timeline ───────────────────────────────────────────────────── */

type Chapter = {
  term: TermKey;
  question: string;
  response: string;
  /* Where the line has to break for the phrase to land whole. `question` and
     `response` stay plain: they are what the scrub control announces, and a
     break is not something to read aloud. */
  questionLines?: readonly [string, string];
  responseLines?: readonly [string, string];
  /* Pulls the copy in off the stop's own edge so it ends where the figure
     under it does. Only a stop whose image carries its own margin needs one. */
  textClassName?: string;
};

const CHAPTERS: Chapter[] = [
  {
    term: "flexibility",
    question: "Two needs. Two products.",
    response:
      "I designed two paths: time before payment with Pay in 30, and predictable installments with\u00a0Ratenzahlung.",
  },
  {
    term: "friction",
    question: "Why did flexibility require four pages?",
    questionLines: ["Why did flexibility", "require four pages?"],
    response:
      "I consolidated three application pages into one by aligning with my checkout partner to surface installment options earlier and streamline terms behind\u00a0links.",
  },
  {
    term: "transparency",
    question: "What am I agreeing to?",
    response:
      "Customers saw every option and estimated cost in checkout, with full terms before\u00a0commitment.",
  },
  {
    term: "control",
    question: "What if I need more time?",
    response:
      "Customers could reschedule after reviewing the new date and fee—adding control and a new revenue\u00a0stream.",
  },
];

/** Copy set on its intended lines, or left to wrap if it was given none. */
function lines(text: string, split: readonly [string, string] | undefined) {
  if (!split) return text;
  return split.map((line, index) => (
    <Fragment key={line}>
      {index > 0 && (
        <>
          {/* The space belongs to the sentence, not to the layout: the browser
              drops it at the end of the line, and a copy of the heading keeps
              the two words apart. */}
          {" "}
          <br aria-hidden />
        </>
      )}
      {line}
    </Fragment>
  ));
}

/** The friction chapter's index within {@link CHAPTERS} — the crossfade
    timing below reads its stop's local clock off this rather than a
    hardcoded position, so it stays correct if the chapters are reordered
    again. */
const FRICTION_INDEX = CHAPTERS.findIndex((chapter) => chapter.term === "friction");

/** Registers one of the friction stop's two crossfading `<img>` nodes so the
    reel's clock-driven paint loop can write its opacity directly, the same
    way it drives every other pose in the timeline. */
type FrictionImageRegistrar = (
  which: "before" | "after",
  node: HTMLImageElement | null,
) => void;

/**
 * The illustration that clarifies a chapter, sized for the reel. Which edge it
 * hugs is settled by the stop that wraps it, so the figure only has to size
 * itself to the artefact it is showing.
 */
function ChapterFigure({
  term,
  registerFrictionImage,
}: {
  term: TermKey;
  registerFrictionImage?: FrictionImageRegistrar;
}) {
  if (term === "transparency") {
    /* The same two phones the flexibility stop opens on, carried forward to the
       screen each path ends at: what the money actually costs, stated in full
       before the button that commits to it. Sized and spaced to match that pair
       exactly, so the reel reads as one pair of products moving forward rather
       than a new artefact. */
    return (
      <div className="flex items-end gap-4 lg:gap-[24px]">
        <Image
          src={payIn30DaysConfirmPhone}
          alt="The Pay in 30 Days review screen on an iPhone, with the autopay date, the order total, and the loan authorization stated above a button that pays 300,00€ on 27 June 2026."
          sizes="(max-width: 1024px) 100px, 169px"
          quality={100}
          className="block h-auto w-[100px] shrink-0 lg:w-[169px]"
        />
        <Image
          src={ratenzahlungReviewPhone}
          alt="The PayPal Ratenzahlung review screen on an iPhone, breaking out the monthly installment, the transaction amount, the interest, and the total before the button that makes a binding request."
          sizes="(max-width: 1024px) 100px, 169px"
          quality={100}
          className="block h-auto w-[100px] shrink-0 lg:w-[169px]"
        />
      </div>
    );
  }

  if (term === "control") {
    return (
      <div className="relative w-full aspect-[8460/3632]">
        <Image
          src={snoozePaymentPhoneRow}
          alt="Five iPhone screens showing the Pay in 30 Days snooze flow: an upcoming payment due, the option to postpone it for a small fee, choosing a new date, confirming the fee, and the updated schedule with the extra-day charge applied."
          fill
          sizes="(max-width: 1024px) 560px, 680px"
          quality={100}
          className="object-contain"
        />
      </div>
    );
  }

  if (term === "flexibility") {
    /* Sized to match a phone in the three- and five-phone groups rather than to
       fill the stop: those sit inside a letterboxed box, so a phone standing on
       its own has to be scaled down to read at the same size. */
    return (
      <div className="flex items-end gap-4 lg:gap-[24px]">
        <Image
          src={payIn30DaysPhone}
          alt="Pay in 30 Days selected in PayPal checkout on an iPhone, with interest-free terms and the order total shown before confirming."
          sizes="(max-width: 1024px) 100px, 169px"
          quality={100}
          className="block h-auto w-[100px] shrink-0 lg:w-[169px]"
        />
        <Image
          src={ratenzahlungPhone}
          alt="PayPal Ratenzahlung selected in PayPal checkout on an iPhone, with installment terms and the monthly cost shown before confirming."
          sizes="(max-width: 1024px) 100px, 169px"
          quality={100}
          className="block h-auto w-[100px] shrink-0 lg:w-[169px]"
        />
      </div>
    );
  }

  /* term === "friction": the legacy four-page application, laid out across
     five Android phones, dissolves into the redesigned single page fanned
     across three iPhones — both images absolutely stacked in the same box so
     the swap reads as one artefact changing, not a layout shift. */
  return (
    <div className="relative h-[255px] w-full lg:h-[430px]">
      <Image
        ref={(node) => registerFrictionImage?.("before", node)}
        src={legacyApplicationPhoneRow}
        alt="Five Android phones in a row, each showing one page of the legacy four-page Ratenzahlung application."
        fill
        sizes="(max-width: 1024px) 560px, 680px"
        quality={100}
        className="object-contain opacity-100"
      />
      <Image
        ref={(node) => registerFrictionImage?.("after", node)}
        src={redesignedApplicationPhoneFan}
        alt="Three iPhones fanned out, showing the redesigned Ratenzahlung application: the offer and its full cost chosen in checkout, one page of details to confirm with the terms and credit check behind links, and the approved loan ready for a binding request."
        fill
        sizes="(max-width: 1024px) 560px, 680px"
        quality={100}
        className="object-contain opacity-0"
      />
    </div>
  );
}

/** Which side of the centre a stop arrives on: left, centre, right. */
type StopSide = -1 | 0 | 1;

/**
 * Every stop the reel makes, in order. Each arrives on its own side of an
 * invisible centre point — left, right, left, right — except the last, which
 * lands dead centre and stays. A stop reads toward the centre: the ones on the
 * left set flush right, so no stop leaves a gap where the eye is.
 */
const STOPS: Array<{
  key: string;
  term: TermKey | null;
  name: string;
  content: (side: StopSide, registerFrictionImage?: FrictionImageRegistrar) => ReactNode;
}> = [
  ...CHAPTERS.map((chapter) => ({
    key: chapter.term,
    term: chapter.term as TermKey | null,
    name: chapter.question,
    content: (side: StopSide, registerFrictionImage?: FrictionImageRegistrar) => (
      <>
        <div className={chapter.textClassName}>
          <h3 className="font-serif text-[clamp(24px,4.4vw,36px)] leading-[1.1] tracking-[-0.01em] text-white">
            {lines(chapter.question, chapter.questionLines)}
          </h3>
          {/* Narrower than the heading, so the copy holds its line-break rhythm
              at every width; it hugs whichever edge the stop is aligned to. */}
          <p
            className={cx(
              CASE_STUDY_BODY_CLASS,
              "mt-4 lg:mt-[22px] max-w-[620px] text-white/80",
              side < 0 && "ml-auto",
            )}
          >
            {lines(chapter.response, chapter.responseLines)}
          </p>
        </div>
        <div className={cx("mt-6 flex lg:mt-[34px]", side < 0 && "justify-end")}>
          <ChapterFigure
            term={chapter.term}
            registerFrictionImage={registerFrictionImage}
          />
        </div>
      </>
    ),
  })),
  {
    key: "outcome",
    term: null,
    name: "Trust changed customer behavior.",
    content: () => (
      <>
        <h3 className="sr-only">The outcome</h3>
        <p className="text-center font-serif text-[clamp(38px,8vw,64px)] leading-[1.05] tracking-[-0.01em] text-white/90">
          Trust changed
          <br aria-hidden />
          customer behavior.
        </p>
      </>
    ),
  },
];

/**
 * The reel runs on a clock, not on scroll. A stop travels out of the depth to
 * the plane of the screen, holds there long enough to be read, then passes the
 * viewer. Seconds, all of them.
 */
const ENTER = 1.4;
const HOLD = 5;
const EXIT = 1.5;

/** How far into one stop's exit the next sets off, so the reel is never empty. */
const OVERLAP = 0.8;
const STEP = ENTER + HOLD + EXIT - OVERLAP;

/** The friction stop's crossfade: a beat once it has stopped, held on the
    legacy application, before it dissolves into the redesign. */
const FRICTION_HOLD = 1;
const FRICTION_FADE = 0.7;

const LAST = STOPS.length - 1;

/**
 * The reel loops. CLOSE is the moment the last stop has gone by; the tail after
 * it is a beat of empty corridor, where the equation hands its variables back
 * in view before the first question comes round again.
 */
const CLOSE = STEP * LAST + ENTER + HOLD + EXIT;
const TAIL = 1.2;
const RUN = CLOSE + TAIL;

/**
 * Depth, in the units of the stage's perspective. A stop starts a little under
 * half size and leaves through NEAR — close enough to read as passing, not so
 * close that it fills the screen before it has faded. Blur carries the rest of
 * the distance: the corridor is unlit, so scale alone is a weak depth cue.
 */
const FAR = -1400;
const NEAR = 240;
const HAZE_FAR = 4;
const HAZE_NEAR = 5;

/** Which side of the invisible centre a stop arrives on. The closing line is
    the exception: it comes straight down the middle. */
const sideOf = (index: number): StopSide => (index === LAST ? 0 : index % 2 === 0 ? -1 : 1);

/** Mid-hold — where the reel sits when it is moved a whole stop at a time. */
const restAt = (index: number) =>
  Math.min(RUN, Math.min(Math.max(index, 0), LAST) * STEP + ENTER + HOLD / 2);

/** When a chapter's variable settles: the moment its stop reaches the plane and
    is fully in view, so the line struck through the term reads against the work
    that earns it rather than against an empty corridor. */
const solvedAt = (index: number) => index * STEP + ENTER;

/** When "Trust" stops being a variable: the closing line has arrived. */
const LIT_AT = LAST * STEP + ENTER;

/** The equation as it stands once `count` chapters have made their case. */
const solvedThrough = (count: number): SolvedMap => {
  const map = { ...NONE_SOLVED };
  CHAPTERS.forEach((chapter, index) => {
    map[chapter.term] = index < count;
  });
  return map;
};

type Pose = { z: number; opacity: number; haze: number };

function poseAt(index: number, time: number): Pose {
  const local = time - index * STEP;
  if (local <= 0) return { z: FAR, opacity: 0, haze: HAZE_FAR };
  if (local < ENTER) {
    /* Eased on arrival so the stop settles into the plane rather than hitting
       it, and the fade finishes early — there is still travel left to watch. */
    const travelled = 1 - (1 - local / ENTER) ** 3;
    return {
      z: FAR * (1 - travelled),
      opacity: Math.min(1, local / ENTER / 0.45),
      haze: HAZE_FAR * (1 - travelled),
    };
  }
  const held = local - ENTER;
  if (held < HOLD) return { z: 0, opacity: 1, haze: 0 };
  /* Leaving accelerates, and most of the fade is spent in the first third: the
     card is well out of the way before it is large enough to crowd the
     equation pinned above it. */
  const gone = Math.min(1, (held - HOLD) / EXIT);
  return { z: NEAR * gone * gone, opacity: (1 - gone) ** 1.6, haze: HAZE_NEAR * gone };
}

/**
 * The four chapters and their close, coming at the reader one at a time. The
 * reel plays itself while it is on screen and can be scrubbed by the dot below
 * it; either way, how far it has run is what solves the equation pinned above.
 */
function TrustTimeline() {
  const { motionOk } = useMotion();
  const { settle } = useEquation();

  const stage = useRef<HTMLDivElement | null>(null);
  const rail = useRef<HTMLDivElement | null>(null);
  const knob = useRef<HTMLDivElement | null>(null);
  const frames = useRef<Array<HTMLElement | null>>([]);
  const cards = useRef<Array<HTMLElement | null>>([]);
  const frictionImageBefore = useRef<HTMLImageElement | null>(null);
  const frictionImageAfter = useRef<HTMLImageElement | null>(null);
  /* How many variables the equation is currently showing, so a frame that
     changes nothing about it costs no render. */
  const argued = useRef(0);
  const illuminated = useRef(false);
  /* Every reason the reel is currently standing still. It resumes when the
     last one lets go, so scrubbing and focus can overlap freely. */
  const holds = useRef<Set<string>>(new Set());
  const scrubbing = useRef(false);
  const onScreen = useRef(false);
  /* Reel position in seconds. A ref, not state: the frame loop moves this
     sixty times a second, and only the stop it lands on is worth a render. */
  const clock = useRef(0);
  const landed = useRef(0);
  const [at, setAt] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  const registerFrame = useCallback((index: number, node: HTMLElement | null) => {
    frames.current[index] = node;
  }, []);

  const registerCard = useCallback((index: number, node: HTMLElement | null) => {
    cards.current[index] = node;
  }, []);

  const registerFrictionImage = useCallback<FrictionImageRegistrar>((which, node) => {
    if (which === "before") frictionImageBefore.current = node;
    else frictionImageAfter.current = node;
  }, []);

  /* One writer for the whole reel: every pose, the dot, and the terms the reel
     has argued for by now. Written straight to the nodes rather than rendered,
     so a frame costs no React work. */
  const paint = useCallback(
    (time: number) => {
      const now = Math.max(0, Math.min(RUN, time));

      for (let index = 0; index < STOPS.length; index += 1) {
        const frame = frames.current[index];
        const card = cards.current[index];
        if (!frame || !card) continue;
        const pose = poseAt(index, now);
        frame.style.transform = `translate3d(calc(var(--stop-x) * ${sideOf(index)}), 0, ${pose.z.toFixed(1)}px)`;
        card.style.opacity = pose.opacity.toFixed(3);
        card.style.filter = pose.haze > 0.2 ? `blur(${pose.haze.toFixed(2)}px)` : "";
        /* Only the stop at the front takes the pointer, so a selection never
           catches on a card that has already faded out of the way. */
        card.style.pointerEvents = pose.opacity > 0.9 ? "auto" : "none";
      }

      /* The friction stop's two images crossfade on the same clock as
         everything else: a hold once the stop has arrived, then a dissolve —
         so it stays correct under scrubbing rather than firing once. */
      const frictionLocal = now - FRICTION_INDEX * STEP;
      const frictionFadeStart = ENTER + FRICTION_HOLD;
      const frictionT = Math.max(
        0,
        Math.min(1, (frictionLocal - frictionFadeStart) / FRICTION_FADE),
      );
      if (frictionImageBefore.current) {
        frictionImageBefore.current.style.opacity = (1 - frictionT).toFixed(3);
      }
      if (frictionImageAfter.current) {
        frictionImageAfter.current.style.opacity = frictionT.toFixed(3);
      }

      if (knob.current) knob.current.style.left = `${((now / RUN) * 100).toFixed(3)}%`;

      const active = Math.min(LAST, Math.floor(now / STEP));
      if (landed.current !== active) {
        landed.current = active;
        setAt(active);
      }

      /* The equation reads the clock rather than accumulating, so it follows
         the dot backwards as readily as forwards — and is empty again by the
         time the reel comes round to the first question. */
      let count = 0;
      let lit = false;
      if (now < CLOSE) {
        while (count < CHAPTERS.length && now >= solvedAt(count)) count += 1;
        lit = now >= LIT_AT;
      }
      if (count !== argued.current || lit !== illuminated.current) {
        argued.current = count;
        illuminated.current = lit;
        settle(solvedThrough(count), lit);
      }
    },
    [settle],
  );

  useIsomorphicLayoutEffect(() => {
    paint(clock.current);
  }, [paint]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
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
      if (!onScreen.current || holds.current.size > 0) return;
      /* Round, not clamped: past the tail the clock starts the story again. */
      const ahead = clock.current + elapsed / 1000;
      clock.current = ahead >= RUN ? ahead - RUN : ahead;
      paint(clock.current);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [motionOk, paint]);

  const seek = useCallback(
    (clientX: number) => {
      const el = rail.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const along = box.width > 0 ? (clientX - box.left) / box.width : 0;
      clock.current = Math.max(0, Math.min(1, along)) * RUN;
      paint(clock.current);
    },
    [paint],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    /* Held rather than tracked through the window: pointer capture keeps the
       drag alive past the edge of a rail this narrow. */
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    scrubbing.current = true;
    holds.current.add("scrub");
    setGrabbing(true);
    seek(event.clientX);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (scrubbing.current) seek(event.clientX);
  };

  /* Also the cancel handler: a pointer the browser takes over for a page
     scroll ends in `pointercancel`, and without this the reel would stay
     paused for good. */
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!scrubbing.current) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    scrubbing.current = false;
    holds.current.delete("scrub");
    setGrabbing(false);
  };

  /* Keyboard moves a whole stop at a time — the useful unit here, and the one
     the slider reports as its value. Stepping from the ref rather than from
     state, because key repeat outruns a render. */
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const to =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? landed.current + 1
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? landed.current - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? LAST
              : null;
    if (to === null) return;
    event.preventDefault();
    clock.current = restAt(to);
    paint(clock.current);
  };

  return (
    <section className="mt-4 lg:mt-[23px]">
      <h2 id="timeline-title" className="sr-only">
        Solving the equation, one variable at a time
      </h2>
      {/* The corridor. Perspective sits here, so the middle of this box is the
          invisible point every stop converges on. Each frame is the full stage,
          which is what makes `--stop-x` a share of its width and lets the
          offset converge with everything else; the card inside carries the
          fade, because a filter would flatten the depth of the frame. */}
      <div
        ref={stage}
        role="group"
        aria-labelledby="timeline-title"
        className="relative -mx-5 h-[clamp(470px,58vh,580px)] overflow-hidden [--stop-x:4%] [perspective:1100px] md:[--stop-x:17%] lg:-mx-[24px] lg:h-[clamp(730px,64vh,820px)] lg:[--stop-x:21%]"
      >
        {STOPS.map((stop, index) => (
          <div
            key={stop.key}
            ref={(node) => {
              registerFrame(index, node);
            }}
            className={cx(
              "absolute inset-0 flex items-center justify-center",
              sideOf(index) < 0 && "[transform:translate3d(calc(var(--stop-x)*-1),0,0)]",
              sideOf(index) > 0 && "[transform:translate3d(var(--stop-x),0,0)]",
            )}
          >
            <article
              ref={(node) => {
                registerCard(index, node);
              }}
              /* Opacity starts in a class, not a style prop: React re-applies a
                 style prop on every render and would wipe the frame loop out. */
              className={cx(
                "w-[min(560px,96%)] md:w-[min(620px,55%)] lg:w-[min(680px,60%)]",
                sideOf(index) < 0 && "text-right",
                index === 0 ? "opacity-100" : "opacity-0",
              )}
            >
              {stop.content(sideOf(index), registerFrictionImage)}
            </article>
          </div>
        ))}
      </div>

      {/* How far the reel has run, and the only handle on it. */}
      <div className="mt-3 flex justify-center lg:mt-[17px]">
        <div
          ref={rail}
          role="slider"
          tabIndex={0}
          aria-label="Timeline position"
          aria-valuemin={1}
          aria-valuemax={STOPS.length}
          aria-valuenow={at + 1}
          aria-valuetext={STOPS[at].name}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          onFocus={() => holds.current.add("focus")}
          onBlur={() => holds.current.delete("focus")}
          className={cx(
            /* Half the width the old full-bleed rail ran to, and padded well
               past the hairline so the dot is worth aiming at. */
            "relative w-1/2 touch-none py-3",
            CASE_STUDY_FOCUS_CLASS,
            grabbing ? "cursor-grabbing" : "cursor-pointer",
          )}
        >
          <div aria-hidden className="h-px w-full bg-white/15" />
          <div
            ref={knob}
            aria-hidden
            className="absolute top-1/2 left-0 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          />
        </div>
      </div>
    </section>
  );
}

/* ── The prototype walkthroughs── ───────────────────────────────────────

   The two prototype recordings replayed as continuous takes. Each set of
   stills shares a single fixed viewport, so they are staged as crossfading
   layers inside a CSS-drawn white iPhone while a hand cursor — lifted from
   the stills themselves — travels between the controls it pressed. Every
   length is in cqw so the phone scales as one object.

   The loop runs on the reel's machinery: a clock ref advanced by
   requestAnimationFrame, one paint writer, an IntersectionObserver that
   pauses it off screen. Server render, no-JS, and reduced motion hold the
   first still — hand on Pay Now — so the animation is an enhancement,
   never a dependency. */

type DemoPoint = { x: number; y: number };

/* A stop either rests — the hand arrives and waits — or presses, and a
   press brings the next still in: quickly for a state change on the same
   page, slower for a page change. */
type DemoStop = DemoPoint & { press?: { layer: number; fade: number } };

/* What plays after the hand has left the frame: the screens the recording
   reaches on its own, and the return to the first still that closes the
   loop. Each step waits, then dissolves into its layer. */
type DemoTail = { layer: number; wait: number; fade: number };

/* Where the hand goes, as fractions of the 1572×3408 screen raster,
   measured off the stills. In order. Both takes open on the same checkout,
   so both start from the same rest. */
const RATENZAHLUNG_STOPS: DemoStop[] = [
  { x: 0.2023, y: 0.206 }, // rests on Pay Now, the default selection
  { x: 0.949, y: 0.206, press: { layer: 1, fade: 0.34 } }, // the half-shown tile at the right
  { x: 0.6476, y: 0.206 }, // follows Ratenzahlung as the carousel snaps it into place
  { x: 0.4809, y: 0.9026, press: { layer: 2, fade: 0.38 } }, // continue, into the application
  { x: 0.4873, y: 0.5059, press: { layer: 3, fade: 0.24 } }, // date-of-birth field
  { x: 0.0808, y: 0.5854, press: { layer: 4, fade: 0.24 } }, // consent checkbox
  { x: 0.4835, y: 0.9038, press: { layer: 5, fade: 0.38 } }, // agree and continue
];

const PAY_IN_30_DAYS_STOPS: DemoStop[] = [
  { x: 0.2023, y: 0.206 }, // rests on Pay Now, the default selection
  { x: 0.6409, y: 0.206, press: { layer: 1, fade: 0.34 } }, // the Pay in 30 Days tile beside it
  { x: 0.2974, y: 0.206 }, // follows it as the carousel snaps it into place
  { x: 0.4997, y: 0.9024, press: { layer: 2, fade: 0.3 } }, // continue, past the schedule and the authorization
  { x: 0.4997, y: 0.9024, press: { layer: 3, fade: 0.3 } }, // pay, on the same button, now priced and dated
];

/* The hand enters and leaves through the bottom bezel, so the loop's seam
   is two absences rather than a jump. */
const DEMO_ENTER: DemoPoint = { x: 0.45, y: 1.16 };
const DEMO_LEAVE: DemoPoint = { x: 0.58, y: 1.16 };

/* Seconds. A press is a dip and release; the screen answers mid-press. A
   stop that only rests holds still instead. */
const DEMO_DWELL = 0.24;
const DEMO_HOLD = 0.5;
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

/* One whole take, compiled once: hand travels, press moments, and screen
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
      time += DEMO_HOLD;
      return;
    }
    presses.push(time);
    fades.push({
      layer: stop.press.layer,
      start: time + DEMO_PRESS_DOWN,
      duration: stop.press.fade,
    });
    time += DEMO_PRESS + DEMO_SETTLE;
  });

  /* The hand leaves before the recording is finished, the way it did on the
     day: the last screens get their read unaccompanied, and the loop closes
     on the checkout it started from. */
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
   into its layer, so the stack is always a partition of one and a scrubbed
   or wrapped clock lands on the right screen. */
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

const RATENZAHLUNG_SCREENS: StaticImageData[] = [
  demoCheckout,
  demoTerms,
  demoApplication,
  demoBirthday,
  demoConsent,
  demoSubmitted,
  demoApproved,
];

const RATENZAHLUNG_DEMO = compileDemo(RATENZAHLUNG_STOPS, [
  { layer: 6, wait: 0.5, fade: 0.38 }, // submitted holds, then the approval arrives
  { layer: 0, wait: 2.1, fade: 0.56 }, // it gets its read, and checkout comes back
]);

/* Pay in 30 Days opens on the same checkout still, since it is the same
   screen: the two products sit side by side in the one carousel. */
const PAY_IN_30_DAYS_SCREENS: StaticImageData[] = [
  demoCheckout,
  demoSchedule,
  demoConfirm,
  demoPaid,
];

const PAY_IN_30_DAYS_DEMO = compileDemo(PAY_IN_30_DAYS_STOPS, [
  { layer: 0, wait: 2.6, fade: 0.56 }, // the approval gets its read, then checkout comes back
]);

/* Side hardware, proportioned off the iPhone 17 Pro shell: action and the
   volume pair on the left, side button on the right. */
const DEMO_SIDE_BUTTONS: Array<{ side: "left" | "right"; top: string; height: string }> = [
  { side: "left", top: "18%", height: "4.5cqw" },
  { side: "left", top: "24.5%", height: "7.5cqw" },
  { side: "left", top: "33%", height: "7.5cqw" },
  { side: "right", top: "27%", height: "13cqw" },
];

/* The screen's box inside the shell, in cqw: the 4.86cqw bezel inset taken
   off 100cqw across and off the shell's 205.4cqw height. The hand hangs
   outside the screen, so its base position has to be stated in the shell's
   own units rather than as a percentage of the screen. */
const DEMO_SCREEN_INSET = 4.86;
const DEMO_SCREEN_W = 100 - 2 * DEMO_SCREEN_INSET;
const DEMO_SCREEN_H = 205.4 - 2 * DEMO_SCREEN_INSET;

/**
 * An animated prototype figure for the impact spread: one recording playing
 * inside a white iPhone drawn in CSS. `className` sets the rendered width;
 * everything inside is sized in container units.
 */
function PrototypeWalkthrough({
  screens,
  script,
  label,
  className,
}: {
  /** The stills, in layer order. The first one is what a still render shows. */
  screens: StaticImageData[];
  script: DemoScript;
  /** What the figure is, for assistive technology. */
  label: string;
  className?: string;
}) {
  const { motionOk } = useMotion();
  const base = script.stops[0];

  const stage = useRef<HTMLDivElement | null>(null);
  const screen = useRef<HTMLDivElement | null>(null);
  const positioner = useRef<HTMLDivElement | null>(null);
  const handPositioner = useRef<HTMLDivElement | null>(null);
  const circle = useRef<HTMLDivElement | null>(null);
  const hand = useRef<HTMLDivElement | null>(null);
  const layers = useRef<Array<HTMLDivElement | null>>([]);
  const alphas = useRef<number[]>(new Array(screens.length).fill(0));
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
      aria-label={label}
      className={cx("relative", className)}
      style={{ containerType: "inline-size" }}
    >
      <div
        className="relative w-full"
        style={{
          aspectRatio: "1000 / 2054",
          borderRadius: "11.12cqw",
          background: "linear-gradient(145deg, #fafaf8 0%, #e7e8ea 55%, #c9ccd1 100%)",
          boxShadow: "inset 0 0 0.18cqw rgba(255,255,255,0.85), 0 2cqw 7cqw rgba(0,0,0,0.5)",
        }}
      >
        {DEMO_SIDE_BUTTONS.map((button, index) => (
          <div
            key={index}
            aria-hidden
            className="absolute"
            style={{
              ...(button.side === "left" ? { left: "-0.62cqw" } : { right: "-0.62cqw" }),
              top: button.top,
              width: "0.8cqw",
              height: button.height,
              borderRadius: "0.34cqw",
              background:
                button.side === "left"
                  ? "linear-gradient(90deg, #aaadb4, #dfe1e5)"
                  : "linear-gradient(90deg, #dfe1e5, #aaadb4)",
            }}
          />
        ))}
        <div
          aria-hidden
          className="absolute"
          style={{ inset: "0.9cqw", borderRadius: "10.22cqw", background: "#0b0b0d" }}
        />
        <div
          ref={screen}
          className="absolute overflow-hidden bg-white"
          style={{ inset: `${DEMO_SCREEN_INSET}cqw`, borderRadius: "6.26cqw" }}
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
                sizes="(max-width: 1024px) 260px, 340px"
                className="object-cover"
              />
            </div>
          ))}
          {/* The touch circle is drawn by the app, so it lives inside the
              screen and clips with it. The base position is the first stop,
              so the static render is exactly the first still. */}
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
                left: "-7.29cqw",
                top: "-7.29cqw",
                width: "14.58cqw",
                height: "14.58cqw",
                background:
                  "radial-gradient(circle, rgba(0,160,255,0.161) 0%, rgba(0,160,255,0.161) 89.8%, rgba(0,160,255,0.235) 93.7%, rgba(0,160,255,0.235) 96.9%, rgba(0,160,255,0) 100%)",
              }}
            />
          </div>
        </div>
        {/* The hand is above the glass, so it clips at the device outline
            instead: reaching a tile at the edge of the screen it laps onto
            the bezel, the way a real one would. Its mover carries the same
            offset, written from the same pose, over the screen's first stop,
            which is the bezel inset plus that fraction of the screen. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ borderRadius: "11.12cqw" }}
        >
          <div
            ref={handPositioner}
            className="absolute h-0 w-0"
            style={{
              left: `${(DEMO_SCREEN_INSET + base.x * DEMO_SCREEN_W).toFixed(3)}cqw`,
              top: `${(DEMO_SCREEN_INSET + base.y * DEMO_SCREEN_H).toFixed(3)}cqw`,
            }}
          >
            {/* Presses pivot about the fingertip, which sits at the circle's
                edge rather than the sprite's corner. */}
            <div
              ref={hand}
              className="absolute"
              style={{
                left: "-0.574cqw",
                top: "2.526cqw",
                width: "10.91cqw",
                transformOrigin: "25.8% 10.9%",
              }}
            >
              <Image src={demoHand} alt="" sizes="40px" className="block h-auto w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 4 · The impact ─────────────────────────────────────────────────────── */

type ImpactMetric = { value: string; label: string };

/**
 * One product's outcome: the screen it shipped as on one side, what it changed
 * on the other. `side` is the side the shot takes once there is room for a row,
 * and the two products alternate so the pair reads as one spread.
 */
function ProductImpact({
  name,
  note,
  figure,
  side,
  points,
  metrics,
}: {
  name: string;
  note: string;
  /** The product's shot, drawing itself at the widths this layout expects. */
  figure: ReactNode;
  side: "left" | "right";
  points: string[];
  metrics: ImpactMetric[];
}) {
  return (
    <Reveal className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-[62px]">
      {/* Takes whatever the copy leaves over and centres the shot in it, so the
          phone sits in the middle of its half rather than against the gutter.
          The min-width is the shot's own width: below it the copy gives way
          instead, which is what keeps the two columns from colliding at 1024. */}
      <div
        className={cx(
          "flex w-full justify-center lg:min-w-[340px] lg:flex-1",
          side === "right" && "lg:order-last",
        )}
      >
        {figure}
      </div>
      {/* Held to a readable measure rather than stretching to whatever the
          phone leaves behind. The row mirrors the shot from one product to the
          next, but never the copy: both products rag left, so the two blocks
          read down the same edge and the list markers stay at the start of the
          lines they mark. */}
      <div className="w-full min-w-0 flex-1 lg:w-[688px] lg:flex-initial">
        <h3 className="font-serif text-[clamp(28px,6vw,48px)] leading-[1.1] tracking-[-0.01em] text-white">
          {name}
        </h3>
        <p className={cx(CASE_STUDY_SUPPORTING_CLASS, "mt-2 lg:mt-[10px] text-white/55")}>
          {note}
        </p>
        <div className="ml-[24px] mt-8 lg:mt-[46px] flex flex-row flex-wrap gap-8 gap-y-10 lg:gap-12">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <p className={cx(CASE_STUDY_METRIC_VALUE_CLASS, "text-white")}>{metric.value}</p>
              <p className={cx(CASE_STUDY_METRIC_LABEL_CLASS, "text-white/60")}>
                {metric.label}
              </p>
            </div>
          ))}
        </div>
        {/* A single point is a sentence, not a list: there is nothing for a
            marker to separate it from. Two or more keep the list, with the
            indent on the left for both products — that is the gutter the
            markers hang in. */}
        {points.length === 1 ? (
          <p className={cx(CASE_STUDY_BODY_CLASS, "mt-4 lg:mt-[23px] text-white/80")}>
            {points[0]}
          </p>
        ) : (
          <ul
            className={cx(
              CASE_STUDY_BODY_CLASS,
              "ml-[24px] mt-4 lg:mt-[23px] flex list-disc flex-col gap-3 lg:gap-[18px] text-white/80",
            )}
          >
            {points.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </div>
    </Reveal>
  );
}

function ImpactSection() {
  return (
    <section aria-labelledby="impact-title" className="mt-24 lg:mt-[200px]">
      <Reveal as="h2" id="impact-title" className={CASE_STUDY_LABEL_TIGHT_CLASS}>
        Impact
      </Reveal>
      <div className="mt-10 lg:mt-[62px] flex flex-col gap-16 lg:gap-[120px]">
        <ProductImpact
          name="Pay in 30 Days"
          note="Inspect the purchase first; pay within 30 days."
          figure={
            <PrototypeWalkthrough
              screens={PAY_IN_30_DAYS_SCREENS}
              script={PAY_IN_30_DAYS_DEMO}
              label="The Pay in 30 Days walkthrough on an iPhone: a hand selects Pay in 30 Days in checkout, reads the autopay date, the paying bank, and the loan authorization, continues, pays, and the purchase is approved."
              className="w-[220px] shrink-0 sm:w-[260px] lg:w-[340px]"
            />
          }
          side="left"
          points={[
            "Made payment options and estimated costs visible before application.",
            "Moved preferred-bank selection into checkout.",
            "Added transparent post-purchase payment rescheduling.",
            "Introduced a fee-based payment extension, giving customers more time to pay while generating incremental revenue for\u00a0PayPal.",
          ]}
          /* TODO(verify): Add the exact pre-launch baseline, measurement window,
             and attribution method behind both figures. */
          metrics={[
            { value: "+48.78%", label: "Monthly total purchase volume" },
            { value: "+17.33%", label: "Annual incremental revenue" },
          ]}
        />
        <ProductImpact
          name="PayPal Ratenzahlung"
          note="Divide larger costs into planned installments."
          figure={
            <PrototypeWalkthrough
              screens={RATENZAHLUNG_SCREENS}
              script={RATENZAHLUNG_DEMO}
              label="The Ratenzahlung walkthrough on an iPhone: a hand selects PayPal Ratenzahlung in checkout, continues to the one-page application, fills the date of birth, accepts the terms, submits, and the plan is approved."
              className="w-[220px] shrink-0 sm:w-[260px] lg:w-[340px]"
            />
          }
          side="right"
          points={[
            "Added four installment options for different purchase needs.",
            "Placed contextual terms in checkout and complete legal terms at review.",
            "Rebuilt the application on PayPal’s current UI, reducing it from four pages to one.",
          ]}
          /* TODO(verify): Add the exact pre-launch baseline, measurement window,
             and attribution method behind both figures. */
          metrics={[
            { value: "+14.92%", label: "Monthly total purchase volume" },
            { value: "+25.44%", label: "Annual incremental revenue" },
          ]}
        />
      </div>
      {/* One note for both products: the four figures are qualified the same
          way, so it is written once, under the pair. Set like the paragraph
          under the workflow diagram — supporting scale at white/70, the site's
          voice for a line that qualifies rather than asserts — and held in the
          column the phone stands in rather than run across the full width. The
          spacer mirrors the copy column above it, so the note tracks the phone
          at every width instead of guessing at an offset. */}
      <Reveal className="mt-10 flex lg:mt-[46px] lg:gap-[62px]">
        <div aria-hidden className="hidden lg:block lg:w-[688px] lg:flex-initial" />
        <aside
          role="note"
          aria-label="Measurement context"
          className={cx(
            CASE_STUDY_SUPPORTING_CLASS,
            "w-full min-w-0 text-white/70 lg:min-w-[340px] lg:flex-1",
          )}
        >
          Both products were created from 0→1, so no pre-product baseline exists. The results
          shown here compare performance following the latest redesign with each product’s
          preceding live&nbsp;version.
        </aside>
      </Reveal>
    </section>
  );
}

/**
 * The closing thesis, set over the checkout it argues for. The statement sits
 * in the dark upper right of the frame, held there by a scrim rather than by a
 * column of its own. It is set like the opening statement over the hero: same
 * body scale, opposite corner. Below lg there is no room to read over the
 * image, so the statement drops beneath it.
 *
 * The shot keeps the story's left gutter and rounds that edge like the hero,
 * then backs out through the right one: the frame is already dissolving into
 * the page on that side, so a corner there would draw an edge the image does
 * not have.
 */
function ClosingStatement({ prototypeUrl }: { prototypeUrl?: string }) {
  return (
    <section className="theme-invariant-dark relative -mr-5 mt-24 lg:-mr-[24px] lg:mt-[200px]">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-l-2xl lg:rounded-l-[30px]">
        <Image
          src={macbookCheckout}
          alt="A MacBook on a glass table with the PayPal checkout open over a German storefront: Pay Now, Pay in 30 Days, and Ratenzahlung offered side by side."
          fill
          sizes="100vw"
          className="object-cover"
        />
        {/* The frame is already dark on the right; this only guarantees it. */}
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-gradient-to-l from-black/85 via-black/40 to-transparent lg:block"
        />
      </div>

      <Reveal className="z-10 mt-10 flex flex-col pr-5 lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:w-[41vw] lg:max-w-[653px] lg:px-0 lg:pr-[24px] lg:pt-[5%]">
        <p className={cx(CASE_STUDY_BODY_CLASS, "text-white")}>
          Customers did not adopt these products because we made credit more persuasive. They
          adopted them because PayPal made costs clearer, commitment easier to understand, and
          payment <span className="whitespace-nowrap">more controllable.</span>
        </p>
        {prototypeUrl && (
          <a
            href={prototypeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cx(
              "mt-8 inline-flex w-fit items-center whitespace-nowrap rounded-full border border-[#919191] px-6 font-normal leading-none text-white transition-colors duration-150 hover:border-white lg:mt-[50px] lg:px-[30px]",
              CTA_PILL_SIZE.lg,
            )}
          >
            Prototype
          </a>
        )}
      </Reveal>
    </section>
  );
}

/* ── The story ──────────────────────────────────────────────────────────── */

export default function TrustStory({ prototypeUrl }: { prototypeUrl?: string }) {
  const [hydrated, setHydrated] = useState(false);
  const reduced = usePrefersReducedMotion();
  const [equationState, setEquationState] = useState<{ solved: SolvedMap; lit: boolean }>({
    solved: NONE_SOLVED,
    lit: false,
  });

  useIsomorphicLayoutEffect(() => {
    setHydrated(true);
  }, []);

  const motion = useMemo(
    () => ({ hydrated, motionOk: hydrated && !reduced }),
    [hydrated, reduced],
  );
  /* The reel is the only thing that moves this: it reads its own clock and
     hands over the state of the equation at that moment, loop included. `settle`
     is kept stable — the frame loop closes over it. */
  const settle = useCallback(
    (solved: SolvedMap, lit: boolean) => setEquationState({ solved, lit }),
    [],
  );
  const equation = useMemo(
    () => ({ ...equationState, settle }),
    [equationState, settle],
  );

  return (
    <MotionContext.Provider value={motion}>
      <EquationContext.Provider value={equation}>
        <div className={cx("flex w-full flex-col", GUTTER)}>
          <OpeningStatement />

          {/* The equation and the reel pin as one block, so the reel never
              slides up behind the line that is reading it. The trailing space
              is what the block holds against: half a screen of vertical scroll
              spent on the reel before either lets go.

              That space has to be an in-flow sibling, not padding on the
              wrapper: a sticky box is clamped to its containing block, which is
              the parent's *content* box — padding-bottom sits outside it and
              buys no travel at all, leaving the block pinned to nothing. */}
          <div className="mt-24 lg:mt-[200px]">
            <div className="sticky top-[72px] lg:top-[80px] z-30 -mx-5 bg-black px-5 lg:-mx-[24px] lg:px-[24px]">
              <EquationHeadline />
              <TrustTimeline />
            </div>
            <div aria-hidden className="h-[50vh]" />
          </div>

          <ImpactSection />

          <ClosingStatement prototypeUrl={prototypeUrl} />
        </div>
      </EquationContext.Provider>
    </MotionContext.Provider>
  );
}
