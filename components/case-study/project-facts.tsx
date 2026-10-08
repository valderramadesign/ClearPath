import type { CSSProperties } from "react";
import type { Project } from "@/lib/content";
import { Reveal } from "./reveal";
import {
  CASE_STUDY_FACT_VALUE_CLASS,
  CASE_STUDY_LABEL_TIGHT_CLASS,
  cx,
  type CaseStudyReveal as CaseStudyRevealDirection,
} from "./types";

/** The facts a case study header can state. Nothing here is inferred. */
export type ProjectFactKey =
  | "role"
  | "timeline"
  | "platforms"
  | "status"
  | "products"
  | "markets";

const DEFAULT_FACT_LABELS: Record<ProjectFactKey, string> = {
  role: "My Role",
  timeline: "Timeline",
  platforms: "Platforms",
  status: "Status",
  products: "Products",
  markets: "Markets",
};

const DEFAULT_LEAD_FACT: ProjectFactKey = "role";
const DEFAULT_FACTS: ProjectFactKey[] = ["timeline", "platforms"];

const ROW_CLASS =
  "flex w-full flex-col lg:flex-row items-start gap-10 lg:gap-[64px] py-6 lg:py-[42px]";
const LEAD_CLASS = "flex w-full max-w-full flex-col gap-[14px]";
const GROUP_REVEAL_CLASS = "lg:ml-auto w-full lg:w-auto";
const GROUP_CLASS = "flex flex-col sm:flex-row items-start gap-6 sm:gap-10 lg:gap-[80px]";
const FACT_CLASS = "flex flex-col gap-[14px]";

function joinList(values: string[] | undefined): string | undefined {
  const filled = (values ?? []).map((value) => value.trim()).filter(Boolean);
  return filled.length > 0 ? filled.join(", ") : undefined;
}

/** Reads a fact off the record. Returns undefined when the record has none. */
function factValue(project: Project, key: ProjectFactKey): string | undefined {
  switch (key) {
    case "role":
      return project.role.trim() || undefined;
    case "timeline":
      return project.timeline.trim() || undefined;
    case "status":
      return project.status.trim() || undefined;
    case "platforms":
      return joinList(project.scope.platforms);
    case "products":
      return joinList(project.scope.products);
    case "markets":
      return joinList(project.scope.markets);
  }
}

export interface ProjectFactsProps {
  /** The project record every fact is read from. */
  project: Project;
  /**
   * Fact given its own column ahead of the rest. Pass `null` for a single flat
   * list. Defaults to the role.
   */
  leadFact?: ProjectFactKey | null;
  /** Remaining facts, in render order. */
  facts?: ProjectFactKey[];
  /** Overrides a fact's label. */
  labels?: Partial<Record<ProjectFactKey, string>>;
  /** Extra classes per fact, for the widths a header layout needs. */
  factClassName?: Partial<Record<ProjectFactKey, string>>;
  id?: string;
  /** Extra classes on the row. */
  className?: string;
  style?: CSSProperties;
  /** Extra classes on the lead fact's list. */
  leadClassName?: string;
  /** Extra classes on the remaining facts' list. */
  groupClassName?: string;
  /** Classes on the motion wrapper around the remaining facts. */
  groupRevealClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  leadReveal?: CaseStudyRevealDirection;
  groupReveal?: CaseStudyRevealDirection;
  /** Reveals once instead of on every re-entry. */
  revealOnce?: boolean;
}

/**
 * The facts row under a case study headline: role, timeline, platforms, status,
 * and optionally products and markets, read from the shared project record.
 *
 * Every pair is a real `<dt>`/`<dd>`. A fact the record does not carry is left
 * out entirely, so the block never renders a placeholder or a "TBD", and the
 * whole row renders nothing when the record carries none of the requested
 * facts.
 *
 * The lead fact sits in its own list so it can reveal separately from the rest;
 * a layout with no lead fact renders one flat list instead.
 */
export function ProjectFacts({
  project,
  leadFact = DEFAULT_LEAD_FACT,
  facts = DEFAULT_FACTS,
  labels,
  factClassName,
  id,
  className,
  style,
  leadClassName,
  groupClassName,
  groupRevealClassName = GROUP_REVEAL_CLASS,
  labelClassName,
  valueClassName,
  leadReveal = "none",
  groupReveal = "none",
  revealOnce = false,
}: ProjectFactsProps) {
  const labelClass = cx(CASE_STUDY_LABEL_TIGHT_CLASS, labelClassName);
  const valueClass = cx(CASE_STUDY_FACT_VALUE_CLASS, valueClassName);

  const label = (key: ProjectFactKey) => labels?.[key] ?? DEFAULT_FACT_LABELS[key];

  const lead = leadFact ? factValue(project, leadFact) : undefined;
  const rest = facts
    .filter((key) => key !== leadFact)
    .map((key) => ({ key, value: factValue(project, key) }))
    .filter((fact): fact is { key: ProjectFactKey; value: string } => Boolean(fact.value));

  if (!lead && rest.length === 0) return null;

  return (
    <div id={id} className={cx(ROW_CLASS, className)} style={style}>
      {lead && leadFact && (
        <Reveal reveal={leadReveal} once={revealOnce}>
          <dl className={cx(LEAD_CLASS, leadClassName, factClassName?.[leadFact])}>
            <dt className={labelClass}>{label(leadFact)}</dt>
            <dd className={valueClass}>{lead}</dd>
          </dl>
        </Reveal>
      )}
      {rest.length > 0 && (
        <Reveal
          reveal={groupReveal}
          once={revealOnce}
          className={groupRevealClassName}
        >
          <dl className={cx(GROUP_CLASS, groupClassName)}>
            {rest.map((fact) => (
              <div key={fact.key} className={cx(FACT_CLASS, factClassName?.[fact.key])}>
                <dt className={labelClass}>{label(fact.key)}</dt>
                <dd className={valueClass}>{fact.value}</dd>
                {/* Only the status takes a qualifying line, and only where the
                    bare label would claim more than the work can support. */}
                {fact.key === "status" && project.statusNote && (
                  <dd className="text-white/55 text-[15px] font-light leading-[1.45] max-w-[34ch]">
                    {project.statusNote}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </Reveal>
      )}
    </div>
  );
}
