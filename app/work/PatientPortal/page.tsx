import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import NextCaseStudyTicker from "@/components/ui/next-case-study-ticker";
import CaseStudyTopBar from "@/components/ui/case-study-top-bar";
import ScrollFade from "@/components/ui/scroll-fade";
import DashboardAssembleReveal, {
  type DashboardVariant,
} from "@/components/ui/dashboard-assemble-reveal";
import { CTA_PILL_SIZE } from "@/components/ui/cta-pill";
import {
  CaseStudyHeader,
  ProjectFacts,
  ProjectDisclaimer,
  ProcessDiagram,
  type ProcessDiagramProps,
  SupportingAppendix,
  CASE_STUDY_BODY_CLASS,
  CASE_STUDY_FACT_VALUE_CLASS,
  CASE_STUDY_LABEL_TIGHT_CLASS,
  CASE_STUDY_LEAD_GAP_CLASS,
  CASE_STUDY_STACK_CLASS,
  cx,
} from "@/components/case-study";

import wireframeNextBestAction from "@/components/images/Patient Portal/Wireframe Negatives/next-best-action-negative.png";
import wireframeGuidedConcierge from "@/components/images/Patient Portal/Wireframe Negatives/guided-concierge-negative.png";
import wireframeCareJourney from "@/components/images/Patient Portal/Wireframe Negatives/patient-care-journey-negative.png";
import closingImage from "@/components/images/Patient Portal/patient-portal-hospital-laptop.png";

import carousel01 from "@/components/images/Patient Portal/Carousel_01.png";
import carousel02 from "@/components/images/Patient Portal/Carousel_02.png";
import carousel03 from "@/components/images/Patient Portal/Carousel_03.png";
import carousel04 from "@/components/images/Patient Portal/Carousel_04_nurse.png";
import carousel05 from "@/components/images/Patient Portal/Carousel_05.png";
import carousel06 from "@/components/images/Patient Portal/Carousel_06.png";
import carousel07 from "@/components/images/Patient Portal/Carousel_07.png";
import carousel08 from "@/components/images/Patient Portal/Carousel_08_teal.png";
import carousel09 from "@/components/images/Patient Portal/Carousel_09.png";
import carousel10 from "@/components/images/Patient Portal/Carousel_10.png";

import { PROJECTS_BY_ID, imageSrc, previewOf } from "@/lib/content";
import { withBasePath } from "@/lib/base-path";
import { caseStudyMetadata } from "@/lib/seo";

const project = PROJECTS_BY_ID.sutter;
const nextPayPal = PROJECTS_BY_ID.paypal;
const nextPayPalPreview = previewOf(nextPayPal);
const nextMeta = PROJECTS_BY_ID.meta;
const nextMetaPreview = previewOf(nextMeta);

export const metadata = caseStudyMetadata(
  project,
  "A 2.5-day design exercise reimagining the Sutter Health MyHealthOnline portal around a simpler appointment-booking flow.",
);

const leagueSpartan = "var(--font-league-spartan)";

/* The page gutter and the major vertical break, shared with the other case
   studies so the four of them scroll at the same rhythm. */
const PAGE_PAD = "px-5 lg:px-[24px]";
const SECTION_GAP = "mt-24 md:mt-[140px] lg:mt-[200px]";
const ACCENT = "#167975";
/* The brand teal is a fill, not a text colour: on black it measures 4.03:1,
   under even the AAA large-text floor. This is the same hue and saturation
   lifted to 7.35:1, so the concept titles clear AAA for normal text while
   still reading as the one Sutter colour the ticker paints. */
const ACCENT_TEXT = "#20aaa4";

/* The three directions the portal was explored in, in the order they were
   drawn. Each one is a Stitch wireframe that assembles itself on scroll —
   the same treatment, and the same component, as the DoorDash concepts. */
const DISCOVERY_CONCEPTS: readonly {
  title: string;
  description: string;
  image: StaticImageData;
  alt: string;
  variant: DashboardVariant;
}[] = [
  {
    title: "Next Best Action",
    description: "Makes the patient’s most important task immediately visible.",
    image: wireframeNextBestAction,
    alt: "Wireframe of the Next Best Action dashboard: a prioritised list of what needs attention, each item carrying its own next step, beside shortcuts and a collapsed menu for everything else.",
    variant: "next-best-action",
  },
  {
    title: "Patient Care Journey",
    description: "Keeps visits, results, and next steps in context.",
    image: wireframeCareJourney,
    alt: "Wireframe of the Patient Care Journey: a dated timeline of visits, results and next steps, with a panel naming who is responsible for each one.",
    variant: "care-journey",
  },
  {
    title: "Guided AI Concierge",
    description: "Provides optional help when patients are unsure what to do.",
    image: wireframeGuidedConcierge,
    alt: "Wireframe of the Guided AI Concierge: a plain-language question box with suggested prompts above a transcript that explains a result and offers what to do next.",
    variant: "guided-concierge",
  },
];

const carouselItems = [
  { id: 1, src: carousel01, orientation: "landscape" },
  { id: 2, src: carousel02, orientation: "portrait" },
  { id: 3, src: carousel03, orientation: "landscape" },
  { id: 4, src: carousel04, orientation: "portrait" },
  { id: 5, src: carousel05, orientation: "landscape" },
  { id: 6, src: carousel06, orientation: "portrait" },
  { id: 7, src: carousel07, orientation: "landscape" },
  { id: 8, src: carousel08, orientation: "portrait" },
  { id: 9, src: carousel09, orientation: "landscape" },
  { id: 10, src: carousel10, orientation: "portrait" },
] as const;

/* The working loop, told for this case study. */
const PROCESS_STEPS: ProcessDiagramProps["steps"] = {
  empathize: {
    body: "I focused my review on the biggest issue: booking care competes with every other portal feature.",
    ai: "Organized the audit into a research plan and open questions",
  },
  define: {
    body: "I framed booking as the clearest next action within a focused 2.5-day redesign.",
    ai: "Challenged assumptions and helped define success",
  },
  ideate: {
    body: "I weighed Next Best Action, Patient Care Journey and a Guided AI Concierge.",
    ai: "Generated low-fidelity concepts for each model under my direction",
  },
  refine: {
    body: "I refined one task-first home from the strongest parts of all three models.",
    ai: "Exposed gaps in content, accessibility and unavailable states",
  },
  prototype: {
    body: "I chose a functional prototype so booking could start from one home screen.",
    ai: "Figma MCP and Claude Code built it from the Figma design",
  },
  test: {
    body: "I walked every booking state and documented what still needs patient validation.",
    ai: "Organized the walkthrough into ranked gaps",
  },
  implement: {
    body: "I packaged a polished concept with handoff-ready rationale—not a production launch.",
    ai: "Drafted variants, annotations and QA cases",
  },
};

export default function PatientPortalPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <CaseStudyTopBar />

      {/* Opening: eyebrow, headline, the role in one sentence, then the movie
          across the full measure — inside the same rounded frame the other
          case studies open their hero image in. */}
      <div className={cx(PAGE_PAD, "pt-10 lg:pt-[78px]")} style={{ fontFamily: leagueSpartan }}>
        <CaseStudyHeader project={project} />

        <ProjectFacts
          project={project}
          facts={[]}
          className="mt-6 lg:mt-[27px]"
          factClassName={{ role: "lg:w-[861px]" }}
        />

        <ProjectDisclaimer project={project} />

        {/* Portrait on a handset, widescreen from lg. The frame owns the
            aspect ratio, so the movie reserves its space before it loads. */}
        <div className="relative mt-6 aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/15 lg:mt-[27px] lg:aspect-[16/9] lg:rounded-[30px]">
          <video
            src={withBasePath("/videos/PatientPortal/SickMan_Rollover.mp4")}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>

      {/* Problem */}
      <section
        aria-labelledby="patient-portal-problem-title"
        className={cx(PAGE_PAD, "mt-[50px]")}
        style={{ fontFamily: leagueSpartan }}
      >
        <ScrollFade direction="left">
          <div className={cx(CASE_STUDY_STACK_CLASS, "max-w-[1539px]")}>
            <h2 id="patient-portal-problem-title" className={CASE_STUDY_LABEL_TIGHT_CLASS}>
              Problem
            </h2>
            <div
              className={cx(
                "flex flex-col max-w-[1100px]",
                CASE_STUDY_FACT_VALUE_CLASS,
                CASE_STUDY_LEAD_GAP_CLASS,
              )}
            >
              {project.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </ScrollFade>
      </section>

      {/* Discovery — three concepts, alternating sides, each wireframe
          assembling itself the way Stitch drew it. */}
      <section
        aria-labelledby="patient-portal-discovery-title"
        className={cx(PAGE_PAD, SECTION_GAP)}
        style={{ fontFamily: leagueSpartan }}
      >
        <ScrollFade direction="left">
          <div className={cx(CASE_STUDY_STACK_CLASS, "max-w-[1476px]")}>
            <h2 id="patient-portal-discovery-title" className={CASE_STUDY_LABEL_TIGHT_CLASS}>
              Discovery
            </h2>
            <p className={cx(CASE_STUDY_FACT_VALUE_CLASS, "max-w-[1100px]")}>
              My review identified three needs: make priorities visible, keep care context
              together, and offer guidance without hiding essential tasks behind chat.
            </p>
          </div>
        </ScrollFade>

        <div className="mt-[50px] flex flex-col gap-[50px]">
          {DISCOVERY_CONCEPTS.map((concept, i) => (
            <div
              key={concept.title}
              className={`flex flex-col ${
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-[30px]`}
            >
              <DashboardAssembleReveal
                image={concept.image}
                alt={concept.alt}
                variant={concept.variant}
                className="relative w-full lg:w-[54%] shrink-0 overflow-hidden rounded-2xl lg:rounded-[24px] bg-white/5"
                style={{ aspectRatio: `${concept.image.width} / ${concept.image.height}` }}
              />
              <ScrollFade
                direction={i % 2 === 0 ? "right" : "left"}
                className="flex w-full lg:w-[40%] flex-col gap-[14px]"
              >
                <h3
                  className="text-[clamp(34px,6.3vw,67px)] lg:text-[67px] leading-[1.04] tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-pt-serif)", color: `var(--sutter-accent, ${ACCENT_TEXT})` }}
                >
                  {concept.title}
                </h3>
                <p className={cx(CASE_STUDY_BODY_CLASS, "text-white/70")}>
                  {concept.description}
                </p>
              </ScrollFade>
            </div>
          ))}
        </div>
      </section>

      {/* Prototype carousel — auto-scrolling marquee */}
      <section className={cx(SECTION_GAP, "w-full pb-16 lg:pb-[200px]")} style={{ fontFamily: leagueSpartan }}>
        <div className="group relative w-full overflow-hidden">
          <div
            className="flex w-max items-center gap-[150px] group-hover:[animation-play-state:paused]"
            style={{ animation: "ticker-scroll 60s linear infinite", willChange: "transform" }}
          >
            {[...carouselItems, ...carouselItems].map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className="shrink-0 flex items-center h-[300px] sm:h-[380px] lg:h-[500px]"
              >
                <img
                  src={item.src.src}
                  alt=""
                  aria-hidden
                  className={`w-auto rounded-[20px] object-cover ${
                    item.orientation === "portrait" ? "h-full" : "h-[78%]"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The decision the prototype was cut to, read after the screens it
          produced rather than before them. */}
      <section className={PAGE_PAD} style={{ fontFamily: leagueSpartan }}>
        <ScrollFade direction="left">
          <p className={cx(CASE_STUDY_FACT_VALUE_CLASS, "max-w-[1100px]")}>
            For the prototype, I combined visible priorities, care-journey context, and
            optional guidance, then focused the experience on appointment booking.
          </p>
        </ScrollFade>
      </section>

      {/* Closing — What Changed, set into the closing image the way the
          DoorDash case study carries its own. */}
      <section className="theme-invariant-dark relative w-full mt-[50px] pb-[100px]">
        <div className="relative">
          <a
            href="https://v-health-patient-portal.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the patient portal prototype"
            className="relative block w-full aspect-[1672/941]"
          >
            <Image
              src={closingImage}
              alt="The redesigned patient portal on a laptop in a hospital room"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-black/85 via-black/40 to-transparent lg:block" />
          </a>

          <ScrollFade
            direction="left"
            className="pointer-events-none static z-10 ml-5 flex w-[calc(100%-40px)] flex-col gap-10 py-10 sm:w-2/3 sm:gap-12 lg:absolute lg:inset-x-0 lg:top-0 lg:mx-0 lg:w-[calc(42vw-42px)] lg:gap-[56px] lg:py-0 lg:pl-[37px] lg:pt-[12%]"
            style={{ fontFamily: leagueSpartan }}
          >
            <div className="pointer-events-auto flex flex-col gap-[14px] text-white">
              <p className="text-sm lg:text-[18px] font-light leading-none text-white/60">What Changed.</p>
              <ul className="text-[clamp(18px,2.2vw,22px)] font-light leading-[1.4] list-disc pl-6 lg:pl-[36px] space-y-4 sm:space-y-5 lg:space-y-[24px]">
                <li>
                  Reorganized the dashboard around patient tasks rather than health-system categories.
                </li>
                <li>
                  Elevated appointments, check-in, results, messages, and refills into prioritized updates.
                </li>
                <li>
                  Made booking a prominent, guided flow with assistance available when needed.
                </li>
              </ul>
              <p className="mt-[6px] lg:mt-[10px] text-sm lg:text-[18px] font-light leading-snug text-white/70">
                Outcome: a functional prototype that surfaces priority tasks and starts booking
                from one home screen.
              </p>
            </div>

            <div className="pointer-events-auto flex flex-wrap items-center gap-4 lg:gap-[24px]">
              <a
                href="https://v-health-patient-portal.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center rounded-full border border-white/30 px-6 lg:px-[30px] ${CTA_PILL_SIZE.xl} font-normal leading-none whitespace-nowrap text-white transition-colors duration-150 hover:border-white`}
                style={{ fontFamily: leagueSpartan }}
              >
                Prototype
              </a>
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Behind the work. The method is kept one click off the spine of the
          page, the way the other case studies carry theirs. */}
      <div className={PAGE_PAD} style={{ fontFamily: leagueSpartan }}>
        <SupportingAppendix
          id="behind-the-work"
          title="Behind the Work"
          summary="The AI-assisted workflow behind the strategy, the iteration, and the prototype"
        >
          <ProcessDiagram steps={PROCESS_STEPS} accent={ACCENT} dayAccent="var(--sutter-accent)" />
        </SupportingAppendix>
      </div>

      {/* Next Case Study section */}
      <section
        id="next-case-study-section"
        className="relative w-full bg-black overflow-hidden pt-16 lg:pt-[78px] pb-24 lg:pb-[200px] mt-20 md:mt-[110px] lg:mt-[150px]"
      >
        <NextCaseStudyTicker color={ACCENT} dayColor="var(--sutter-accent)" />

        {/* Both cards keep their aspect ratio and shrink together rather than
            running under the 24px gutter: at their full 437 + 671 the 200px gap
            only fits from ~1356px up, so the gap steps down first and the pair
            scales after that. */}
        <div className="relative flex flex-col lg:flex-row items-center lg:justify-center gap-12 lg:gap-[100px] xl:gap-[200px] px-5 lg:px-[24px]">
          {/* PayPal card */}
          <Link href={nextPayPal.route} className="group flex w-full min-w-0 max-w-[437px] lg:w-[437px] flex-col gap-4 lg:gap-[27px] items-start">
            <div className="relative aspect-[437/666] w-full rounded-[30px] overflow-hidden">
              <img
                src={imageSrc(nextPayPalPreview.image)}
                alt={nextPayPalPreview.alt}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <p className="font-serif text-[clamp(36px,9vw,64px)] lg:text-[64px] text-white leading-[1.1] lg:leading-[72px] tracking-[-0.64px]">
              {nextPayPal.cardLabel}
            </p>
          </Link>

          {/* Meta card */}
          <Link href={nextMeta.route} className="group flex w-full min-w-0 max-w-[671px] lg:w-[671px] flex-col gap-4 lg:gap-[27px] items-start">
            <div
              className="relative rounded-[30px] overflow-hidden w-full"
              style={{ aspectRatio: "824 / 606" }}
            >
              <div className="absolute h-full top-0" style={{ left: "-3.69%", width: "130.67%" }}>
                <Image
                  src={nextMetaPreview.image}
                  alt={nextMetaPreview.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <p className="font-serif text-[clamp(36px,9vw,64px)] lg:text-[64px] text-white leading-[1.1] lg:leading-[72px] tracking-[-0.64px] w-full">
              {nextMeta.cardLabel}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
