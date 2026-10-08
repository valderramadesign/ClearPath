import type { ReactNode } from "react";
import { CaseStudySection } from "./case-study-section";
import {
  CASE_STUDY_BODY_CLASS,
  CASE_STUDY_FOCUS_CLASS,
  CASE_STUDY_LABEL_CLASS,
  cx,
  type CaseStudySectionLayout,
} from "./types";

export interface SupportingAppendixProps extends CaseStudySectionLayout {
  /** Section label. Optional — the disclosure can stand on its own. */
  title?: ReactNode;
  /**
   * The disclosure's label, and its accessible name. Say what is inside, e.g.
   * "Tools and process detail" rather than "More".
   */
  summary: ReactNode;
  /**
   * Plain-text accessible name, for the rare case where `summary` is markup
   * that would not read as a sensible name on its own.
   */
  summaryLabel?: string;
  /** Renders open on first paint. The browser owns the state after that. */
  defaultOpen?: boolean;
  summaryClassName?: string;
  contentClassName?: string;
  /** The detail being kept out of the main narrative. */
  children: ReactNode;
}

const DETAILS_CLASS = "w-full border-t border-white/15 pt-4 lg:pt-6";
const SUMMARY_CLASS = cx(
  "cursor-pointer text-base lg:text-[24px] font-light leading-[1.5] lg:leading-[1.4] text-white/80 transition-colors hover:text-white",
  CASE_STUDY_FOCUS_CLASS,
);
const CONTENT_CLASS = "mt-4 lg:mt-6 flex flex-col gap-4 lg:gap-6";

/**
 * The detail that supports a case study without belonging in it: secondary
 * explorations, tooling, timelines, and anything a reader can safely skip.
 *
 * Built on native `<details>`/`<summary>`, so it is focusable, operable with
 * Enter and Space, announced as a disclosure with its expanded state, and
 * findable by in-page search in browsers that expand on match — none of which a
 * hand-rolled toggle gets for free. The marker is left as the browser draws it.
 */
export function SupportingAppendix({
  title,
  summary,
  summaryLabel,
  defaultOpen = false,
  summaryClassName,
  contentClassName,
  titleClassName = CASE_STUDY_LABEL_CLASS,
  children,
  ...layout
}: SupportingAppendixProps) {
  return (
    <CaseStudySection {...layout} title={title} titleClassName={titleClassName}>
      <details className={DETAILS_CLASS} open={defaultOpen}>
        <summary className={cx(SUMMARY_CLASS, summaryClassName)} aria-label={summaryLabel}>
          {summary}
        </summary>
        <div className={cx(CONTENT_CLASS, CASE_STUDY_BODY_CLASS, contentClassName)}>
          {children}
        </div>
      </details>
    </CaseStudySection>
  );
}
