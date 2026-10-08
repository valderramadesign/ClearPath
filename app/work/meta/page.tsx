import type { ComponentType } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import CaseStudyTopBar from "@/components/ui/case-study-top-bar";
import NextCaseStudyTicker from "@/components/ui/next-case-study-ticker";
import RevealSlider from "@/components/ui/reveal-slider";
import LegacyScreenGrid, { type LegacyScreen } from "./legacy-screen-grid";
import WorkflowDiagram from "./workflow-diagram";
import ScrollFade from "@/components/ui/scroll-fade";
import MiMacbookWalkthrough from "@/components/ui/mi-macbook-walkthrough";
import { AnimatedImpactRow } from "@/components/ui/animated-impact-row";
import { CTA_PILL_SIZE } from "@/components/ui/cta-pill";
import {
  CaseStudyHeader,
  ProjectFacts,
  ProcessDiagram,
  type ProcessDiagramProps,
  SupportingAppendix,
  CASE_STUDY_BODY_CLASS,
  CASE_STUDY_FOCUS_CLASS,
  CASE_STUDY_LABEL_TIGHT_CLASS,
  CASE_STUDY_SUPPORTING_CLASS,
  cx,
} from "@/components/case-study";
import {
  IconAlreadyVerified,
  IconBuriedOffer,
  IconCardPaused,
  IconConsentInline,
  IconFailedCheck,
  IconInspectAndCorrect,
  IconMismatchedField,
  IconNineScreens,
  IconOfferUpstream,
  IconPendingReview,
  IconStaleRecord,
  IconThreePages,
} from "./opportunity-icons";
import verificationEngine from "@/components/images/Monthly invoicing Images/Opportunity/verification-engine.png";
import oldScreen from "@/components/images/Monthly invoicing Images/MI_Old_Flow_Screens/Screen.png";
import oldScreen1 from "@/components/images/Monthly invoicing Images/MI_Old_Flow_Screens/Screen1.png";
import oldScreen2 from "@/components/images/Monthly invoicing Images/MI_Old_Flow_Screens/Screen2.png";
import oldScreen3 from "@/components/images/Monthly invoicing Images/MI_Old_Flow_Screens/Screen3.png";
import oldScreen4 from "@/components/images/Monthly invoicing Images/MI_Old_Flow_Screens/Screen4.png";
import oldScreen5 from "@/components/images/Monthly invoicing Images/MI_Old_Flow_Screens/Screen5.png";
import oldScreen6 from "@/components/images/Monthly invoicing Images/MI_Old_Flow_Screens/Screen6.png";
import oldScreen7 from "@/components/images/Monthly invoicing Images/MI_Old_Flow_Screens/Screen7.png";
import oldScreen8 from "@/components/images/Monthly invoicing Images/MI_Old_Flow_Screens/Screen8.png";
import newFlowHowItWorks from "@/components/images/Monthly invoicing Images/Mi_New_Flow_Screens/new-flow-1-how-it-works.png";
import newFlowConfirm from "@/components/images/Monthly invoicing Images/Mi_New_Flow_Screens/new-flow-2-confirm-information.png";
import newFlowApproved from "@/components/images/Monthly invoicing Images/Mi_New_Flow_Screens/new-flow-3-approved.png";
import metaHero from "@/components/images/Monthly invoicing Images/Hero/meta-hero.webp";
import { PROJECTS_BY_ID, imageSrc, previewOf } from "@/lib/content";
import { caseStudyMetadata } from "@/lib/seo";

const project = PROJECTS_BY_ID.meta;
const nextPayPal = PROJECTS_BY_ID.paypal;
const nextPayPalPreview = previewOf(nextPayPal);
const nextSolo = PROJECTS_BY_ID.solo;
const nextSoloPreview = previewOf(nextSolo);

export const metadata = caseStudyMetadata(
  project,
  "Moving the Monthly Invoicing offer upstream and rebuilding its application from 9 screens to 3, lifting conversion from a 39% baseline to 97% and saving ~7.5% a year in card-processing costs.",
);

const leagueSpartan = "var(--font-league-spartan)";

/* One value for the air between the page's major beats, matched to the
   PayPal case study so the two read as the same publication. */
const SECTION_GAP = "mt-24 md:mt-[140px] lg:mt-[200px]";
/* What a section needs when the one beside it is the banded aside: the band's
   own edge already marks the break, so the open air either side of it is half
   what two unbanded sections take. */
const BAND_GAP = "mt-[100px]";
const PAGE_PAD = "px-5 lg:px-[24px]";

/* Section headings run longer here than PayPal's, so the ceiling steps down
   from 72px — the line still opens the section without swallowing it. */
const SECTION_TITLE_CLASS =
  "mt-4 max-w-[1100px] text-balance font-serif text-[clamp(32px,5.6vw,64px)] font-normal leading-[1.06] tracking-[-0.015em] lg:mt-[18px]";

/* SECTION_TITLE_CLASS without the balancer, and with the width its two long
   terms need to share a line. The equation's break is part of the argument
   rather than a rag decision, so it is placed by hand in the markup; a
   balancer here would keep pulling it somewhere else. */
const EQUATION_TITLE_CLASS =
  "mt-4 max-w-[1200px] font-serif text-[clamp(32px,5.6vw,64px)] font-normal leading-[1.06] tracking-[-0.015em] lg:mt-[18px]";

/* Panel rows sit in a third-width column beside a 52px icon, so they step
   down from the page's body size to hold two lines instead of four. */
const PANEL_ROW_CLASS = "text-base lg:text-[20px] font-light leading-[1.35]";

/* The three columns sit directly on the page now: no cards, no rules. All
   that holds the row together is the shared top alignment and the type. */
const PANEL_CLASS = "flex flex-col";

/* All three columns state the same anatomy, so their rows have to start on
   the same line: the title reserves two lines whether or not it needs them. */
const PANEL_TITLE_CLASS =
  "mt-3 text-balance font-serif text-[clamp(24px,3.2vw,34px)] font-normal leading-[1.12] tracking-[-0.01em] lg:mt-[14px] lg:min-h-[2.24em]";

/* The strategy column is the only lit thing in the row, so its label takes
   the accent too. Written out rather than layered over the shared label
   class: the colour then never depends on which utility the sheet emits
   last. The scale is CASE_STUDY_LABEL_TIGHT_CLASS's, unchanged. */
const STRATEGY_LABEL_CLASS = "text-sm lg:text-[18px] font-light leading-none text-[#CEF252]";

/* One offset for everything that hangs below a panel title, so the icon
   rows and the illustration start on the same line across all three
   columns. */
const PANEL_BODY_TOP = "mt-7 lg:mt-[36px]";

/* On desktop each set of three rows is one block standing against the
   illustration: it starts on the same line and, by taking the column's
   remaining height and spacing itself across it, ends on the same line
   too — so the two share a centre as well as a top edge. The gap stays the
   floor, which is what a column too tall to distribute falls back to. */
const ROW_LIST_CLASS = cx(
  PANEL_BODY_TOP,
  "flex flex-col gap-6 lg:flex-1 lg:justify-between lg:gap-[30px]",
);
const ROW_ITEM_CLASS = "flex items-center gap-4 lg:gap-6";
const ROW_ICON_CLASS = "h-11 w-11 shrink-0 text-white lg:h-[52px] lg:w-[52px]";

/* The row gap is the generous one — every cell now carries a label under it,
   and the numbers want air between one row's caption and the next row's
   screen. */
const SLIDER_ROW_GRID =
  "md:grid md:grid-cols-3 md:gap-x-3 md:gap-y-9 lg:gap-x-4 lg:gap-y-[44px]";
/* The divider comes to rest on the wrapper's own edges, which — the rows
   standing on the page's full measure — is exactly where the outer screens
   end. This holds every row back off both ends of the wipe, so there is
   always black between the bar and the nearest screen. Scoped to lg and up,
   the only width where a divider exists at all. */
const SLIDER_ROW_PAD = "lg:px-5";
/* Each state is one column now — its label, then its screens — so the step
   from the heading to the first screen is a margin here rather than the gap
   the slider puts between rows. Same figure either side of the divider. */
const SLIDER_SCREENS_TOP = "mt-10 lg:mt-[56px]";
/* Below md the screens are landscape captures too wide to tile, so they
   become a swipeable strip that bleeds into the page gutter. */
const SLIDER_FILMSTRIP =
  "-mx-5 flex list-none snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden";
const SLIDER_CELL = "w-[90%] max-w-[440px] shrink-0 snap-start md:w-auto md:max-w-none";
const SCREEN_FRAME =
  "overflow-hidden rounded-[10px] border border-white/12 bg-white/[0.04] lg:rounded-[14px]";
/* Both rows number their screens the same way, so the count either side of
   the divider can be read off the captions alone. */
const SCREEN_CAPTION = cx(CASE_STUDY_SUPPORTING_CLASS, "mt-3 text-white/60 lg:mt-[16px]");

/* The figures the record already carries. Each note says what its number is
   measured against, so the row reads without a second glance at the chart. */
const HERO_FACTS: { label: string; value: string; note: string }[] = [
  { label: "Application", value: "9 → 3", note: "Screens delivered" },
  { label: "Conversion", value: "97%", note: "From a 39% baseline" },
  { label: "Savings", value: "~7.5%", note: "Annually" },
];

/* Above the laptop the photograph is only window light and shelving —
   nothing the argument needs. A radial settled into that corner and a
   shallow wash along the top edge take it to near-black so the figures can
   sit on it, and both have faded out before they reach the screen. */
const HERO_FEATHER =
  "radial-gradient(115% 42% at 100% 0%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 88%)," +
  " linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.62) 16%, rgba(0,0,0,0.22) 27%, rgba(0,0,0,0) 36%)";

type PanelRow = { Icon: ComponentType<{ className?: string }>; text: string };

const PROBLEM_ROWS: PanelRow[] = [
  { Icon: IconBuriedOffer, text: "Invitation hidden in a low-traffic area" },
  { Icon: IconNineScreens, text: "Nine screens repeated known information" },
  { Icon: IconCardPaused, text: "Card limits and failures could pause campaigns" },
];

const OPPORTUNITY_ROWS: PanelRow[] = [
  { Icon: IconOfferUpstream, text: "Present the offer where advertisers already work" },
  { Icon: IconAlreadyVerified, text: "Pre-approve with existing verification records" },
  { Icon: IconThreePages, text: "Let customers confirm or correct verified information in three screens" },
];

/* Two workstreams, one strategy — the shape of each decision in a
   sentence, not a diary of the weeks. They live in the appendix at the
   foot of the page: the method, one click off the argument. */
const WORKSTREAMS: { title: string; body: string }[] = [
  {
    title: "Increase Awareness",
    body: "Mapped high-traffic business surfaces and the teams that owned them, built partnerships for upstream banner placement, and moved the invitation into moments qualified advertisers already frequented.",
  },
  {
    title: "Increase Completion",
    body: "Audited verified customer data and requirements with Product, Data Science, Legal, Finance, and Engineering, then reframed the flow around preapproval, prefill, and quick correction.",
  },
];

/* The workflow as engineering received it: the qualifying checks that run
   upstream, and the path the advertiser actually walks once they pass.

   It is a wide drawing of small type. Squeezed into a phone's measure the
   labels stop being readable, so below the breakpoint it holds its width and
   scrolls sideways — the same move the nine screens make further up the page.
   Tabbable, because a scroll container Chrome will not focus is a scroll
   container a keyboard cannot reach. */
const DIAGRAM_FRAME = cx(
  "-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  "lg:mx-0 lg:overflow-visible lg:px-0",
  CASE_STUDY_FOCUS_CLASS,
);
const DIAGRAM_IMAGE = "h-auto w-[1040px] max-w-none lg:w-full";
const DIAGRAM_ALT =
  "Workflow diagram in two rows. The top row of checks runs from MI eligible, to Business verified, to Match LE with BV information, to Run Moody's API check on LE. Its result connects down to the row below, which runs from Pre-approved entry point, to How it works, to Display LE information plus terms and conditions, to Success, to Redirect to Accounts page.";

/* Reuse is only honest if the record is allowed to be wrong. The three
   delivered screens carry the approved path; these six are what the design
   calls for around it, each stated as the one thing the screen has to do. The
   paragraph above them carries the hedge — proposed handling, never observed
   policy — so the lines themselves can stay short. */
const RECOVERY_PATHS: {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}[] = [
  {
    Icon: IconStaleRecord,
    title: "Stale records",
    body: "Reconfirm verification data that has passed its freshness window.",
  },
  {
    Icon: IconMismatchedField,
    title: "Mismatched information",
    body: "Identify conflicting information and let the advertiser correct it in place.",
  },
  {
    Icon: IconPendingReview,
    title: "Manual review",
    body: "Show what’s under review, the expected timing, and a clear pending status.",
  },
  {
    Icon: IconFailedCheck,
    title: "Failed verification",
    body: "Keep the current payment method active and explain how to become eligible.",
  },
  {
    Icon: IconInspectAndCorrect,
    title: "Inspection and correction",
    body: "Display reused information in full and make it easy to edit before submitting.",
  },
  {
    Icon: IconConsentInline,
    title: "Freshness, consent, and trust",
    body: "Explain the credit line, terms, consent, and data freshness at the point of action.",
  },
];

/* The PayPal page's numbered decisions, with the drawing standing where the
   numeral stands: one serif line led by a mark, and the sentence starting back
   at the left edge rather than indented under the title. Stepped down from
   that page's scale so the six sit under the section heading above them, and
   the icon is sized to the heading's line box — the negative top margin
   centres it on the first line however the title wraps. */
const RECOVERY_TITLE_CLASS = cx(
  "flex items-start gap-3.5 font-serif text-[clamp(20px,2.2vw,28px)] lg:gap-[18px]",
  "font-normal leading-[1.15] tracking-[-0.01em] text-white",
);
const RECOVERY_ICON_CLASS =
  "-mt-[6px] h-9 w-9 shrink-0 text-white lg:h-[44px] lg:w-[44px]";

/* Two workstreams reading as two columns, split by a hairline. Above md there
   is no gutter to hang a rule in, so the divider lies down and becomes the
   rule between two stacked blocks. */
const WORKSTREAM_GRID = "grid md:grid-cols-2";
const WORKSTREAM_COLUMN = "md:pr-8 lg:pr-10";
const WORKSTREAM_COLUMN_DIVIDED =
  "mt-8 border-t border-white/15 pt-8 md:mt-0 md:border-l md:border-t-0 md:pl-8 md:pt-0 lg:pl-10";

const LEGACY_SCREENS: LegacyScreen[] = [
  {
    src: oldScreen,
    title: "Banner",
    alt: "Step 1: the Billing and payments Accounts page, with the monthly invoicing banner sitting above the accounts table.",
  },
  {
    src: oldScreen1,
    title: "How it works",
    alt: "Step 2: an overview dialog listing the tax ID, business document, and payment terms the application will require.",
  },
  {
    src: oldScreen2,
    title: "Legal identity",
    alt: "Step 3: choosing the legal entity the invoice will be issued to, from a dropdown of registered organizations.",
  },
  {
    src: oldScreen3,
    title: "Business information",
    alt: "Step 4: a business information form asking for country, email, and phone number.",
  },
  {
    src: oldScreen4,
    title: "Legal address",
    alt: "Step 5: a legal address form asking for the registered business name, EIN, street address, city, state, and ZIP code.",
  },
  {
    src: oldScreen5,
    title: "Billing address",
    alt: "Step 6: a billing address form repeating the same address fields behind a same as legal address checkbox.",
  },
  {
    src: oldScreen6,
    title: "Add accounts for Monthly Invoicing",
    alt: "Step 7: selecting which ad accounts the credit line should cover, from a searchable checklist.",
  },
  {
    src: oldScreen7,
    title: "Upload documents",
    alt: "Step 8: uploading a legal document as a PDF and accepting the invoicing terms and conditions.",
  },
  {
    src: oldScreen8,
    title: "Application pending approval",
    alt: "Step 9: an application pending approval notice asking the advertiser to wait two to three business days for a decision.",
  },
];

const REDESIGN_SCREENS: { src: StaticImageData; title: string; alt: string }[] = [
  {
    src: newFlowHowItWorks,
    title: "How it works",
    alt: "Page 1: a request monthly invoicing dialog explaining that the advertiser confirms their business information, receives a credit line, and is billed once a month.",
  },
  {
    src: newFlowConfirm,
    title: "Confirm information",
    alt: "Page 2: legal and billing information already filled in from Meta's records, with a single edit control beside the submit button.",
  },
  {
    src: newFlowApproved,
    title: "Approved",
    alt: "Page 3: an approval notice confirming an initial credit line and telling the advertiser their active ad accounts can now use it.",
  },
];

/* The working loop, told for this case study. */
const PROCESS_STEPS: ProcessDiagramProps["steps"] = {
  empathize: {
    body: "I focused research with Research and Data Science on where eligible advertisers dropped off.",
    ai: "Metamate connected funnel data and the brief into a research plan",
  },
  define: {
    body: "I framed one problem for five teams: raise awareness and remove repeated application work.",
    ai: "Challenged eligibility assumptions and helped define success measures",
  },
  ideate: {
    body: "I weighed preapproval, prefill and quick correction with Product, Legal and Finance.",
    ai: "Generated low-fidelity flow concepts under my direction",
  },
  refine: {
    body: "I refined nine screens into three within Meta's design system, built on verified data.",
    ai: "Exposed gaps in stale, mismatched and failed-verification states",
  },
  prototype: {
    body: "I chose an end-to-end, production-close flow so partners could review real data states.",
    ai: "Figma MCP connected the flow to production components",
  },
  test: {
    body: "I prioritized issues with Research, guided by Data Science performance signals.",
    ai: "Organized findings and separated behavior from feedback",
  },
  implement: {
    body: "I confirmed readiness with Engineering, then measured results with Data Science.",
    ai: "Applied approved changes and extended QA and analytics coverage",
  },
};

export default function MetaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <CaseStudyTopBar />

      {/* Opening: eyebrow, headline, the shift in one sentence, then the
          figures the record carries — each labelled with the status it
          actually holds, so nothing planned reads as banked. */}
      <div
        className={cx(PAGE_PAD, "pt-10 lg:pt-[78px]")}
        style={{ fontFamily: leagueSpartan }}
      >
        {/* Same words the record carries, with every break set by hand: left
            to fill, the line strands "beyond" from what it governs, or splits
            "credit card". From xl the headline holds two lines, the subject
            over the phrase. Below that the first line can no longer carry the
            subject at 96px, so it becomes three — one clause each, and the
            terms that belong together stay together. */}
        <CaseStudyHeader
          project={project}
          headline={
            <>
              Moving high-spend
              <br className="xl:hidden" />{" "}
              advertisers
              <br className="hidden xl:inline" />{" "}
              beyond
              <br className="xl:hidden" />{" "}
              credit card limits
            </>
          }
        />

        {/* One paragraph under the headline, carrying what the standfirst
            and the role block used to split between them: who I worked
            with, what moved, and how the work was run. It reads under its
            own label, at the measure and scale the PayPal headers use. */}
        <ProjectFacts
          project={project}
          facts={[]}
          className="mt-6 lg:mt-[27px]"
          factClassName={{ role: "lg:w-[861px]" }}
        />

        {/* The moment the work is about, with the figures it produced read
            against it. On a wide desktop they sit in the band of shelving
            above the laptop, centred between the top of the frame and the top
            of the lid. That band is a fixed 28% of the frame's height, and
            under 1280 the notes wrap to a second line and stop fitting inside
            it, so there the figures fall back to a row underneath. */}
        <div className="relative mt-6 lg:mt-[27px]">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/15 lg:aspect-[16/9] lg:rounded-[30px]">
            <Image
              src={metaHero}
              alt="An advertiser slumped at a laptop, one hand to their forehead, as Meta Ads Manager reports that their credit card was declined during setup."
              fill
              priority
              sizes="(max-width: 1024px) 100vw, calc(100vw - 48px)"
              className="object-cover"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden xl:block"
              style={{ background: HERO_FEATHER }}
            />
          </div>

          <dl className="theme-invariant-dark-xl mt-8 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-3 lg:gap-x-[40px] xl:absolute xl:right-[48px] xl:top-[14%] xl:mt-0 xl:w-[54%] xl:max-w-[760px] xl:-translate-y-1/2">
            {HERO_FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className={cx(CASE_STUDY_SUPPORTING_CLASS, "text-white/60")}>{fact.label}</dt>
                {/* Trimmed like every other figure on the site: the serif
                    reserves descender space under a row of digits and the
                    note reserves room above its caps, so without the trim
                    the same 17px reads about 15px wider here than it does
                    in the case studies. */}
                <dd className="metric-figure mt-3 font-serif text-[clamp(32px,5vw,56px)] font-normal leading-none tracking-[-0.01em] lg:mt-[18px]">
                  {fact.value}
                </dd>
                <dd className={cx(CASE_STUDY_SUPPORTING_CLASS, "metric-label mt-[17px] text-white/60")}>
                  {fact.note}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* The opportunity. Three columns of one sentence — where we started,
          the decision that connects them, what it becomes — all beginning on
          the same line. No cards and no rules: the type carries it, and the
          strategy in the middle stays the only lit thing on the page. */}
      <section
        aria-labelledby="meta-opportunity-title"
        className={cx(PAGE_PAD, SECTION_GAP)}
        style={{ fontFamily: leagueSpartan }}
      >
        <ScrollFade once>
          <p className={CASE_STUDY_LABEL_TIGHT_CLASS}>The Opportunity</p>
          <h2 id="meta-opportunity-title" className={SECTION_TITLE_CLASS}>
            A valuable product was hidden behind two kinds of friction
          </h2>
          <p className={cx(CASE_STUDY_BODY_CLASS, "mt-6 max-w-[900px] text-white/80 lg:mt-[32px]")}>
            {project.description[0]}
          </p>
        </ScrollFade>

        {/* Stacked in narrative order on small screens, and laid out as that
            same sentence, left to right, once there is room for it. The
            columns share a height on desktop, which is what lets the icon
            rows either side settle against the illustration between them. */}
        <div className="mt-12 flex flex-col gap-14 lg:mt-[80px] lg:grid lg:grid-cols-[1fr_minmax(300px,0.95fr)_1fr] lg:items-stretch lg:gap-12 xl:gap-[64px]">
          <div className={PANEL_CLASS}>
            <p className={CASE_STUDY_LABEL_TIGHT_CLASS}>Where We Started</p>
            <h3 className={PANEL_TITLE_CLASS}>High customer value, low product access</h3>
            <ul className={ROW_LIST_CLASS}>
              {PROBLEM_ROWS.map((row) => (
                <li key={row.text} className={ROW_ITEM_CLASS}>
                  <row.Icon className={ROW_ICON_CLASS} />
                  <p className={cx(PANEL_ROW_CLASS, "text-white/85")}>{row.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* The strategy. It starts on the same line as the columns either
              side, with the illustration under it at the full width of the
              column — black hardware lit in the accent, so it reads on the
              page's own ground with nothing boxing it in. */}
          <div className={PANEL_CLASS}>
            <p className={STRATEGY_LABEL_CLASS}>The Strategy</p>
            {/* On desktop the illustration is measured off the line above
                it: the wrapper takes its width from the headline — whose
                breaks are explicit, so its widest line is "Reuse verified
                data." — and the image is laid out out of flow, which keeps
                it from feeding its own 384px back into that measurement.
                Stacked, there is no icon row beside it to answer to, so it
                takes the column instead of a 24px line's worth of it. */}
            <div className="w-full lg:w-fit">
              <h3 className={cx(PANEL_TITLE_CLASS, "text-[#CEF252]")}>
                Move upstream.
                <br />
                Reuse verified data.
              </h3>
              <div
                className={cx(
                  PANEL_BODY_TOP,
                  "relative aspect-square w-full max-w-[460px] lg:max-w-none",
                )}
              >
                <Image
                  src={verificationEngine}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 90vw, 32vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className={PANEL_CLASS}>
            <p className={CASE_STUDY_LABEL_TIGHT_CLASS}>What It Becomes</p>
            <h3 className={PANEL_TITLE_CLASS}>Turn collection into confirmation</h3>
            <ul className={ROW_LIST_CLASS}>
              {OPPORTUNITY_ROWS.map((row) => (
                <li key={row.text} className={ROW_ITEM_CLASS}>
                  <row.Icon className={ROW_ICON_CLASS} />
                  <p className={cx(PANEL_ROW_CLASS, "text-white/85")}>{row.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The system the whole argument rests on. The diagram used to sit in
          the appendix, where the case for reuse arrived without the machinery
          that makes it possible; it reads here instead, with the four checks
          named in order and the paths around the approved one written out
          underneath. */}
      <section
        aria-labelledby="meta-system-title"
        /* The one section that explains the machinery rather than showing the
           work, set on its own plane so it reads as an aside to the argument.
           A cool near-black, one step up from the page and in the same family
           as the device bezels, so it separates without becoming a card.
           Its own edges now do the separating, so it sits closer to the
           sections either side than the open ones do to each other. */
        className={cx(PAGE_PAD, BAND_GAP, "theme-day-paper bg-[#0E0E12] py-[50px]")}
        style={{ fontFamily: leagueSpartan }}
      >
        <ScrollFade once>
          <p className={CASE_STUDY_LABEL_TIGHT_CLASS}>Eligibility and Verification</p>
          <h2 id="meta-system-title" className={SECTION_TITLE_CLASS}>
            The offer appears only after eligibility is confirmed
          </h2>
          <p className={cx(CASE_STUDY_BODY_CLASS, "mt-6 max-w-[900px] text-white/80 lg:mt-[32px]")}>
            Advertisers must pass four checks before entering: Monthly Invoicing eligibility,
            business verification, legal-entity matching, and Moody&rsquo;s screening. Those who
            qualify unlock a pre-approved experience built around guidance and information Meta
            already has&#8288;&mdash;not another form.
          </p>
        </ScrollFade>

        <figure className="mt-[50px]">
          <div className={DIAGRAM_FRAME} tabIndex={0}>
            <WorkflowDiagram label={DIAGRAM_ALT} className={DIAGRAM_IMAGE} />
          </div>
        </figure>

        <div className="mt-14 lg:mt-[90px]">
          <h3 className="font-serif text-[clamp(24px,3.2vw,34px)] font-normal leading-[1.14] tracking-[-0.01em]">
            What happens when the record is wrong
          </h3>
          <p className={cx(PANEL_ROW_CLASS, "mt-3 max-w-[900px] text-white/70 lg:mt-[14px]")}>
            The three delivered screens carry the approved path. These are the paths designed
            around it &mdash; proposed handling, not observed operational policy.
          </p>
          <dl className="mt-8 grid gap-x-12 gap-y-9 md:grid-cols-2 lg:mt-[44px] lg:gap-x-[64px] lg:gap-y-[46px]">
            {RECOVERY_PATHS.map(({ Icon, title, body }) => (
              <div key={title}>
                <dt className={RECOVERY_TITLE_CLASS}>
                  <Icon className={RECOVERY_ICON_CLASS} />
                  <span>{title}</span>
                </dt>
                <dd className={cx(CASE_STUDY_BODY_CLASS, "mt-3 text-white/70 lg:mt-[16px]")}>
                  {body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Before and after. The heading stays outside the frame so it
          survives the reveal; inside, nine screens are replaced in place by
          three, which is the whole argument of the redesign. */}
      <section
        aria-labelledby="meta-comparison-title"
        /* Follows the band, so it takes the band's tighter gap. */
        className={cx(PAGE_PAD, BAND_GAP)}
        style={{ fontFamily: leagueSpartan }}
      >
        <ScrollFade once>
          <p className={CASE_STUDY_LABEL_TIGHT_CLASS}>Before and After</p>
          <h2 id="meta-comparison-title" className={SECTION_TITLE_CLASS}>
            From document collection to information confirmation
          </h2>
        </ScrollFade>

        <div className="mt-[50px]">
          <RevealSlider
            autoReveal
            framed={false}
            label="Compare the Monthly Invoicing application before and after the redesign"
            rows={[
              {
                /* Heading and screens travel together on each side. The three
                   after screens stand in a bed built for nine, and the title
                   that names them comes down into the middle with them rather
                   than staying up at the top of the empty space. */
                before: (
                  <div>
                    <div className={SLIDER_ROW_PAD}>
                      <p className={CASE_STUDY_LABEL_TIGHT_CLASS}>Before</p>
                      <h3 className="mt-3 text-balance font-serif text-[clamp(22px,3vw,32px)] font-normal leading-[1.15] tracking-[-0.01em] lg:mt-[14px]">
                        9 screens to collect what Meta already held
                      </h3>
                    </div>
                    {/* The nine arrive stacked on one another and fan out into
                        the table, which is the reader's first sight of how many
                        screens the old application really was. */}
                    <LegacyScreenGrid
                      label="The previous nine-screen Monthly Invoicing application"
                      screens={LEGACY_SCREENS}
                      className={cx(
                        SLIDER_FILMSTRIP,
                        SLIDER_ROW_GRID,
                        SLIDER_ROW_PAD,
                        SLIDER_SCREENS_TOP,
                      )}
                      cellClassName={SLIDER_CELL}
                      frameClassName={SCREEN_FRAME}
                      captionClassName={SCREEN_CAPTION}
                    />
                  </div>
                ),
                after: (
                  <div className="md:flex md:h-full md:flex-col md:justify-center">
                    <div className={cx(SLIDER_ROW_PAD, "md:text-right")}>
                      <p className={CASE_STUDY_LABEL_TIGHT_CLASS}>After</p>
                      <h3 className="mt-3 text-balance font-serif text-[clamp(22px,3vw,32px)] font-normal leading-[1.15] tracking-[-0.01em] lg:mt-[14px]">
                        Three pages to confirm, correct, and approve
                      </h3>
                    </div>
                    <ol
                      aria-label="The redesigned three-page confirmation flow"
                      className={cx(
                        SLIDER_FILMSTRIP,
                        SLIDER_ROW_GRID,
                        SLIDER_ROW_PAD,
                        SLIDER_SCREENS_TOP,
                      )}
                    >
                      {REDESIGN_SCREENS.map((screen, index) => (
                        <li key={screen.title} className={SLIDER_CELL}>
                          <div className={SCREEN_FRAME}>
                            <Image
                              src={screen.src}
                              alt={screen.alt}
                              sizes="(max-width: 768px) 80vw, 30vw"
                              className="h-auto w-full"
                            />
                          </div>
                          <p className={SCREEN_CAPTION}>
                            <span className="text-white/40">0{index + 1}</span> {screen.title}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* A breath between the flow and its outcome: the delivered
          application replaying on the surface it ships on, with the live
          prototype directly under it and nothing else competing. */}
      <div className={cx(PAGE_PAD, "mt-20 md:mt-[110px] lg:mt-[150px]")}>
        <MiMacbookWalkthrough className="mx-auto w-full max-w-[1200px]" />
        <div className="mt-[30px] flex justify-center">
          <a
            href="https://montly-invoicing-prototype.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center rounded-full border border-[#919191] px-6 lg:px-[30px] ${CTA_PILL_SIZE.xl} font-normal whitespace-nowrap text-white transition-colors duration-150 hover:border-white`}
            style={{ fontFamily: leagueSpartan, lineHeight: 1 }}
          >
            Prototype
          </a>
        </div>
      </div>

      {/* The result. The bars are kept as they were: a baseline bar with
          the outcome growing out from under it, and every figure still
          labelled with the period it belongs to. */}
      <section
        aria-labelledby="meta-impact-title"
        className={cx(PAGE_PAD, SECTION_GAP, "mx-auto w-full max-w-[1600px]")}
        style={{ fontFamily: leagueSpartan }}
      >
        <ScrollFade once>
          <p className={CASE_STUDY_LABEL_TIGHT_CLASS}>Impact</p>
          <h2 id="meta-impact-title" className={EQUATION_TITLE_CLASS}>
            {/* The break is set by hand after "credit" so the two lines carry
                even weight; each fragment still holds together, so nothing
                else can split. Below lg the break lifts and the terms rag
                between themselves. */}
            <span className="whitespace-nowrap">Increased enrollment =</span>{" "}
            <span className="whitespace-nowrap">Less credit</span>
            <br className="hidden lg:inline" />{" "}
            <span className="whitespace-nowrap">card fees =</span>{" "}
            <span className="whitespace-nowrap">Greater savings</span>
          </h2>
        </ScrollFade>

        {/* The scale's two ends sit on the baseline of the first bar, so one
            line reads across the top of the chart. Same header as the PayPal
            chart, so the two read as one system. */}
        <div className="mt-14 mb-[12px] grid grid-cols-[110px_1fr] items-baseline gap-x-4 lg:mt-[96px] lg:grid-cols-[280px_1fr] lg:gap-x-12">
          <span aria-hidden="true" />
          {/* This chart's right-hand label is long enough to close on the
              left one at 320, so the pair steps down a size until there is
              room for it. */}
          <div className="flex justify-between gap-x-4">
            <p className="text-[clamp(13px,4.4vw,16px)] font-light leading-[1.5] text-white/60 lg:text-[24px] lg:leading-[1.4]">
              Baseline
            </p>
            <p className="whitespace-nowrap text-[clamp(13px,4.4vw,16px)] font-light leading-[1.5] text-white/60 lg:text-[24px] lg:leading-[1.4]">
              H1 2026
            </p>
          </div>
        </div>

        {/* Wider than the PayPal chart's rhythm: every row here carries a
            sublabel under its bar, which needs room of its own before the
            next label starts. */}
        <div className="space-y-20">
          <AnimatedImpactRow
            label="Expand eligibility"
            todayPct={27}
            futurePct={67}
            todayLabel="27%"
            futureLabel="67%"
            sublabel="27% baseline → 67% H1 2026; $11M impact"
          />
          <AnimatedImpactRow
            label={"Improve\nawareness"}
            todayPct={8}
            futurePct={41}
            todayLabel="8%"
            futureLabel="41%"
            sublabel="8% baseline → 41% H1 2026; a 33-point gain"
          />
          <AnimatedImpactRow
            label={"Grow\nconversion"}
            todayPct={39}
            futurePct={97}
            todayLabel="39%"
            futureLabel="97%"
            sublabel="39% baseline → 97% H1 2026; a 58-point gain"
          />
          <div className="grid grid-cols-[110px_1fr] items-center gap-4 lg:grid-cols-[280px_1fr] lg:gap-12">
            <h3 className="font-serif text-[clamp(18px,4.5vw,32px)] font-normal leading-[1.15] tracking-[-0.01em] lg:text-[clamp(24px,2.6vw,32px)]">
              <span className="lg:whitespace-nowrap">Annual savings</span>
            </h3>
            <p className="font-serif text-[clamp(40px,10vw,96px)] leading-[1] tracking-[-0.96px] lg:text-[clamp(64px,8vw,96px)]">
              ~7.5%
            </p>
          </div>
        </div>

        {/* What the chart is measured against, stated once under it. Three
            different measures share one scale, and the dollar figure belongs
            to the first of them rather than to the set. */}
        <p className={cx(CASE_STUDY_SUPPORTING_CLASS, "mt-14 max-w-[900px] text-white/60 lg:mt-[64px]")}>
          Each row is a separate measure against its own pre-launch baseline, compared over H1
          2026. The $11M is attributed to the eligibility expansion alone; the awareness and
          conversion figures are percentage-point gains, not restatements of it. Results shared
          by the Meta team after launch.
        </p>
      </section>

      {/* Behind the work. How the change was led, kept one click off the
          spine of the page so the argument reads straight through and the
          method is there for anyone who wants it. */}
      <div className={cx(PAGE_PAD, SECTION_GAP)} style={{ fontFamily: leagueSpartan }}>
        <SupportingAppendix
          id="behind-the-work"
          title="Behind the Work"
          summary="How I led the change: one coordinated strategy across discovery and conversion"
        >
          <div className={WORKSTREAM_GRID}>
            {WORKSTREAMS.map((stream, index) => (
              <div
                key={stream.title}
                className={index === 0 ? WORKSTREAM_COLUMN : WORKSTREAM_COLUMN_DIVIDED}
              >
                <h3 className="font-serif text-[clamp(24px,3.2vw,34px)] font-normal leading-[1.14] tracking-[-0.01em]">
                  {stream.title}
                </h3>
                <p className="mt-3 text-white/70 lg:mt-[14px]">{stream.body}</p>
              </div>
            ))}
          </div>
          <ProcessDiagram
            steps={PROCESS_STEPS}
            accent="#CEF252"
            dayAccent="#3c4a0b"
            className="mt-10 lg:mt-[76px]"
          />
        </SupportingAppendix>
      </div>

      {/* Next Case Studies */}
      <section id="next-case-study-section" className="relative w-full bg-black overflow-hidden flex flex-col items-center justify-center pb-24 lg:pb-[200px] pt-16 lg:pt-[78px] mt-20 md:mt-[110px] lg:mt-[150px]">
        <NextCaseStudyTicker color="#CEF252" dayColor="#3c4a0b" />

        {/* Same 24px gutter the other case studies keep. At 437 + 437 the full
            200px gap only fits from ~1122px up, so it steps down first. */}
        <div className="relative flex flex-col items-center gap-12 px-5 lg:flex-row lg:justify-center lg:gap-[100px] lg:px-[24px] xl:gap-[200px]">
          {/* PayPal */}
          <Link href={nextPayPal.route} className="group flex w-full max-w-[437px] lg:w-[437px] flex-col gap-4 lg:gap-[27px] items-start">
            <div className="aspect-[437/666] w-full lg:h-[666px] lg:w-[437px] relative lg:shrink-0 rounded-[30px] overflow-hidden">
              <img
                alt={nextPayPalPreview.alt}
                src={imageSrc(nextPayPalPreview.image)}
                className="absolute pointer-events-none object-cover h-full"
                style={{ width: "270%", maxWidth: "none", left: "-88%" }}
              />
            </div>
            <p className="font-serif text-[clamp(36px,9vw,64px)] lg:text-[64px] leading-[1.1] lg:leading-[72px] text-white tracking-[-0.64px]">
              {nextPayPal.cardLabel}
            </p>
          </Link>

          {/* Solo */}
          <Link href={nextSolo.route} className="group flex w-full max-w-[437px] lg:w-[437px] lg:shrink-0 flex-col gap-4 lg:gap-[27px] items-start">
            <div className="aspect-[437/666] w-full lg:h-[666px] lg:w-[438px] relative rounded-[30px] lg:shrink-0 overflow-hidden">
              <Image
                src={nextSoloPreview.image}
                alt={nextSoloPreview.alt}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 437px"
              />
            </div>
            <p className="font-serif text-[clamp(36px,9vw,60px)] lg:text-[60px] leading-[1.1] lg:leading-[72px] text-white tracking-[-0.64px] whitespace-nowrap">
              {nextSolo.cardLabel}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
