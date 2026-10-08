import type { CSSProperties, ReactNode } from "react";
import { cx } from "./types";

export type ProcessStepKey =
  | "empathize"
  | "define"
  | "ideate"
  | "refine"
  | "prototype"
  | "test"
  | "implement";

export interface ProcessStep {
  /** What I did at this station, in this case study. One or two lines, first person. */
  body: string;
  /** What AI carried at this station. A fragment, no full stop. */
  ai: string;
}

export interface ProcessDiagramProps {
  steps: Record<ProcessStepKey, ProcessStep>;
  /** The case study's colour — the same one its Next Case Study ticker takes. */
  accent: string;
  /** Darker day-mode variant, matching the ticker's `dayColor`. Falls back to `accent`. */
  dayAccent?: string;
  className?: string;
}

/* The seven line drawings from presentation slide 2, one idea each on a
   32-unit grid, drawn at the slide's .83 stroke. `nudge` is the slide's own
   optical correction (in px at its 58px icon), scaled with the icon here so
   the lopsided drawings still sit centred over their titles. */
const STATIONS: {
  key: ProcessStepKey;
  title: string;
  nudge?: number;
  icon: ReactNode;
}[] = [
  {
    key: "empathize",
    title: "Empathize",
    icon: (
      <path d="M16 27C16 27 4.5 20.2 4.5 12.2A6.2 6.2 0 0 1 16 8.9A6.2 6.2 0 0 1 27.5 12.2C27.5 20.2 16 27 16 27Z" />
    ),
  },
  {
    key: "define",
    title: "Define",
    icon: (
      <>
        <circle cx="13.8" cy="13.8" r="9.3" />
        <path d="M20.6 20.6 28 28" />
      </>
    ),
  },
  {
    key: "ideate",
    title: "Ideate",
    icon: (
      <>
        <path d="M4.6 10.9A12.5 12.5 0 0 1 28.2 18.6" />
        <path d="m25.5 15.9 2.7 2.7 2.7-2.7" />
        <path d="M27.4 21.1A12.5 12.5 0 0 1 3.8 13.4" />
        <path d="m1.1 16.1 2.7-2.7 2.7 2.7" />
        <path d="M13.8 20.2C13.8 17.6 10.3 16.4 10.3 12.3A5.7 5.7 0 0 1 21.7 12.3C21.7 16.4 18.2 17.6 18.2 20.2Z" />
        <path d="M14.1 22.4h3.8M15.1 24.4h1.8" />
      </>
    ),
  },
  {
    key: "refine",
    title: "Refine",
    /* Three sliders. The knobs take the page colour so each rail reads as
       passing behind its knob, in both themes. */
    icon: (
      <>
        <path d="M4 8h24M4 16h24M4 24h24" />
        <g fill="var(--pd-bg)">
          <circle cx="11" cy="8" r="2.7" />
          <circle cx="21" cy="16" r="2.7" />
          <circle cx="14" cy="24" r="2.7" />
        </g>
      </>
    ),
  },
  {
    key: "prototype",
    title: "Prototype",
    nudge: 4,
    icon: (
      <>
        <path d="M19 20V5.4A2.4 2.4 0 0 0 16.6 3H7.4A2.4 2.4 0 0 0 5 5.4v21.2A2.4 2.4 0 0 0 7.4 29h3" />
        <circle cx="12" cy="9.6" r="3" />
        <path d="m10.7 9.7.9.9 1.8-2" />
        <rect x="7.2" y="15.4" width="2.2" height="2.2" rx=".6" />
        <rect x="10.6" y="15.4" width="2.2" height="2.2" rx=".6" />
        <rect x="7.2" y="19.2" width="2.2" height="2.2" rx=".6" />
        <rect x="10.6" y="19.2" width="2.2" height="2.2" rx=".6" />
        <path d="M14 24.4V15.3a1.5 1.5 0 0 1 3 0v5.7h3.6a2.4 2.4 0 0 1 2.4 2.4v2.1c0 2.4-.9 3.8-2.2 5.1H14.3c-1.3-1.2-2.2-2.4-3.2-3.7l-1-1.5a1.3 1.3 0 0 1 2-1.6l1.9 1.6" />
      </>
    ),
  },
  {
    key: "test",
    title: "Test",
    icon: (
      <>
        <path d="M21 13V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h8.5" />
        <path d="m7.6 7.1 2.2 2.2M9.8 7.1 7.6 9.3" />
        <path d="M12.6 7.4h5.4M12.6 9.6h3.6" />
        <path d="m7.5 13.8 1.1 1.1 2.2-2.4" />
        <path d="M12.6 12.9h5.4M12.6 15.1h3.6" />
        <path d="m7.6 18.1 2.2 2.2M9.8 18.1l-2.2 2.2" />
        <path d="M12.6 18.4h4.4M12.6 20.6h2.4" />
        <path d="M17.6 29.5c0-4 1.6-6.8 3.6-8.4a3.4 3.4 0 1 1 3.6 0c2 1.6 3.6 4.4 3.6 8.4" />
      </>
    ),
  },
  {
    key: "implement",
    title: "Implement",
    nudge: 3,
    icon: (
      <g transform="translate(16 16) rotate(45) translate(-14 -13.8)">
        <path d="M14 3c3.2 3 4.6 7.2 4.6 12.2v4.4H9.4v-4.4C9.4 10.2 10.8 6 14 3Z" />
        <circle cx="14" cy="12" r="1.8" />
        <path d="M9.4 15.8 6.2 19.2v3.2l3.2-2.2M18.6 15.8l3.2 3.4v3.2l-3.2-2.2" />
        <path d="M12.2 19.6c0 2.2.7 3.8 1.8 5 1.1-1.2 1.8-2.8 1.8-5" />
      </g>
    ),
  },
];

const TOOLS: { name: string; role: string }[] = [
  { name: "Figma + Code Connect", role: "design intent ↔ production components" },
  { name: "Figma MCP + AI agents", role: "context, critique, implementation and QA" },
];

/* The diagram escapes the page gutter to sit 50px from each screen edge.
   As on the slide, each station stacks its drawing over its title, and the
   wire's top run passes through the titles' centre line. --pd-icon and
   --pd-title size the node; from xl the seven stations share one row and
   both scale with the viewport, landing on the slide's 58px / 26px at 1440. */
const FRAME_CLASS =
  "process-diagram relative mb-[6px] ml-[calc(50%-50vw+50px)] w-[calc(100vw-100px)] font-sans [--pd-icon:56px] [--pd-title:24px] xl:[--pd-icon:clamp(46px,4.03vw,62px)] xl:[--pd-title:clamp(20px,1.8vw,28px)]";

/* Icon + 8px gap + half the title's line box (1.05 leading). */
const WIRE_CLASS =
  "pointer-events-none absolute inset-x-0 top-[calc(var(--pd-icon)+8px+var(--pd-title)*0.525)] bottom-0 rounded-[24px] border-[1.5px] border-[var(--pd-accent)]";

/* Body and AI lines wrap balanced rather than inheriting the site's
   `pretty` + bindLastWord pairing: in these narrow columns that pairing
   pulls words down and strands a short middle line ("ranked gaps from /
   the walkthrough"). Balance evens the lines and never leaves a lone word.

   From xl each station spans three subgrid rows (node, body, AI line), so
   every AI line starts on the same baseline across the row, as on the slide. */

/* Each node masks the wire with the page background, so the wire reads as
   passing behind the title and on to the next station. */
const NODE_CLASS =
  "flex w-max flex-col items-center gap-[8px] self-center justify-self-center bg-black px-[10px] text-center";

function iconStyle(nudge?: number): CSSProperties | undefined {
  if (!nudge) return undefined;
  return { transform: `translateX(calc(${nudge / 58} * var(--pd-icon)))` };
}

/**
 * The AI-powered UX loop from presentation slide 2. Every case study keeps
 * the same seven stations, tools and return signal; only the project-specific
 * human work and AI assistance below each station changes, and the wire and
 * icons take the case study's own colour. All seven stations render together,
 * with no step animation.
 */
export function ProcessDiagram({ steps, accent, dayAccent, className }: ProcessDiagramProps) {
  return (
    <div
      className={cx(FRAME_CLASS, className)}
      style={{
        ["--pd-accent-dark" as string]: accent,
        ["--pd-accent-day" as string]: dayAccent ?? accent,
      }}
    >
      <div className={WIRE_CLASS} aria-hidden="true" />

      <ol className="relative grid grid-cols-1 gap-x-8 gap-y-12 px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 xl:grid-rows-[auto_auto_auto] xl:gap-x-[clamp(16px,2vw,32px)] xl:gap-y-0 xl:px-[clamp(20px,2.4vw,44px)]">
        {STATIONS.map((station) => {
          const step = steps[station.key];
          return (
            <li key={station.key} className="flex min-w-0 flex-col xl:row-span-3 xl:grid xl:grid-rows-subgrid">
              <div className={NODE_CLASS}>
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".83"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[var(--pd-icon)] w-[var(--pd-icon)] shrink-0 overflow-visible text-[var(--pd-accent)]"
                  style={iconStyle(station.nudge)}
                  aria-hidden="true"
                >
                  {station.icon}
                </svg>
                <h3 className="font-serif text-[length:var(--pd-title)] font-normal leading-[1.05] tracking-[-0.012em] text-white">
                  {station.title}
                </h3>
              </div>
              <p className="mt-4 text-[15px] font-light leading-[1.42] text-balance text-white/70 xl:mt-[14px] xl:text-[clamp(13.5px,0.95vw,16px)]">
                {step.body}
              </p>
              <p className="mt-3 text-[13px] font-light leading-[1.45] text-balance text-white/50 xl:text-[clamp(12px,0.85vw,14px)]">
                <b className="mr-2 text-[10px] font-normal tracking-[0.02em] opacity-80">AI</b>
                {step.ai}
              </p>
            </li>
          );
        })}
      </ol>

      <ul className="relative mt-14 flex flex-wrap items-baseline px-6 pb-[18px] xl:mt-[80px] xl:px-[clamp(20px,2.4vw,44px)] xl:pb-[38px]">
        <li className="pr-[13px] text-[10px] font-normal uppercase tracking-[0.14em] text-white/50">
          Tools
        </li>
        {TOOLS.map((tool, index) => (
          <li
            key={tool.name}
            className={cx(
              "pr-[13px] text-[12.5px] font-light leading-[1.45] text-white/70 xl:text-[13px]",
              index === 0 ? "pl-[11px]" : "border-l border-white/15 pl-[13px]",
            )}
          >
            <b className="mr-[6px] font-normal text-white">{tool.name}</b>
            {tool.role}
          </li>
        ))}
      </ul>

      <p className="absolute bottom-0 left-1/2 max-w-[calc(100%-48px)] -translate-x-1/2 translate-y-1/2 bg-black px-4 text-center text-[11px] font-normal leading-none tracking-[0.04em] text-[var(--pd-accent)]">
        Signals become the next product decision
      </p>
    </div>
  );
}
