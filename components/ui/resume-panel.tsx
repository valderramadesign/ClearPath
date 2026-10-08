"use client";

import { Fragment, type ReactNode } from "react";

import { PAYPAL_PAY_IN_4_TPV_INCREASE, SITE } from "@/lib/content";

const jb = "var(--font-jetbrains-mono)";

const PRESENTATION_URL = "https://tim-v-presentation.vercel.app/#1";

const yellowHL = { background: "rgba(255,180,0,0.3)", borderRadius: "2px" };
const blueHL = { background: "rgba(0,176,216,0.18)", borderRadius: "2px" };

/*
 * Every `.ln` is one logical line of the file: the gutter numeral comes from a
 * CSS counter, and a soft-wrapped paragraph keeps a single number, as it does
 * in an editor. The `/ ""` form hides the numeral from assistive tech; browsers
 * without that syntax keep the plain declaration above it.
 */
const editorCss = `
  .resume-editor { counter-reset: line; }
  .resume-editor .ln {
    counter-increment: line;
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr);
    min-height: 21px;
  }
  @media (min-width: 640px) {
    .resume-editor .ln { grid-template-columns: 56px minmax(0, 1fr); }
  }
  .resume-editor .ln::before {
    content: counter(line);
    content: counter(line) / "";
    align-self: start;
    padding-right: 14px;
    text-align: right;
    color: #b5a47a;
    font-size: 12px;
    line-height: 21px;
    font-variant-numeric: tabular-nums;
    user-select: none;
    pointer-events: none;
  }
`;

type LineTag = "div" | "p" | "li" | "h2" | "h3";

function Line({
  as: Tag = "div",
  children,
}: {
  as?: LineTag;
  children?: ReactNode;
}) {
  return (
    <Tag className="ln m-0">
      <span className="block min-w-0 pr-[20px] sm:pr-[32px]">{children}</span>
    </Tag>
  );
}

/* A comment line that rules across the panel: `// LABEL ────────` */
function SectionHeader({ label }: { label: string }) {
  return (
    <Line as="h2">
      <span className="flex h-[21px] items-center gap-[10px] text-[#7c8896]">
        <span className="text-[13px]">{`//`}</span>
        <span className="pt-[1px] text-[11px] uppercase tracking-[0.14em]">
          {label}
        </span>
        <span className="h-px flex-1 bg-[#e0d3a3]" aria-hidden />
      </span>
    </Line>
  );
}

function Tag({ children, wrap }: { children: ReactNode; wrap?: boolean }) {
  return (
    <span className={wrap ? undefined : "whitespace-nowrap"}>
      <span className="text-[#7c8896]">[</span>
      <span className="text-[#00b0d8]">{children}</span>
      <span className="text-[#7c8896]">]</span>
    </span>
  );
}

function Job({
  company,
  title,
  type,
  dates,
  bullets,
}: {
  company: string;
  title: string;
  type?: string;
  dates: string;
  bullets: ReactNode[];
}) {
  return (
    <>
      <Line as="h3">
        <span className="flex flex-wrap items-baseline gap-x-[16px] text-[14px] leading-[21px]">
          <span className="font-semibold text-black">{company}</span>
          <span className="whitespace-nowrap text-[#7c8896] sm:ml-auto">
            {`// ${dates}`}
          </span>
        </span>
      </Line>
      <Line>
        <span className="block pl-[2ch] text-[14px] leading-[21px]">
          <span className="text-[#e5652a]">{title}</span>
          {type ? <> <Tag>{type}</Tag></> : null}
        </span>
      </Line>
      <ul>
        {bullets.map((bullet, i) => (
          <Fragment key={i}>
            {i > 0 && <Line as="li" />}
            <Line as="li">
              <span className="grid grid-cols-[16px_minmax(0,1fr)] pl-[2ch] text-[14px] leading-[21px] text-black">
                <span className="text-[#7c8896]" aria-hidden>
                  -
                </span>
                <span>{bullet}</span>
              </span>
            </Line>
          </Fragment>
        ))}
      </ul>
    </>
  );
}

function School({
  school,
  degree,
  field,
}: {
  school: string;
  degree: string;
  field: string;
}) {
  return (
    <>
      <Line as="h3">
        <span className="block text-[14px] font-semibold leading-[21px] text-black">
          {school}
        </span>
      </Line>
      <Line>
        <span className="block pl-[2ch] text-[14px] leading-[21px] text-black">
          {degree} <Tag wrap>{field}</Tag>
        </span>
      </Line>
    </>
  );
}

function Skill({ name, children }: { name: string; children: ReactNode }) {
  return (
    <Line as="p">
      <span className="grid sm:grid-cols-[13ch_minmax(0,1fr)] text-[14px] leading-[21px] text-black">
        <span>
          <span className="font-semibold">{name}</span>
          <span className="text-[#7c8896]">:</span>
        </span>
        <span>{children}</span>
      </span>
    </Line>
  );
}

const EMPTY = <Line />;

/*
 * The easter egg: a decorated egg drawn to the case studies' icon rules — a
 * 32-unit grid, currentColor, round caps and joins, and a stroke that stays a
 * hairline at any rendered size. Three bands of ornament, sized so each reads
 * at the 28px it renders at.
 */
function OrnateEgg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`[&_*]:[vector-effect:non-scaling-stroke] ${className ?? ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16 3c6.5 0 10.5 8 10.5 15.5S21.8 29 16 29 5.5 25 5.5 18.5 9.5 3 16 3Z" />
      <path d="m9.2 10.6 3.4-2.6 3.4 2.6 3.4-2.6 3.4 2.6" />
      <path d="M7.7 13.6h16.6" />
      <circle cx="11" cy="16.8" r="1.2" />
      <circle cx="16" cy="16.8" r="1.2" />
      <circle cx="21" cy="16.8" r="1.2" />
      <path d="M7.2 20h17.6" />
      <path d="M9.7 24.4c2.1-2.6 4.2 0 4.2 0s2.1 2.6 4.2 0 4.2 0 4.2 0" />
    </svg>
  );
}

export default function ResumePanel() {
  return (
    <div className="lg:h-screen w-full overflow-y-auto overflow-x-hidden bg-[#fcf5e0] shrink-0">
      <style>{editorCss}</style>

      {/* Window chrome — traffic lights + filename + print */}
      <div className="sticky top-0 z-20 flex items-center justify-between h-[36px] px-[16px] bg-[#f0e4b8] border-b border-[#e0d3a3]">
        <div className="flex items-center gap-[8px]">
          <div className="flex gap-[8px]">
            <div className="w-[12px] h-[12px] rounded-full bg-[#ff5f57]" />
            <div className="w-[12px] h-[12px] rounded-full bg-[#febc2e]" />
            <div className="w-[12px] h-[12px] rounded-full bg-[#28c840]" />
          </div>
          <div
            className="ml-[16px] text-[12px] text-[#7c8896]"
            style={{ fontFamily: jb }}
          >
            resume.tsx
          </div>
        </div>
        <a
          href={SITE.resumeFile}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-[#7c8896] hover:text-black transition-colors duration-150"
          style={{ fontFamily: jb }}
        >
          PRINT
        </a>
      </div>

      {/* Editor body */}
      <div
        className="resume-editor pt-[20px] pb-[56px]"
        style={{ fontFamily: jb }}
      >
        {/* Identity */}
        <Line as="p">
          <span className="block pt-[10px] text-[26px] leading-[36px] sm:text-[32px] sm:leading-[42px]">
            <span className="text-black">Tim</span>
            <span className="text-[#7c8896]">othy </span>
            <span className="text-black">Valderrama</span>
          </span>
        </Line>
        <Line as="p">
          <span className="block text-[14px] leading-[21px] text-[#e5652a]">
            {SITE.resumeTitle}
          </span>
        </Line>
        <Line as="p">
          <span className="flex flex-wrap gap-x-[12px] text-[13px] leading-[21px] text-black">
            <a href={`mailto:${SITE.email}`} className="hover:underline">
              <span className="text-[#7c8896]">{`<mailto:`}</span>
              {SITE.email}
              <span className="text-[#7c8896]">{`>`}</span>
            </a>
            <a href={`tel:${SITE.phoneTel}`} className="hover:underline">
              <span className="text-[#7c8896]">{`<tel:`}</span>
              {SITE.phone}
              <span className="text-[#7c8896]">{`>`}</span>
            </a>
            <a href={SITE.url} className="hover:underline">
              <span className="text-[#7c8896]">{`<`}</span>
              {SITE.url.replace(/^https?:\/\//, "")}
              <span className="text-[#7c8896]">{`>`}</span>
            </a>
            <span>
              <span className="text-[#7c8896]">{`<`}</span>
              {SITE.location}
              <span className="text-[#7c8896]">{`>`}</span>
            </span>
            <span>
              <span className="text-[#7c8896]">{`<`}</span>
              {SITE.citizenship}
              <span className="text-[#7c8896]">{`>`}</span>
            </span>
          </span>
        </Line>

        {EMPTY}

        {/* Summary */}
        <SectionHeader label="Summary" />
        <Line as="p">
          <span className="block text-[14px] leading-[21px] text-black">
            {SITE.resumeSummaryLead} {SITE.resumeSummaryDetail}
          </span>
        </Line>
        {EMPTY}
        {EMPTY}

        {/* Experience */}
        <SectionHeader label="Experience" />
        <Job
          company="Valderrama Design"
          title="Independent Product Designer"
          dates="Feb 2026 – Present"
          bullets={[
            <>
              Designed, built, and shipped an{" "}
              <span style={blueHL}>AI-powered activity reporting app</span> for
              Sunshine Little House of Learning, a preschool, from research
              through working code. It automates real-time parent updates and
              end-of-day summaries and{" "}
              <span style={yellowHL}>returns about 500 staff hours a year</span>
              .
            </>,
            <>
              Independent practice focused on{" "}
              <span style={blueHL}>AI-assisted product design</span>: strategy,
              interface design, prototyping, and design-to-code with Claude,
              ChatGPT, Figma AI, and Google Stitch.
            </>,
          ]}
        />
        {EMPTY}
        <Line>
          <span className="flex flex-wrap items-baseline gap-x-[16px] text-[14px] leading-[21px]">
            <span className="text-black">Medical leave — fully recovered</span>
            <span className="whitespace-nowrap text-[#7c8896] sm:ml-auto">
              {`// Sep 2025 – Feb 2026`}
            </span>
          </span>
        </Line>
        {EMPTY}
        <Job
          company="Meta FinTech"
          title="Staff Product Designer"
          type="Consultant"
          dates="Dec 2024 – Aug 2025"
          bullets={[
            <>
              Led design strategy to cut checkout payment friction with
              credential sharing and autopay, using{" "}
              <span style={blueHL}>
                AI for research synthesis, product framing, and opportunity
                analysis
              </span>
              .{" "}
              <span style={yellowHL}>
                Grew incremental revenue 6.3% and stored-payment coverage 36%
              </span>
              .
            </>,
            <>
              Redesigned the Monthly Invoicing application for ad billing with{" "}
              <span style={blueHL}>AI- and automation-driven steps</span> to
              move advertisers off credit cards.{" "}
              <span style={yellowHL}>
                Lifted conversion from 39% to 97% and cut card fees about 7.5% a
                year
              </span>
              .
            </>,
          ]}
        />
        {EMPTY}
        <Job
          company="PayPal"
          title="Lead Product Designer"
          type="FTE"
          dates="Oct 2016 – Apr 2024"
          bullets={[
            <>
              Most senior designer on the credit team. Owned end-to-end design
              for merchant and consumer credit products in the US, UK, and
              Germany, from application to checkout, funding, and loan
              servicing.
            </>,
            <>
              Partnered with Checkout product, design, and engineering leads to
              place credit offers inside purchase flows. Simplified applications
              across six US and UK products,{" "}
              <span style={yellowHL}>
                raising conversion from 51% to 79% and Pay in 4 monthly payment
                volume {PAYPAL_PAY_IN_4_TPV_INCREASE}
              </span>
              .
            </>,
            <>
              Led all installment products in credit-averse Germany and
              monetized offerings that had earned no revenue.{" "}
              <span style={yellowHL}>
                Grew Pay in 30 Days monthly payment volume 49% and PayPal
                Ratenzahlung annual incremental revenue 25%
              </span>
              .
            </>,
            <>
              Mentored senior designers, unblocked stalled projects, and raised
              design quality through critique, shared patterns, and tighter
              product and engineering alignment.
            </>,
          ]}
        />
        {EMPTY}
        <Job
          company="Cisco Systems"
          title="Senior UX Designer"
          type="Design Consultant"
          dates="Feb 2015 – Sep 2016"
          bullets={[
            <>
              Led end-to-end design for Cisco&apos;s flagship mobile app.
              Modernized it to current accessibility and UI standards,{" "}
              <span style={yellowHL}>raising user comprehension 43%</span>.
            </>,
            <>
              Co-built a scalable UI component library and UX standards for
              Cisco&apos;s intranet, and advised departments twice weekly in the
              Cisco UE Clinic.
            </>,
          ]}
        />

        {EMPTY}
        {EMPTY}

        {/* Education */}
        <SectionHeader label="Education" />
        <School
          school="Nielsen Norman Group"
          degree="Master Certificate"
          field="Human Computer Interaction, focus on AI-assisted design and product strategy for AI experiences"
        />
        {EMPTY}
        <School
          school="Academy of Art University"
          degree="Bachelor of Fine Arts"
          field="Graphic Design"
        />
        {EMPTY}
        <School
          school="De La Salle University"
          degree="Bachelor of Arts and Science"
          field="Business Marketing"
        />

        {EMPTY}
        {EMPTY}

        {/* Skills */}
        <SectionHeader label="Skills" />
        <Skill name="domains">
          Credit and lending, checkout and payments, billing and invoicing,
          regulated FinTech flows, and conversion optimization.
        </Skill>
        {EMPTY}
        <Skill name="ai_workflow">
          Research synthesis, opportunity framing, UX writing, edge-case
          analysis, rapid prototyping, structured critique, and design-to-code
          with{" "}
          <span style={blueHL}>
            Claude, ChatGPT, Figma AI, and Google Stitch
          </span>
          .
        </Skill>
        {EMPTY}
        <Skill name="ux_craft">
          Figma, design systems and component libraries, interaction and visual
          design, mobile and web systems thinking, accessibility, user research,
          and insight synthesis.
        </Skill>

        {/* Easter egg — centred on the two-digit numerals above it. A numeral
            pair is 14.4px wide at 12px JetBrains Mono and ends 14px from the
            gutter's edge, so its centre sits 21.2px in; the 28px egg lands
            there with a 7.2px right margin. */}
        <div className="mt-[24px] grid grid-cols-[44px_minmax(0,1fr)] sm:grid-cols-[56px_minmax(0,1fr)]">
          <a
            href={PRESENTATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Tim's presentation in a new tab"
            title="Something extra"
            className="mr-[7.2px] block justify-self-end rounded-[4px] text-[#b5a47a] transition-colors duration-150 hover:text-black focus-visible:text-black focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <OrnateEgg className="block h-[28px] w-[28px]" />
          </a>
        </div>
      </div>
    </div>
  );
}
