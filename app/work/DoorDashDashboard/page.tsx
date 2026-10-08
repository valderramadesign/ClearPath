import Image from "next/image";
import closingImage from "@/components/images/DoorDash Dashboard/TableWithLaptopAndPhone.png";
import Link from "next/link";
import NextCaseStudyTicker from "@/components/ui/next-case-study-ticker";
import CaseStudyTopBar from "@/components/ui/case-study-top-bar";
import ScrollFade from "@/components/ui/scroll-fade";
import DashboardAssembleReveal from "@/components/ui/dashboard-assemble-reveal";
import actionFirstDashboard from "@/components/images/DoorDash Dashboard/minimal-action-first-dashboard-negative-transparent.png";
import decisionBriefDashboard from "@/components/images/DoorDash Dashboard/decision-brief-dashboard-negative-transparent.png";
import missionControlDashboard from "@/components/images/DoorDash Dashboard/promotion-profitability-console-negative-transparent.png";
import personaMarketplaceOps from "@/components/images/DoorDash Dashboard/persona-marketplace-ops.png";
import personaMerchantSuccess from "@/components/images/DoorDash Dashboard/persona-merchant-success.png";
import personaGrowthFinance from "@/components/images/DoorDash Dashboard/persona-growth-finance.png";
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
import { PROJECTS_BY_ID, imageSrc, previewOf } from "@/lib/content";
import { withBasePath } from "@/lib/base-path";
import { caseStudyMetadata } from "@/lib/seo";

const project = PROJECTS_BY_ID.doordash;
const nextPayPal = PROJECTS_BY_ID.paypal;
const nextPayPalPreview = previewOf(nextPayPal);
const nextSolo = PROJECTS_BY_ID.solo;
const nextSoloPreview = previewOf(nextSolo);

export const metadata = caseStudyMetadata(
  project,
  "A self-initiated two-day concept sprint turning a cluttered DoorDash operations dashboard into a scannable, AI-assisted view of the day's most urgent marketplace issues.",
);

const leagueSpartan = "var(--font-league-spartan)";

/* The page gutter and the major vertical break, shared with the other case
   studies so the six of them scroll at the same rhythm. */
const PAGE_PAD = "px-5 lg:px-[24px]";
const SECTION_GAP = "mt-24 md:mt-[140px] lg:mt-[200px]";
/* The DoorDash logo red, used straight for both the ticker fill and the
   concept titles. On black it measures 5.65:1, which clears AAA for large
   text — and the titles never render below 34px, so the floor that applies to
   them is the large-text one. */
const ACCENT = "#ff3008";
const ACCENT_TEXT = ACCENT;

const PERSONAS = [
  {
    role: "Marketplace Operations Manager",
    avatar: personaMarketplaceOps,
    summary:
      "Balances demand, Dasher supply, and delivery reliability; needs prioritized breakdowns and clear root causes.",
  },
  {
    role: "Merchant Success Manager",
    avatar: personaMerchantSuccess,
    summary:
      "Improves store performance; needs to identify merchants driving delays, refunds, cancellations, and missing items.",
  },
  {
    role: "Growth, Promotions & Finance Analyst",
    avatar: personaGrowthFinance,
    summary:
      "Evaluates profitable growth; needs promotions and incentives connected to lift, margin, incrementality, and cost.",
  },
];

const DISCOVERY_CONCEPTS = [
  {
    title: "Priority + Action Operating System",
    description: "Organizes work around urgent issues and next steps.",
    image: actionFirstDashboard,
    alt: "Minimal action-first dashboard concept",
    variant: "action" as const,
  },
  {
    title: "Decision Brief Dashboard",
    description: "Connects each signal to its impact, cause, and decision.",
    image: decisionBriefDashboard,
    alt: "Decision brief dashboard concept",
    variant: "brief" as const,
  },
  {
    title: "Role-Based Mission Control",
    description: "Adapts priorities to each team’s responsibilities.",
    image: missionControlDashboard,
    alt: "Role-based mission control dashboard concept",
    variant: "console" as const,
  },
];

/* The working loop, told for this case study. */
const PROCESS_STEPS: ProcessDiagramProps["steps"] = {
  empathize: {
    body: "I focused on the urgent decisions of three marketplace roles.",
    ai: "Structured context into hypotheses and research questions—not user findings",
  },
  define: {
    body: "I framed one goal: put the day's highest-impact marketplace issues first.",
    ai: "Challenged conflicts between roles and helped define success criteria",
  },
  ideate: {
    body: "I weighed action-first, decision-brief and role-based dashboard models.",
    ai: "Generated low-fidelity dashboard concepts under my direction",
  },
  refine: {
    body: "I refined one direction: prioritized issues with decision context, and role detail kept secondary.",
    ai: "Exposed gaps in content, accessibility and edge cases",
  },
  prototype: {
    body: "I chose a working build to show one path from issue detection to resolution.",
    ai: "Figma MCP and Claude Code built it from the Figma system",
  },
  test: {
    body: "I reviewed each flow against each role's job and documented what needs real-user testing.",
    ai: "Organized the review into ranked gaps",
  },
  implement: {
    body: "I delivered a production-minded prototype and validation plan—not a shipped product.",
    ai: "Drafted acceptance criteria and extended QA coverage",
  },
};

export default function DoorDashDashboardCaseStudy() {
  return (
    <main className="bg-black text-white">
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
            src={withBasePath("/videos/DoorDashDashboard/DoorDashDashboardHeroMovie_v2.mp4")}
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
        aria-labelledby="doordash-problem-title"
        className={cx(PAGE_PAD, "mt-[50px]")}
        style={{ fontFamily: leagueSpartan }}
      >
        <ScrollFade direction="left">
          <div className={cx(CASE_STUDY_STACK_CLASS, "max-w-[1563px]")}>
            <h2 id="doordash-problem-title" className={CASE_STUDY_LABEL_TIGHT_CLASS}>
              Problem
            </h2>
            <div
              className={cx(
                "flex flex-col max-w-[1100px]",
                CASE_STUDY_FACT_VALUE_CLASS,
                CASE_STUDY_LEAD_GAP_CLASS,
              )}
            >
              <p>{project.description[0]}</p>
              <p>{project.description[1]}</p>
            </div>
          </div>
        </ScrollFade>
      </section>

      {/* Discovery — three concepts, alternating sides, each wireframe
          assembling itself the way Stitch drew it. */}
      <section
        aria-labelledby="doordash-discovery-title"
        className={cx(PAGE_PAD, SECTION_GAP)}
        style={{ fontFamily: leagueSpartan }}
      >
        <div className="flex flex-col gap-[50px]">
          <ScrollFade direction="left">
            <div className={cx(CASE_STUDY_STACK_CLASS, "max-w-[1476px]")}>
              <h2 id="doordash-discovery-title" className={CASE_STUDY_LABEL_TIGHT_CLASS}>
                Discovery
              </h2>
              <p className={cx(CASE_STUDY_FACT_VALUE_CLASS, "max-w-[1100px]")}>
                I mapped the jobs of operations, merchant success, and finance users. One need cut
                across all three: move from monitoring metrics to resolving prioritized issues.
              </p>
            </div>
          </ScrollFade>

          {DISCOVERY_CONCEPTS.map((concept, i) => (
            <div
              key={concept.title}
              className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-[30px]`}
            >
              <DashboardAssembleReveal
                image={concept.image}
                alt={concept.alt}
                variant={concept.variant}
                /* These PNGs are white linework on transparency, so the card
                   stays black in day mode — the Patient Portal wireframes
                   carry the same black in their own pixels. */
                className="relative w-full lg:w-[54%] shrink-0 overflow-hidden rounded-2xl lg:rounded-[24px] bg-[#000]"
                style={{ aspectRatio: `${concept.image.width} / ${concept.image.height}` }}
              />
              <ScrollFade
                direction={i % 2 === 0 ? "right" : "left"}
                className="flex w-full lg:w-[40%] flex-col gap-[14px]"
                style={{ fontFamily: leagueSpartan }}
              >
                <h3
                  className="text-[clamp(34px,6.3vw,67px)] lg:text-[67px] leading-[1.04] tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-pt-serif)", color: `var(--doordash-accent, ${ACCENT_TEXT})` }}
                >
                  {concept.title}
                </h3>
                <p className={cx(CASE_STUDY_BODY_CLASS, "text-white/70")}>
                  {concept.description}
                </p>
              </ScrollFade>
            </div>
          ))}

          {/* The column's 50px gap plus 150px here sets this closing statement
              200px clear of the last concept, so it reads as a conclusion
              rather than a fourth screen's caption. */}
          <ScrollFade direction="left" className="mt-[150px]">
            <p className={cx(CASE_STUDY_FACT_VALUE_CLASS, "max-w-[1100px]")}>
              The final direction combines prioritized issues with decision context, while keeping
              role-specific information secondary.
            </p>
          </ScrollFade>
        </div>
      </section>

      {/* Closing */}
      <section className="theme-invariant-dark relative w-full mt-[50px]">
        <div className="relative">
          <a
            href="https://door-dash-dashboard-amber.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the DoorDash dashboard prototype"
            className="relative block w-full aspect-[1726/911]"
          >
            <Image
              src={closingImage}
              alt="DoorDash dashboard shown across laptop and phone"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-black/85 via-black/40 to-transparent lg:block" />
          </a>

          <ScrollFade
            direction="left"
            className="pointer-events-none static z-10 ml-6 flex w-[calc(100%-48px)] flex-col gap-10 py-10 sm:w-2/3 sm:gap-12 lg:absolute lg:inset-x-0 lg:top-0 lg:mx-0 lg:w-[calc(42vw-42px)] lg:gap-[56px] lg:py-0 lg:pl-[37px] lg:pt-[9.7%]"
            style={{ fontFamily: leagueSpartan }}
          >
            <div className="pointer-events-auto flex flex-col gap-6 lg:gap-8">
              <p className="text-sm lg:text-[18px] font-light text-white/60">What Changed.</p>
              <ul className="ml-[24px] flex list-disc flex-col gap-3 lg:gap-[18px] text-base lg:text-[22px] font-light leading-[1.5] lg:leading-[1.4] text-white">
                <li>
                  Prioritized issues by urgency and impact instead of giving every
                  metric equal weight.
                </li>
                <li>
                  Paired each issue with its impact, likely cause, owner, and
                  recommended action.
                </li>
                <li>
                  Added a guided resolution flow that keeps users in context from
                  signal to action.
                </li>
              </ul>
              <p className="text-sm lg:text-[18px] font-light leading-snug text-white/70">
                Outcome: a working prototype that connects issue detection to
                resolution.
              </p>
            </div>

            <div className="pointer-events-auto flex flex-wrap items-center gap-3 lg:gap-[25px]">
              <a
                href="https://door-dash-dashboard-amber.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center rounded-full border border-[#919191] px-6 lg:px-[30px] ${CTA_PILL_SIZE.lg} font-normal leading-none whitespace-nowrap text-white transition-colors duration-150 hover:border-white`}
                style={{ fontFamily: "var(--font-league-spartan)" }}
              >
                Prototype
              </a>
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Behind the work. Who the dashboard was built for, and how it was
          built — kept one click off the spine of the page, the way the other
          case studies carry theirs. */}
      <div className={cx(PAGE_PAD, "mt-[100px]")} style={{ fontFamily: leagueSpartan }}>
        <SupportingAppendix
          id="behind-the-work"
          title="Behind the Work"
          summary="Who the dashboard was built for, and the AI-assisted workflow that built it"
        >
          {/* Personas and jobs-to-be-done */}
          <div className="flex w-full flex-col gap-10 lg:gap-[54px]">
            <h3 className={CASE_STUDY_LABEL_TIGHT_CLASS}>Personas and Jobs-to-Be-Done</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[68px] lg:gap-[81px]">
              {PERSONAS.map((persona) => (
                <div key={persona.role} className="flex flex-col gap-6 lg:gap-[28px] w-[80.5%] mx-auto">
                  <Image
                    src={persona.avatar}
                    alt={`${persona.role} persona portrait`}
                    className="h-[200px] w-[200px] lg:h-[260px] lg:w-[260px] self-center rounded-full object-cover"
                    sizes="260px"
                  />
                  <div className="flex flex-col gap-4 lg:gap-[15px]">
                    <h4 className="text-balance font-serif text-[clamp(20px,2vw,26px)] font-normal leading-[1.15] tracking-[-0.01em] sm:min-h-[2.3em]">
                      {persona.role}
                    </h4>
                    <div className="h-px w-full bg-white/[0.08]" />
                  </div>
                  <div className="flex flex-col gap-7 lg:gap-[34px]">
                    <p className="text-white/70">{persona.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ProcessDiagram
            steps={PROCESS_STEPS}
            accent={ACCENT}
            dayAccent="var(--doordash-accent)"
            className="mt-14 lg:mt-[100px]"
          />
        </SupportingAppendix>
      </div>

      {/* Next Case Studies */}
      <section
        id="next-case-study-section"
        className="relative w-full overflow-hidden bg-black pb-24 lg:pb-[200px] pt-16 lg:pt-[78px] mt-20 md:mt-[110px] lg:mt-[150px]"
      >
        <NextCaseStudyTicker color={ACCENT} dayColor="var(--doordash-accent)" />

        {/* Both cards keep their aspect ratio and shrink together rather than
            running under the 24px gutter: at their full 437 + 437 the 200px gap
            only fits from ~1122px up, so the gap steps down first and the pair
            scales after that. */}
        <div className="relative flex flex-col lg:flex-row items-center lg:justify-center gap-12 lg:gap-[100px] xl:gap-[200px] px-5 lg:px-[24px]">
          {/* PayPal */}
          <Link href={nextPayPal.route} className="group flex w-full min-w-0 max-w-[437px] lg:w-[437px] flex-col gap-4 lg:gap-[27px] items-start">
            <div className="aspect-[437/666] w-full relative rounded-2xl lg:rounded-[30px] overflow-hidden">
              <img
                alt={nextPayPalPreview.alt}
                src={imageSrc(nextPayPalPreview.image)}
                className="absolute pointer-events-none object-cover h-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                style={{ width: "270%", maxWidth: "none", left: "-88%" }}
              />
            </div>
            <p className="font-serif text-[clamp(36px,9vw,64px)] lg:text-[64px] leading-[1.1] lg:leading-[72px] text-white tracking-[-0.64px] transition-opacity duration-300 group-hover:opacity-70">
              {nextPayPal.cardLabel}
            </p>
          </Link>

          {/* Solo */}
          <Link href={nextSolo.route} className="group flex w-full min-w-0 max-w-[437px] lg:w-[437px] flex-col gap-4 lg:gap-[27px]">
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
