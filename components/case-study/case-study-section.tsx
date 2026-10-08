import type { ReactNode } from "react";
import { Reveal } from "./reveal";
import {
  CASE_STUDY_LABEL_CLASS,
  CASE_STUDY_LABEL_TIGHT_CLASS,
  CASE_STUDY_STACK_CLASS,
  cx,
  type CaseStudySectionLayout,
} from "./types";

export interface CaseStudySectionProps extends CaseStudySectionLayout {
  /**
   * Short label above the title. Rendered as a paragraph, not a heading, so it
   * never competes with the section's own heading in the document outline.
   */
  eyebrow?: ReactNode;
  eyebrowClassName?: string;
  /** The section's heading. Omitted sections render no heading at all. */
  title?: ReactNode;
  children?: ReactNode;
}

/**
 * The single wrapper every other case study block funnels through: element
 * choice, scroll reveal, heading level, heading styling, and the accessible
 * name that ties a `<section>` to its heading. Blocks compose this rather than
 * repeating wrapper behaviour, so the rules only exist in one place.
 *
 * Also usable directly, for page content that needs the same wrapper but has
 * no block of its own.
 */
export function CaseStudySection({
  id,
  as: Tag = "section",
  className,
  style,
  reveal = "none",
  revealOnce = false,
  revealClassName,
  eyebrow,
  eyebrowClassName,
  title,
  titleAs: Heading = "h2",
  titleClassName,
  titleHidden = false,
  children,
}: CaseStudySectionProps) {
  const titleId = id && title != null ? `${id}-title` : undefined;
  const headingClass = titleHidden
    ? cx("sr-only", titleClassName)
    : (titleClassName ?? CASE_STUDY_LABEL_CLASS);

  return (
    <Reveal reveal={reveal} once={revealOnce} className={revealClassName}>
      <Tag
        id={id}
        className={cx(CASE_STUDY_STACK_CLASS, className)}
        style={style}
        aria-labelledby={Tag === "section" || Tag === "article" ? titleId : undefined}
      >
        {eyebrow != null && (
          <p className={cx(CASE_STUDY_LABEL_TIGHT_CLASS, eyebrowClassName)}>{eyebrow}</p>
        )}
        {title != null && (
          <Heading id={titleId} className={headingClass}>
            {title}
          </Heading>
        )}
        {children}
      </Tag>
    </Reveal>
  );
}
