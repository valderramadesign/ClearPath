import type { CSSProperties } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import NextCaseStudyTicker from "@/components/ui/next-case-study-ticker";
import CaseStudyTopBar from "@/components/ui/case-study-top-bar";
import RevealSlider from "@/components/ui/reveal-slider";
import Pi4Walkthrough from "@/components/ui/pi4-walkthrough";
import ScrollFade from "@/components/ui/scroll-fade";
import CounterNumber from "@/components/ui/counter-number";
import { ImageMarquee } from "@/components/ui/image-marquee";
import { AnimatedImpactRow } from "@/components/ui/animated-impact-row";
import quantumLeap from "@/components/images/PayPalQuantumLeap/PayPalQuantumLeap.png";
import iterations from "@/components/images/PayPalQuantumLeap/Wireframes/Iterations.png";
import wireframePayIn4 from "@/components/images/PayPalQuantumLeap/Wireframes/Pay in 4 - Wireframe.png";
import wireframePayMonthly from "@/components/images/PayPalQuantumLeap/Wireframes/Pay Monthly - Wireframe.png";
import wireframeCreditUS from "@/components/images/PayPalQuantumLeap/Wireframes/PayPal Credit US - Wireframe.png";
import wireframeMastercardUS from "@/components/images/PayPalQuantumLeap/Wireframes/Mastercard US - Wireframe.png";
import wireframePayIn3 from "@/components/images/PayPalQuantumLeap/Wireframes/Pay in 3 - Wireframe.png";
import wireframeCreditUK from "@/components/images/PayPalQuantumLeap/Wireframes/PayPal Credit UK - Wireframe.png";
import legacyStep1 from "@/components/images/PayPalQuantumLeap/Pay in 4 - Old 3 pager/Pi4_3-1.png";
import legacyStep2 from "@/components/images/PayPalQuantumLeap/Pay in 4 - Old 3 pager/Pi4_3-2.png";
import legacyStep3 from "@/components/images/PayPalQuantumLeap/Pay in 4 - Old 3 pager/Pi4_3-3.png";
import legacyStep4 from "@/components/images/PayPalQuantumLeap/Pay in 4 - Old 3 pager/Pi4_3-4.png";
import legacyStep5 from "@/components/images/PayPalQuantumLeap/Pay in 4 - Old 3 pager/Pi4_3-5.png";
import redesignStep1 from "@/components/images/PayPalQuantumLeap/Pay in 4 - New 1 pager/Pi4_1-1.png";
import redesignStep2 from "@/components/images/PayPalQuantumLeap/Pay in 4 - New 1 pager/Pi4_1-2.png";
import redesignStep3 from "@/components/images/PayPalQuantumLeap/Pay in 4 - New 1 pager/Pi4_1-3.png";
import payMonthlyScreens from "@/components/images/PayMonthlyScreens.png";
import payPalCreditScreens from "@/components/images/PayPalCreditScreens.png";
import payPalMastercardScreens from "@/components/images/PayPalMastercardScreens.png";
import { CTA_PILL_SIZE } from "@/components/ui/cta-pill";
import payPalCreditUKScreens from "@/components/images/PayPalCreditUKScreens.png";
import payIn3UKScreens from "@/components/images/PayIn3UKScreens.png";
import cardArtPayIn4 from "@/components/images/PayIn4_CardArt.png";
import cardArtPayMonthly from "@/components/images/PayMonthly_CardArt.png";
import cardArtPayPalCredit from "@/components/images/PayPalCredit_CardArt.png";
import cardArtPayPalMastercard from "@/components/images/PayPalMastercard_CardArt.png";
import cardArtPayIn3 from "@/components/images/PayIn3_CardArt.png";
import {
  CaseStudyHeader,
  ProjectFacts,
  ProcessDiagram,
  type ProcessDiagramProps,
  SupportingAppendix,
  CASE_STUDY_BODY_CLASS,
  CASE_STUDY_LABEL_TIGHT_CLASS,
  CASE_STUDY_STACK_CLASS,
  CASE_STUDY_SUPPORTING_CLASS,
  cx,
} from "@/components/case-study";
import {
  PAYPAL_PRODUCT_IREV,
  PROJECTS_BY_ID,
  previewOf,
} from "@/lib/content";
import { caseStudyMetadata } from "@/lib/seo";

const project = PROJECTS_BY_ID.paypal;
const nextMeta = PROJECTS_BY_ID.meta;
const nextMetaPreview = previewOf(nextMeta);
const nextSolo = PROJECTS_BY_ID.solo;
const nextSoloPreview = previewOf(nextSolo);

/* ── iRev ────────────────────────────────────────────────────────────────
   Each product's annual incremental revenue against its own preceding annual
   baseline. They live in lib/content.ts, so the product sections, the Overall
   Impact cards and the résumé are all reading the same set of numbers.
   Aliased here for the markup below. */
const PRODUCT_IREV = PAYPAL_PRODUCT_IREV;

export const metadata = caseStudyMetadata(
  project,
  "Redesigning six US and UK PayPal credit products for the new checkout framework — cutting the Pay in 4 funnel from three steps to one, doubling application completion and lifting conversion across the portfolio from 51% to 79%.",
);

const leagueSpartan = "var(--font-league-spartan)";

/* ── Section rhythm ──────────────────────────────────────────────────────
   One value for the air between the page's major beats, so they can never
   drift apart: 200px at the width this was drawn for, stepping down twice on
   the way to a phone, where 200px of nothing is just scrolling. */
const SECTION_GAP = "mt-24 md:mt-[140px] lg:mt-[200px]";

/* ── The scope ───────────────────────────────────────────────────────────
   Scope facts, not outcomes: authored flat and rendered without counters so
   they read as the brief rather than as results. */
const SCOPE_FACTS = [
  { value: "6", label: "Credit products" },
  { value: "2", label: "Markets" },
  { value: "1", label: "Checkout framework" },
];

/* Six implementations, not six products. PayPal Credit is authored twice
   because it shipped into two markets, each with its own funnel and its own
   regulatory constraints; collapsing them to five would hide half the work. */
const CREDIT_PORTFOLIO = [
  { art: wireframePayIn4, name: "Pay in 4", market: "United States" },
  { art: wireframePayMonthly, name: "Pay Monthly", market: "United States" },
  { art: wireframeCreditUS, name: "PayPal Credit", market: "United States" },
  { art: wireframeMastercardUS, name: "PayPal Mastercard", market: "United States" },
  { art: wireframePayIn3, name: "Pay in 3", market: "United Kingdom" },
  { art: wireframeCreditUK, name: "PayPal Credit", market: "United Kingdom" },
];

/* ── Overall Impact ──────────────────────────────────────────────────────
   The two rows are authored as data and rendered through one shared column
   template, so a UK card always sits under the US card it belongs with. The
   iRev figures come from PRODUCT_IREV, each one measured against that
   product's own baseline. TPV is volume, not revenue, and stands on its own. */
const US_CREDIT_IMPACT = [
  { art: cardArtPayIn4, product: "Pay in 4", amount: 67, decimals: 0, label: "TPV" },
  { art: cardArtPayMonthly, product: "Pay Monthly", amount: PRODUCT_IREV.payMonthly, decimals: 2, label: "iRev" },
  { art: cardArtPayPalCredit, product: "PayPal Credit", amount: PRODUCT_IREV.payPalCreditUS, decimals: 2, label: "iRev" },
  { art: cardArtPayPalMastercard, product: "PayPal Mastercard", amount: PRODUCT_IREV.payPalMastercard, decimals: 2, label: "iRev" },
];

const UK_CREDIT_IMPACT = [
  { art: cardArtPayIn3, product: "Pay in 3", amount: 37, decimals: 0, label: "TPV" },
  { art: cardArtPayPalCredit, product: "PayPal Credit", amount: PRODUCT_IREV.payPalCreditUK, decimals: 2, label: "iRev" },
];

/*
 * One template for both rows, so a UK card always sits under the US card it
 * belongs with. The widest card is "PayPal Mastercard"; four of them set in
 * body type plus the 60px gutters clear a 1280px viewport with room over,
 * so under that the row folds to two columns rather than
 * squeezing the product names into wraps. The 732px cap keeps those two
 * columns at their design width instead of stretching them across the page.
 */
const IMPACT_GRID =
  "grid w-full grid-cols-1 items-end gap-x-[60px] gap-y-10 md:max-w-[732px] md:grid-cols-2 lg:gap-y-[64px] xl:max-w-none xl:grid-cols-4";

function ImpactCard({
  art,
  product,
  amount,
  prefix = "$",
  suffix,
  decimals = 0,
  label,
}: {
  art: React.ReactNode;
  product: string;
  amount: number;
  prefix?: string;
  suffix: string;
  decimals?: number;
  label: string;
}) {
  return (
    <div
      className="flex flex-col items-start gap-[4px] text-white"
      style={{ fontFamily: "var(--font-league-spartan)" }}
    >
      {art}
      <p className={cx(CASE_STUDY_BODY_CLASS, "mt-2")}>{product}</p>
      <div className="mt-[10px] flex items-baseline gap-3 lg:gap-[16px]">
        <p className="font-serif text-[clamp(40px,10vw,64px)] lg:text-[64px] font-normal leading-none tracking-[-0.64px] whitespace-nowrap">
          <CounterNumber
            to={amount}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
          />
        </p>
        <p className={CASE_STUDY_BODY_CLASS}>{label}</p>
      </div>
    </div>
  );
}

/* ── The Pay in 4 deep dive ──────────────────────────────────────────────
   Two finishes, one per state. The five legacy screens are white and the
   three that replaced them are blue, so the divider changes the colour of
   the row as well as its count and the swap is legible before a single
   screen is read — so the blue carries real chroma rather than the grey cast
   a "mist" finish would have, which at this size was too close to the warm
   white to tell apart. The rail is a gradient because a flat fill reads as
   paper rather than anodised aluminium, and each button tone is that colour
   pulled down so the hardware sits in the frame instead of on top of it. */
const IPHONE_FINISHES = {
  white: {
    rail: "linear-gradient(155deg,#FBFAF7 0%,#E7E4DD 30%,#C6C2B8 55%,#F5F3ED 78%,#D8D4CA 100%)",
    button: "#C4C0B6",
  },
  skyBlue: {
    rail: "linear-gradient(155deg,#EAF4FF 0%,#BEDBF5 30%,#7FAAD4 55%,#DCEDFF 78%,#A6CAEA 100%)",
    button: "#7DA8D2",
  },
} as const;

/* The legacy flow in the order a customer met it: two checkout screens with
   the three application steps caught between them. */
const LEGACY_STEPS = [
  {
    screen: 1,
    src: legacyStep1,
    finish: IPHONE_FINISHES.white,
    alt: "Legacy Pay in 4, screen one: the PayPal checkout wallet, with Pay in 4 chosen under Pay Later.",
  },
  {
    screen: 2,
    src: legacyStep2,
    finish: IPHONE_FINISHES.white,
    alt: "Legacy Pay in 4, screen two: the offer, showing four payments of $71.25 and the terms attached to them.",
  },
  {
    screen: 3,
    src: legacyStep3,
    finish: IPHONE_FINISHES.white,
    alt: "Legacy Pay in 4, screen three: a Review your info step for billing address and phone number, ending in Agree and Apply.",
  },
  {
    screen: 4,
    src: legacyStep4,
    finish: IPHONE_FINISHES.white,
    alt: "Legacy Pay in 4, screen four: an autopay step for choosing a payment method and accepting the loan agreement.",
  },
  {
    screen: 5,
    src: legacyStep5,
    finish: IPHONE_FINISHES.white,
    alt: "Legacy Pay in 4, screen five: checkout again, with Pay in 4 approved and a Complete Purchase button.",
  },
];

/* Each set was captured at its own canvas size — 1500 x 3408 for the legacy
   run, 1572 x 3480 for the redesign — and the two rows now have to be
   interchangeable, so every screen is pinned to one ratio and the captures
   fill it. It costs about a pixel off the outer edge of the wider set and
   buys the two rows identical devices, which is what lets three of them
   take the place of three others without anything moving. */
const PI4_SCREEN = { aspect: "1500 / 3408", fill: "#FFFFFF" };

/* Every row inside the comparison frame carries the same horizontal padding
   and sits on the same five-column bed: the divider then cuts each of them
   at the same pixel, and the three redesigned screens land in the seats the
   middle three legacy screens vacate. Below md the two device rows fall
   back to snap filmstrips, where five across would shrink past reading. */
const PI4_ROW_PAD = "px-6 md:px-8 lg:px-12";
const PI4_ROW_GRID = "md:grid md:grid-cols-5 md:gap-4 lg:gap-6 xl:gap-[32px]";
const PI4_FILMSTRIP =
  "-mx-6 flex list-none snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto pb-1 [scrollbar-width:none] md:mx-0 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden";
const PI4_CELL = "@container w-[64%] max-w-[300px] shrink-0 snap-start md:w-auto md:max-w-none";

/* The same journey after the consolidation: checkout, the one page that
   replaced the funnel, and checkout again with the decision already made. */
const REDESIGN_STEPS = [
  {
    screen: 1,
    src: redesignStep1,
    finish: IPHONE_FINISHES.skyBlue,
    alt: "Redesigned Pay in 4, screen one: checkout with Pay in 4 pre-approved, showing four payments of $52.50 and their due dates in place.",
  },
  {
    screen: 2,
    src: redesignStep2,
    finish: IPHONE_FINISHES.skyBlue,
    alt: "Redesigned Pay in 4, screen two: a single Confirm a few details to apply page holding billing address, autopay, date of birth and the agreements, ending in Agree and Apply.",
  },
  {
    screen: 3,
    src: redesignStep3,
    finish: IPHONE_FINISHES.skyBlue,
    alt: "Redesigned Pay in 4, screen three: checkout with Pay in 4 approved, a You are approved confirmation, and a Pay $52.50 Today button.",
  },
];

/* The pattern the other five products inherited, in the order it has to be
   read: the flow, then what goes on the page, then what each product is
   allowed to change inside it. */
const DESIGN_DECISIONS = [
  {
    number: "01",
    title: "Core flow",
    body: "Checkout offer, one review-and-apply page, approval returned to checkout.",
  },
  {
    number: "02",
    title: "Content rules",
    body: "Value, payment schedule, editable customer details, payment method, and agreements sit above one Agree and Apply action.",
  },
  {
    number: "03",
    title: "Controlled variants",
    body: "The flow holds while product fields, underwriting requirements, and US or UK disclosures change inside it.",
  },
];

/* The phone. Rail, bezel and screen are all sized in container-query units,
   so the device holds its proportions at every column width and the corner
   radii keep meeting the radius already baked into the screenshots. The
   hardware is decorative; the screen is the content, and it carries the alt
   text. */
function DeviceShell({
  src,
  alt,
  finish,
  screen,
}: {
  src: StaticImageData;
  alt: string;
  finish: { rail: string; button: string };
  screen: { aspect: string; fill: string };
}) {
  const rail = { background: finish.button };
  const railEdge =
    "absolute w-[1cqw] rounded-[0.4cqw]";

  return (
    <div
      className="relative rounded-[12.4cqw] p-[1.6cqw]"
      style={{ backgroundImage: finish.rail }}
    >
      <span aria-hidden="true" className={cx(railEdge, "left-[-0.5cqw] top-[21.5%] h-[3.4%]")} style={rail} />
      <span aria-hidden="true" className={cx(railEdge, "left-[-0.5cqw] top-[27.8%] h-[5.6%]")} style={rail} />
      <span aria-hidden="true" className={cx(railEdge, "left-[-0.5cqw] top-[35.2%] h-[5.6%]")} style={rail} />
      <span aria-hidden="true" className={cx(railEdge, "right-[-0.5cqw] top-[26.5%] h-[9%]")} style={rail} />

      <div className="rounded-[10.8cqw] bg-[#08080A] p-[1.8cqw]">
        <div
          className="relative w-full overflow-hidden rounded-[8cqw]"
          style={{ aspectRatio: screen.aspect, background: screen.fill }}
        >
          <Image src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover object-center" />
        </div>
      </div>
    </div>
  );
}

/* The working loop, told for this case study. */
const PROCESS_STEPS: ProcessDiagramProps["steps"] = {
  empathize: {
    body: "I focused research with PayPal Research on why six credit applications interrupted checkout.",
    ai: "Connected six funnels, their metrics and the brief into one research plan",
  },
  define: {
    body: "I framed six redesigns as one problem, repeated checkout interruption, and set shared rules.",
    ai: "Challenged US and UK assumptions and helped define success",
  },
  ideate: {
    body: "I led 40+ iterations, weighing options with product, legal, design and leadership.",
    ai: "Generated low-fidelity flow concepts under my direction",
  },
  refine: {
    body: "I refined one review-and-apply page with controlled variants for each product.",
    ai: "Exposed gaps in disclosures, underwriting fields and edge cases",
  },
  prototype: {
    body: "I chose a production-close path so six teams could build from one pattern.",
    ai: "Figma MCP connected the shared pattern to production components",
  },
  test: {
    body: "I prioritized issues with PayPal Research and turned findings into design changes.",
    ai: "Organized findings across six products and two markets",
  },
  implement: {
    body: "I confirmed readiness with six product teams through specifications, QA and launch.",
    ai: "Applied approved changes across variants and extended QA coverage",
  },
};

export default function PayPal1CaseStudy() {
  return (
    <main className="bg-black text-white">
      <CaseStudyTopBar />

      {/* Opening: eyebrow, headline, and the one fact that frames the work.
          Timeline and platforms stay on the record; the role states the
          duration, so the header does not repeat it. */}
      <div
        className="px-5 lg:px-[24px] pt-10 lg:pt-[78px]"
        style={{ fontFamily: leagueSpartan }}
      >
        <CaseStudyHeader project={project} />
        <ProjectFacts
          project={project}
          facts={[]}
          className="mt-6 lg:mt-[27px]"
          factClassName={{ role: "lg:w-[861px]" }}
        />
      </div>

      {/* Contextual hero. The photograph carries a dark left third, so the
          scrim only has to deepen what is already there: bottom-up on mobile,
          where the statement crosses the frame, and left-to-right on desktop,
          where it sits in that dark column. */}
      <section
        aria-labelledby="paypal-hero-title"
        className="px-5 lg:px-[24px] mt-6 lg:mt-[27px]"
        style={{ fontFamily: leagueSpartan }}
      >
        <h2 id="paypal-hero-title" className="sr-only">
          Why PayPal credit applications needed redesign
        </h2>
        <div className="theme-invariant-dark relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/15 lg:aspect-[16/9] lg:rounded-[30px]">
          <Image
            src={quantumLeap}
            alt="A customer reviewing PayPal Pay in 4 on a phone beside an ecommerce checkout on a laptop."
            fill
            priority
            sizes="(max-width: 1024px) 100vw, calc(100vw - 48px)"
            /* The tall mobile crop pushes right to keep the man, the phone and
               the laptop in frame; the 16:9 desktop crop needs no bias. */
            className="object-cover object-[72%_center] lg:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent lg:bg-gradient-to-r lg:from-black/85 lg:via-black/30 lg:to-transparent" />
          <p
            className={cx(
              CASE_STUDY_BODY_CLASS,
              "absolute bottom-0 left-0 right-0 p-6 text-white lg:right-auto lg:max-w-[560px] lg:p-12",
            )}
          >
            A credit card takes seconds. Applying for PayPal credit interrupted the purchase
            every time. The project began with one question: how much of that friction was
            actually necessary?
          </p>
        </div>
      </section>

      {/* The scope. The brief arrived as six redesigns; laying the products
          side by side is what turned it into one problem, so the section
          moves from the count, to the portfolio, to the pattern they share. */}
      <section
        aria-labelledby="paypal-scope-title"
        className={cx("px-5 lg:px-[24px]", SECTION_GAP)}
        style={{ fontFamily: leagueSpartan }}
      >
        <ScrollFade once>
          <p className={CASE_STUDY_LABEL_TIGHT_CLASS}>The Scope</p>
          <h2
            id="paypal-scope-title"
            className="mt-4 lg:mt-[18px] max-w-[1100px] text-balance font-serif text-[clamp(40px,7vw,72px)] font-normal leading-[1.05] tracking-[-0.015em]"
          >
            The assignment looked like six separate redesigns.
          </h2>
          <p className={cx(CASE_STUDY_BODY_CLASS, "mt-6 lg:mt-[32px] max-w-[860px] text-white/80")}>
            Six products had evolved across two markets, each with its own funnel, success
            metrics, and regulatory constraints. Side-by-side mapping exposed one shared
            problem: repeated checkout interruption.
          </p>
        </ScrollFade>

        {/* Scope facts. The rule sits above each figure rather than under it,
            so the strip reads as a spec sheet and not as an outcome panel. */}
        <ScrollFade once>
          <dl className="mt-[50px] grid grid-cols-2 gap-x-6 lg:grid-cols-3 lg:gap-x-[60px]">
            {SCOPE_FACTS.map((fact) => (
              <div
                key={fact.label}
                className="border-t border-white/15 pt-5 pb-8 lg:pt-[28px] lg:pb-0"
              >
                <dt className={cx(CASE_STUDY_SUPPORTING_CLASS, "text-white/60")}>
                  {fact.label}
                </dt>
                <dd className="mt-1.5 lg:mt-[9px] font-serif text-[clamp(40px,6vw,64px)] font-normal leading-none tracking-[-0.01em]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </ScrollFade>

        {/* The portfolio. The screens are portrait, so six across reads fine
            even in narrow columns; below that it folds to three, then two. */}
        <ScrollFade once direction="right">
          <ul className="mt-16 lg:mt-[96px] grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
            {CREDIT_PORTFOLIO.map((item) => (
              <li
                key={`${item.name}-${item.market}`}
                className="flex flex-col rounded-2xl border border-white/15 bg-white/[0.03] p-3"
              >
                <div className="relative aspect-[880/2212] w-full">
                  <Image
                    src={item.art}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 15vw"
                  />
                </div>
                <p className="mt-4 lg:mt-[20px] text-base lg:text-[20px] font-light leading-snug tracking-[-0.01em]">
                  {item.name}
                </p>
                {/* Pushed to the foot of the card so the market line stays on
                    one baseline when a longer product name wraps. */}
                <p className={cx(CASE_STUDY_SUPPORTING_CLASS, "mt-auto pt-2 text-white/60")}>
                  {item.market}
                </p>
              </li>
            ))}
          </ul>
        </ScrollFade>

        {/* The turn. Three beats, so each sentence is an inline-block and can
            never split across a line; the measure is in em so it tracks the
            clamped size, holding two beats on the first line on wide screens
            and folding to one beat per line on narrow ones. */}
        <ScrollFade once>
          <p className="mt-[50px] max-w-[16.5em] font-serif text-[clamp(28px,5vw,48px)] font-normal leading-[1.15] tracking-[-0.01em] text-white/90">
            <span className="inline-block">Different products.</span>{" "}
            <span className="inline-block">Different constraints.</span>{" "}
            <span className="inline-block">The same interruption.</span>
          </p>
        </ScrollFade>
      </section>

      {/* ── The Pay in 4 deep dive ──────────────────────────
          One product carrying the whole argument, held in a single frame the
          reader splits themselves. Left of the divider is the problem and
          the five screens that produced it; right of it are the three that
          replaced them and the sentence they earn. Both rows sit on the same
          five-column bed, so the three arrive in the seats the middle three
          were already in and the reader watches two of them leave rather
          than watching a new row appear. The frame plays the wipe through
          once on its own, the first time its top reaches the sticky bar, so
          the reader is shown the answer before being handed the control. */}
      <section
        aria-labelledby="paypal-payin4-title"
        className={cx("px-5 lg:px-[24px]", SECTION_GAP)}
        style={{ fontFamily: leagueSpartan }}
      >
        <ScrollFade once>
          <RevealSlider
            autoReveal
            label="Compare the Pay in 4 flow before and after the redesign"
            rows={[
              {
                /* Both states of the argument share one row, pinned to its
                   bottom edge, so their closing lines finish on the same line
                   and the after copy hangs off the screens it describes rather
                   than costing the page a block of height below them. */
                align: "end",
                before: (
                  <div className={PI4_ROW_PAD}>
                    <p className={CASE_STUDY_LABEL_TIGHT_CLASS}>Deep Dive</p>
                    <h2
                      id="paypal-payin4-title"
                      className="mt-4 max-w-[1100px] text-balance font-serif text-[clamp(40px,7vw,72px)] font-normal leading-[1.05] tracking-[-0.015em] lg:mt-[18px]"
                    >
                      Pay in 4 made the problem impossible to ignore.
                    </h2>
                    <p className={cx(CASE_STUDY_BODY_CLASS, "mt-4 max-w-[860px] text-white/80 lg:mt-[18px]")}>
                      Pay in 4 made the shared problem clearest: three application steps
                      separated product choice from purchase completion.
                    </p>
                  </div>
                ),
                after: (
                  /* The redesign needs no label once it has arrived. The copy
                     shares the three columns its screens occupy, so it reads as
                     their caption rather than as the next section, and it is set
                     right so both edges finish on the last screen's — the one
                     edge the eye is already resting against when the wipe ends. */
                  <div className={cx(PI4_ROW_PAD, PI4_ROW_GRID)}>
                    <div className="md:col-span-3 md:col-start-2 md:text-right">
                      <h3 className="text-balance font-serif text-[clamp(26px,3.6vw,40px)] font-normal leading-[1.1] tracking-[-0.01em]">
                        One page brought the decision back into focus.
                      </h3>
                      <p className={cx(CASE_STUDY_BODY_CLASS, "mt-5 text-white/70 lg:mt-[24px]")}>
                        The redesign consolidated the journey into a single review-and-apply page:
                        offer context, customer details, payment method, agreements, and the decision,
                        then back to checkout.
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                before: (
                  /* Ordered lists, because the screens are a sequence and not a
                     gallery. */
                  <ol className={cx(PI4_FILMSTRIP, PI4_ROW_PAD, PI4_ROW_GRID)}>
                    {LEGACY_STEPS.map(({ screen, src, alt, finish }) => (
                      <li key={screen} className={PI4_CELL}>
                        <DeviceShell src={src} alt={alt} finish={finish} screen={PI4_SCREEN} />
                      </li>
                    ))}
                  </ol>
                ),
                after: (
                  /* Columns two through four of the same five, so each of the
                     three lands exactly where a legacy screen stood and the two
                     outer seats are the ones that empty. */
                  <ol className={cx(PI4_FILMSTRIP, PI4_ROW_PAD, PI4_ROW_GRID)}>
                    {REDESIGN_STEPS.map(({ screen, src, alt, finish }, index) => (
                      <li key={screen} className={cx(PI4_CELL, index === 0 && "md:col-start-2")}>
                        <DeviceShell src={src} alt={alt} finish={finish} screen={PI4_SCREEN} />
                      </li>
                    ))}
                  </ol>
                ),
              },
            ]}
          />
        </ScrollFade>

        {/* The decisions beside the flow they produced: the three changes
            that made it possible read down the left, under the heading,
            while the redesigned run replays in a black cherry iPhone on
            the right. */}
        <ScrollFade once direction="right">
          <div className={SECTION_GAP}>
            {/* Set at the turn's size, so the section heading and the
                sentence that sets up the section carry the same weight. */}
            <h3 className="max-w-[16em] text-balance font-serif text-[clamp(28px,5vw,48px)] font-normal leading-[1.1] tracking-[-0.01em]">
              The three parts of the shared pattern
            </h3>
            {/* The copy runs down the left, under the heading it belongs
                to, and the animation's column closes the row. That column
                is sized for the device plus, to its right, the rail its
                callouts hang in; the device sits at the near side of it,
                so the gutter sets the air between the copy and the case
                and the notes run out into the rail, ending on the page's
                own padding. Below lg the animation leads, as it did
                before. */}
            <div
              className="mt-12 lg:mt-[72px] grid grid-cols-1 items-center gap-y-12 lg:grid-cols-[minmax(0,1fr)_calc(var(--pi4-phone)_+_var(--pi4-rail))] lg:gap-x-[var(--pi4-gutter)]"
              style={
                {
                  "--pi4-gutter": "clamp(64px, 9vw, 140px)",
                  "--pi4-phone": "clamp(260px, 24vw, 340px)",
                  /* 65.7% of the device: see the callout geometry in
                     components/ui/pi4-walkthrough.tsx. */
                  "--pi4-rail": "calc(var(--pi4-phone) * 0.657)",
                } as CSSProperties
              }
            >
              <Pi4Walkthrough className="mx-auto w-[72%] max-w-[300px] lg:order-last lg:ml-0 lg:mr-auto lg:self-center lg:w-[var(--pi4-phone)] lg:max-w-none" />
              {/* The column runs the full width of its cell; the measure is
                  held on the paragraphs instead, which are the only lines
                  long enough to need it. */}
              <div>
                {/* The figure the three changes produced, read before the
                    changes themselves. It carries the column, so the list
                    opens under a result rather than arriving at one. */}
                <div className="mb-8 flex flex-col gap-[17px] text-white lg:mb-[46px]">
                  <p className="metric-figure font-serif text-[clamp(44px,12vw,72px)] lg:text-[72px] font-normal leading-none">2.08&times;</p>
                  <p className={cx(CASE_STUDY_SUPPORTING_CLASS, "metric-label text-white/60")}>
                    Application completion
                  </p>
                </div>
                <ol className="grid list-none grid-cols-1 gap-y-7 lg:gap-y-[39px]">
                  {DESIGN_DECISIONS.map(({ number, title, body }) => (
                    <li key={number}>
                      <h4 className="font-serif text-[clamp(24px,2.6vw,32px)] font-normal leading-[1.15] tracking-[-0.01em] text-white">
                        <span className="whitespace-nowrap text-white/40">{number}&nbsp;&mdash;&nbsp;</span>
                        {title}
                      </h4>
                      <p className={cx(CASE_STUDY_BODY_CLASS, "mt-3 max-w-[46ch] text-white/70 lg:mt-[18px]")}>
                        {body}
                      </p>
                    </li>
                  ))}
                </ol>
                {/* The prototype is the last of the three changes made
                    touchable: it sits under Unify because that is the decision
                    it demonstrates. Linked at the project's own domain, not a
                    per-deployment URL: those sit behind Vercel's login and go
                    stale the moment the prototype is pushed again. */}
                <a
                  href="https://pay-in4-prototype.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-10 inline-flex items-center rounded-full border border-[#919191] px-6 lg:mt-[56px] lg:px-[30px] ${CTA_PILL_SIZE.lg} font-normal leading-none whitespace-nowrap text-white transition-colors duration-150 hover:border-white`}
                  style={{ fontFamily: "var(--font-league-spartan)" }}
                >
                  Prototype
                </a>
              </div>
            </div>
          </div>
        </ScrollFade>
      </section>

      {/* Into the run of five. The pattern was proven on one product, so this
          reads as a turn rather than as an eyebrow on the first section: the
          same two-beat serif statement the scope section closes on, sized to
          hold one sentence per line. */}
      <ScrollFade once>
        <div
          className={cx(SECTION_GAP, "px-5 lg:px-[24px]")}
          style={{ fontFamily: leagueSpartan }}
        >
          <p className="max-w-[16.5em] font-serif text-[clamp(28px,5vw,48px)] font-normal leading-[1.15] tracking-[-0.01em] text-white/90">
            <span className="inline-block">One product proved the pattern.</span>{" "}
            <span className="inline-block">Six products demonstrated its value.</span>
          </p>
        </div>
      </ScrollFade>

      {/* Pay Monthly */}
      <section className="relative w-full overflow-hidden bg-black">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-[51px] px-5 lg:px-[24px] py-12 lg:py-[75px]">
          <ScrollFade
            direction="left"
            className="flex w-full lg:w-[688px] lg:shrink-0 flex-col items-start gap-10 lg:gap-[92px]"
            style={{ fontFamily: leagueSpartan }}
          >
            <h2 className="font-serif text-[clamp(40px,10vw,64px)] lg:text-[64px] leading-none text-white">
              Pay Monthly
            </h2>
            <div className="flex w-full flex-col gap-8 lg:gap-[46px]">
              <div className="flex w-full lg:w-[200px] flex-col gap-[17px] text-white">
                <p className="metric-figure font-serif text-[clamp(44px,12vw,72px)] lg:text-[72px] font-normal leading-none">2.3%</p>
                <p className="metric-label text-sm lg:text-[18px] font-light leading-none text-white/60">
                  Increase in conversion
                </p>
              </div>
              <div className="h-px w-full bg-white/25" />
              <div className="flex w-full lg:w-[408px] flex-col gap-[17px] text-white">
                <p className="metric-figure font-serif text-[clamp(44px,12vw,72px)] lg:text-[72px] font-normal leading-none">{PRODUCT_IREV.payMonthly.toFixed(2)}%</p>
                <p className="metric-label text-sm lg:text-[18px] font-light leading-none text-white/60">
                  Increase in annual iRev
                </p>
              </div>
              <div className="h-px w-full bg-white/25" />
            </div>
          </ScrollFade>
          <ScrollFade direction="right" className="w-full lg:w-auto lg:shrink-0">
            <Image
              src={payMonthlyScreens}
              alt="Pay Monthly application screens"
              width={1333}
              height={852}
              sizes="(max-width: 1024px) 100vw, 1333px"
              className="block w-full h-auto screen-hairline lg:w-[1333px]"
            />
          </ScrollFade>
        </div>
      </section>

      {/* PayPal Credit US */}
      <section className="relative w-full overflow-hidden bg-black">
        <div className="flex flex-col-reverse lg:flex-row items-start lg:items-center lg:justify-end gap-10 lg:gap-[51px] px-5 lg:px-[24px] py-12 lg:py-[75px]">
          <ScrollFade direction="left" className="w-full lg:w-auto lg:shrink-0">
            <Image
              src={payPalCreditScreens}
              alt="PayPal Credit application screens"
              width={1333}
              height={932}
              sizes="(max-width: 1024px) 100vw, 1333px"
              className="block w-full h-auto screen-hairline lg:w-[1333px]"
            />
          </ScrollFade>
          <ScrollFade
            direction="right"
            className="flex w-full lg:w-[688px] lg:shrink-0 flex-col items-start gap-10 lg:gap-[92px]"
            style={{ fontFamily: leagueSpartan }}
          >
            <h2 className="font-serif text-[clamp(40px,10vw,64px)] lg:text-[64px] leading-none text-white">
              PayPal Credit US
            </h2>
            <div className="flex w-full flex-col gap-8 lg:gap-[46px]">
              <div className="flex w-full lg:w-[200px] flex-col gap-[17px] text-white">
                <p className="metric-figure font-serif text-[clamp(44px,12vw,72px)] lg:text-[72px] font-normal leading-none">6.3%</p>
                <p className="metric-label text-sm lg:text-[18px] font-light leading-none text-white/60">
                  Increase in conversion
                </p>
              </div>
              <div className="h-px w-full bg-white/25" />
              <div className="flex w-full lg:w-[408px] flex-col gap-[17px] text-white">
                <p className="metric-figure font-serif text-[clamp(44px,12vw,72px)] lg:text-[72px] font-normal leading-none">{PRODUCT_IREV.payPalCreditUS.toFixed(2)}%</p>
                <p className="metric-label text-sm lg:text-[18px] font-light leading-none text-white/60">
                  Increase in annual iRev
                </p>
              </div>
              <div className="h-px w-full bg-white/25" />
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* PayPal Mastercard */}
      <section className="relative w-full overflow-hidden bg-black">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-[51px] px-5 lg:px-[24px] py-12 lg:py-[75px]">
          <ScrollFade
            direction="left"
            className="flex w-full lg:w-[688px] lg:shrink-0 flex-col items-start gap-10 lg:gap-[92px]"
            style={{ fontFamily: leagueSpartan }}
          >
            <h2 className="font-serif text-[clamp(40px,10vw,64px)] lg:text-[64px] leading-none text-white">
              PayPal Mastercard
            </h2>
            <div className="flex w-full flex-col gap-8 lg:gap-[46px]">
              <div className="flex w-full lg:w-[200px] flex-col gap-[17px] text-white">
                <p className="metric-figure font-serif text-[clamp(44px,12vw,72px)] lg:text-[72px] font-normal leading-none">3.1%</p>
                <p className="metric-label text-sm lg:text-[18px] font-light leading-none text-white/60">
                  Increase in conversion
                </p>
              </div>
              <div className="h-px w-full bg-white/25" />
              <div className="flex w-full lg:w-[408px] flex-col gap-[17px] text-white">
                <p className="metric-figure font-serif text-[clamp(44px,12vw,72px)] lg:text-[72px] font-normal leading-none">{PRODUCT_IREV.payPalMastercard.toFixed(2)}%</p>
                <p className="metric-label text-sm lg:text-[18px] font-light leading-none text-white/60">
                  Increase in annual iRev
                </p>
              </div>
              <div className="h-px w-full bg-white/25" />
            </div>
          </ScrollFade>
          <ScrollFade direction="right" className="w-full lg:w-auto lg:shrink-0">
            <Image
              src={payPalMastercardScreens}
              alt="PayPal Mastercard application screens"
              width={1333}
              height={852}
              sizes="(max-width: 1024px) 100vw, 1333px"
              className="block w-full h-auto screen-hairline lg:w-[1333px]"
            />
          </ScrollFade>
        </div>
      </section>

      {/* PayPal Credit UK */}
      <section className="relative w-full overflow-hidden bg-black">
        <div className="flex flex-col-reverse lg:flex-row items-start lg:items-center lg:justify-end gap-10 lg:gap-[51px] px-5 lg:px-[24px] py-12 lg:py-[75px]">
          <ScrollFade direction="left" className="w-full lg:w-auto lg:shrink-0">
            <Image
              src={payPalCreditUKScreens}
              alt="PayPal Credit UK application screens"
              width={1333}
              height={852}
              sizes="(max-width: 1024px) 100vw, 1333px"
              className="block w-full h-auto screen-hairline lg:w-[1333px]"
            />
          </ScrollFade>
          <ScrollFade
            direction="right"
            className="flex w-full lg:w-[688px] lg:shrink-0 flex-col items-start gap-10 lg:gap-[92px]"
            style={{ fontFamily: leagueSpartan }}
          >
            <h2 className="font-serif text-[clamp(40px,10vw,64px)] lg:text-[64px] leading-none text-white">
              PayPal Credit UK
            </h2>
            <div className="flex w-full flex-col gap-8 lg:gap-[46px]">
              <div className="flex w-full lg:w-[200px] flex-col gap-[17px] text-white">
                <p className="metric-figure font-serif text-[clamp(44px,12vw,72px)] lg:text-[72px] font-normal leading-none">5.3%</p>
                <p className="metric-label text-sm lg:text-[18px] font-light leading-none text-white/60">
                  Increase in conversion
                </p>
              </div>
              <div className="h-px w-full bg-white/25" />
              <div className="flex w-full lg:w-[408px] flex-col gap-[17px] text-white">
                <p className="metric-figure font-serif text-[clamp(44px,12vw,72px)] lg:text-[72px] font-normal leading-none">{PRODUCT_IREV.payPalCreditUK.toFixed(2)}%</p>
                <p className="metric-label text-sm lg:text-[18px] font-light leading-none text-white/60">
                  Increase in annual iRev
                </p>
              </div>
              <div className="h-px w-full bg-white/25" />
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Pay in 3 UK */}
      <section className="relative w-full overflow-hidden bg-black">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-[51px] px-5 lg:px-[24px] py-12 lg:py-[75px]">
          <ScrollFade
            direction="left"
            className="flex w-full lg:w-[688px] lg:shrink-0 flex-col items-start gap-10 lg:gap-[92px]"
            style={{ fontFamily: leagueSpartan }}
          >
            <h2 className="font-serif text-[clamp(40px,10vw,64px)] lg:text-[64px] leading-none text-white">
              Pay in 3 UK
            </h2>
            <div className="flex w-full flex-col gap-8 lg:gap-[46px]">
              <div className="flex w-full lg:w-[200px] flex-col gap-[17px] text-white">
                <p className="metric-figure font-serif text-[clamp(44px,12vw,72px)] lg:text-[72px] font-normal leading-none">78%</p>
                <p className="metric-label text-sm lg:text-[18px] font-light leading-none text-white/60">
                  Increase in conversion
                </p>
              </div>
              <div className="h-px w-full bg-white/25" />
              <div className="flex w-full lg:w-[408px] flex-col gap-[17px] text-white">
                <p className="metric-figure font-serif text-[clamp(44px,12vw,72px)] lg:text-[72px] font-normal leading-none">37%</p>
                <p className="metric-label text-sm lg:text-[18px] font-light leading-none text-white/60">
                  Increase in average monthly TPV
                </p>
              </div>
              <div className="h-px w-full bg-white/25" />
            </div>
          </ScrollFade>
          <ScrollFade direction="right" className="w-full lg:w-auto lg:shrink-0">
            <Image
              src={payIn3UKScreens}
              alt="Pay in 3 UK application screens"
              width={842}
              height={852}
              sizes="(max-width: 1024px) 100vw, 842px"
              className="block w-full h-auto screen-hairline lg:w-[842px]"
            />
          </ScrollFade>
        </div>
      </section>

      {/* Overall Impact. The bottom padding is the 200px from the last bar
          to Behind the Work, so the chart closes on the same distance that
          opens it. */}
      <section
        className="bg-black max-w-[1600px] w-full mx-auto px-5 lg:px-[37px] pt-20 lg:pt-[120px] pb-[200px]"
        style={{ fontFamily: leagueSpartan }}
      >
        <div className="flex flex-col gap-12 lg:gap-[73px]">
          {/* US Credit */}
          <div className="flex flex-col gap-8 lg:gap-[42px]">
            <h2 className="font-serif text-[clamp(40px,10vw,64px)] lg:text-[64px] leading-none text-white">
              US Credit
            </h2>
            <div className={IMPACT_GRID}>
              {US_CREDIT_IMPACT.map((metric) => (
                <ImpactCard
                  key={metric.product}
                  art={<Image src={metric.art} alt={metric.product} width={96} height={96} />}
                  product={metric.product}
                  amount={metric.amount}
                  prefix=""
                  suffix="%"
                  decimals={metric.decimals}
                  label={metric.label}
                />
              ))}
            </div>
          </div>

          {/* UK Credit */}
          <div className="flex flex-col gap-8 lg:gap-[42px]">
            <h2 className="font-serif text-[clamp(40px,10vw,64px)] lg:text-[64px] leading-none text-white">
              UK Credit
            </h2>
            <div className={IMPACT_GRID}>
              {UK_CREDIT_IMPACT.map((metric) => (
                <ImpactCard
                  key={metric.product}
                  art={<Image src={metric.art} alt={metric.product} width={96} height={96} />}
                  product={metric.product}
                  amount={metric.amount}
                  prefix=""
                  suffix="%"
                  decimals={metric.decimals}
                  label={metric.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* What the two kinds of figure above actually measure, stated once
            under them, so a reader does not read a volume as revenue or add
            the cards together. It sets against the left edge under the cards
            it qualifies, on the same measure as the headings above it. */}
        <p
          className={cx(
            CASE_STUDY_SUPPORTING_CLASS,
            "mt-14 max-w-[900px] text-white/60 lg:mt-[64px]",
          )}
        >
          Every product figure is a change against that product&rsquo;s preceding annual
          baseline — independent results, not shares of a portfolio total. iRev is annual
          incremental revenue; TPV is payment volume. The portfolio rows below measure the
          2023 baseline against H1 2024.
        </p>

        {/* The rule now closes the cards and their note rather than halving a
            gap, so it takes a plain margin: the note's last line is text, with
            none of the 96px numeral's overhang the old optical lift corrected
            for. The 120px below is untouched, so the rule sits nearer what it
            ends than what it introduces. */}
        <div className="mt-[64px] h-px w-full bg-white/25" />

        {/* The portfolio behind the cards. The cards report what each product
            returned; these two bars report what the whole credit portfolio
            did over the same window, so the section closes on the movement
            the six products add up to. Outside the card stack's flex, so the
            margin is the whole distance from the rule to the top of the first
            bar, with the scale line and the 12px under it living inside that
            distance rather than adding to it. The 120px (121px at lg) is what
            the 200px has left after the rule's own margin and its pixel. */}
        <div className="mt-[calc(120px_-_var(--impact-scale))] lg:mt-[calc(121px_-_var(--impact-scale))] [--impact-scale:36px] lg:[--impact-scale:45.6px]">
          {/* The scale sits over the bars, not over the label column, so the
              first cell is left empty and the dates land on the ends of the
              track they measure. Its height is what --impact-scale accounts
              for: the dates' line box plus the margin below it. */}
          <div className="mb-[12px] grid grid-cols-[110px_1fr] items-baseline gap-x-4 lg:grid-cols-[280px_1fr] lg:gap-x-12">
            <div className="col-start-2 flex justify-between text-white/60">
              <p className="text-base lg:text-[24px] font-light leading-[1.5] lg:leading-[1.4]">2023</p>
              <p className="text-base lg:text-[24px] font-light leading-[1.5] lg:leading-[1.4]">H1 2024</p>
            </div>
          </div>
          <div className="space-y-10 lg:space-y-14">
            <AnimatedImpactRow
              label={"Credit portfolio\nutilization"}
              todayPct={38}
              futurePct={47}
              todayLabel="38%"
              futureLabel="47%"
            />
            <AnimatedImpactRow
              label={"Credit portfolio\nconversion"}
              todayPct={51}
              futurePct={79}
              todayLabel="51%"
              futureLabel="79%"
              sublabel="51% to 79%, an increase of 28 percentage points"
            />
          </div>
        </div>
      </section>

      {/* Behind the work. The process material that supports the story
          without belonging in it, kept closed so the narrative stays the
          narrative. Native <details>, so it is focusable, operable with Enter
          and Space, and announced with its expanded state. */}
      <div className="px-5 lg:px-[24px]">
        <SupportingAppendix
          id="behind-the-work"
          title="Behind the Work"
          summary="How the work ran: one shared pattern, recurring cross-functional review, six-product delivery"
        >
          <p className="text-white/70">
            One shared application pattern governed the work. It fixed the core flow, named
            the variants each product was allowed, and carried the US and UK legal
            exceptions. Recurring product, legal, design, and leadership reviews held all six
            teams to it, from requirements through development and measurement.
          </p>
          <ProcessDiagram steps={PROCESS_STEPS} accent="#4d2d8d" className="mt-4 lg:mt-[26px]" />
          <div className={cx(CASE_STUDY_STACK_CLASS, "mt-12 lg:mt-[76px]")}>
            <p className={CASE_STUDY_LABEL_TIGHT_CLASS}>
              Design System Gap &rarr; Build Plan
            </p>
            <p className="text-white/70">
              Synthesized six product teams&rsquo; funnels, success metrics, and US&ndash;UK
              regulatory constraints into one model in ChatGPT. It carried 40+ iterations
              through stakeholder review.
            </p>
            {/* The 40+ iterations the paragraph claims, shown rather than
                counted. On top of the stack's own 14px gap these margins set
                the strip 50px below the copy on desktop and 32px on small
                screens. The artwork runs edge to edge with 444px between its
                groups on a 3632px height, so the loop carries that same gap
                past the join. */}
            <ImageMarquee
              src={iterations}
              alt="A running strip of Pay in 4 application wireframes from iteration 3 through iteration 36, each pass tightening the plan, review, and confirmation screens."
              gapAspect="444 / 3632"
              className="mt-[18px] lg:mt-[36px]"
            />
          </div>
        </SupportingAppendix>
      </div>

      {/* Next Case Studies */}
      <section id="next-case-study-section" className="relative w-full overflow-hidden bg-black pb-24 lg:pb-[200px] pt-12 lg:pt-[78px]">
        <NextCaseStudyTicker color="#4d2d8d" />

        {/* The pair is wider than most desktops once the 200px between
            them is counted, and centring an overflowing row hides its left
            edge. The gutter is held, and the space between the cards is
            what gives way first. */}
        <div className="relative flex flex-col lg:flex-row items-center lg:justify-center gap-12 px-5 lg:gap-[clamp(48px,calc(100vw-1156px),200px)] lg:px-[24px]">
          {/* Meta */}
          <Link href={nextMeta.route} className="group flex w-full min-w-0 max-w-[671px] flex-col gap-4 lg:w-[671px] lg:gap-[27px]">
            <div className="relative aspect-[824/606] w-full overflow-hidden rounded-2xl lg:rounded-[30px]">
              <Image
                src={nextMetaPreview.image}
                alt={nextMetaPreview.alt}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 671px"
              />
            </div>
            <p className="font-serif text-[clamp(36px,9vw,64px)] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.64px] text-white transition-opacity duration-300 group-hover:opacity-70">
              {nextMeta.cardLabel}
            </p>
          </Link>

          {/* Solo */}
          <Link href={nextSolo.route} className="group flex w-full min-w-0 max-w-[437px] flex-col gap-4 lg:w-[437px] lg:shrink-0 lg:gap-[27px]">
            <div className="relative aspect-[437/666] w-full overflow-hidden rounded-2xl lg:rounded-[30px]">
              <Image
                src={nextSoloPreview.image}
                alt={nextSoloPreview.alt}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 437px"
              />
            </div>
            <p className="font-serif text-[clamp(36px,9vw,60px)] lg:text-[60px] leading-[1.1] lg:leading-[72px] tracking-[-0.64px] text-white transition-opacity duration-300 group-hover:opacity-70 whitespace-nowrap">
              {nextSolo.cardLabel}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
