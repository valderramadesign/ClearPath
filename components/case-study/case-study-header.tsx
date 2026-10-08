import type { ReactNode } from "react";
import { caseStudyEyebrowText, type Project } from "@/lib/content";
import { CaseStudySection } from "./case-study-section";
import { CASE_STUDY_HEADLINE_CLASS, type CaseStudySectionLayout } from "./types";

export interface CaseStudyHeaderProps extends CaseStudySectionLayout {
  /** The project record the eyebrow and headline are read from. */
  project: Project;
  /** Overrides the eyebrow from the shared record. */
  eyebrow?: ReactNode;
  eyebrowClassName?: string;
  /** Overrides the headline from the shared record. */
  headline?: ReactNode;
  /** Anything that belongs under the headline, e.g. a standfirst. */
  children?: ReactNode;
}

/**
 * Opens a case study with its eyebrow and H1. Both come from the shared project
 * record by default, so a page title can never drift from the record the site
 * metadata is built from.
 *
 * Renders a `<header>`, which is generic when nested inside a sectioning
 * element. Pass `as="div"` if the block ever sits directly under `<body>`,
 * where `<header>` would become a banner landmark.
 */
export function CaseStudyHeader({
  project,
  eyebrow,
  eyebrowClassName,
  headline,
  as = "header",
  titleAs = "h1",
  titleClassName = CASE_STUDY_HEADLINE_CLASS,
  children,
  ...layout
}: CaseStudyHeaderProps) {
  return (
    <CaseStudySection
      {...layout}
      as={as}
      eyebrow={eyebrow ?? caseStudyEyebrowText(project)}
      eyebrowClassName={eyebrowClassName}
      title={headline ?? project.caseStudyHeadline}
      titleAs={titleAs}
      titleClassName={titleClassName}
    >
      {children}
    </CaseStudySection>
  );
}
