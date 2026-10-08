import type { CSSProperties, ReactNode } from "react";

/* ── Shared vocabulary ────────────────────────────────────────────────────
   Types and class constants every case study block shares. They live with the
   components rather than in lib/content.ts, which stays the project record. */

/** Re-exported so case study blocks pull their whole vocabulary from one place. */
export { cx } from "@/lib/cx";

/** Exactly one, two, or three items. Used where a block caps its own length. */
export type OneToThree<T> = readonly [T] | readonly [T, T] | readonly [T, T, T];

/** Exactly one or two items. */
export type OneOrTwo<T> = readonly [T] | readonly [T, T];

/** Exactly two to five items. */
export type TwoToFive<T> =
  | readonly [T, T]
  | readonly [T, T, T]
  | readonly [T, T, T, T]
  | readonly [T, T, T, T, T];

/** Heading element a block renders its title as, so pages keep one H1. */
export type CaseStudyHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/** Element a block renders as. Blocks are neutral about their own landmark. */
export type CaseStudyElement = "section" | "article" | "div" | "header" | "aside";

/**
 * Scroll reveal direction, matching the site's existing ScrollFade. "none"
 * renders no motion wrapper at all, which is the default: motion is opt-in so
 * a block never introduces animation a page did not ask for.
 */
export type CaseStudyReveal = "none" | "left" | "right";

/**
 * Wrapper behaviour every block forwards to CaseStudySection. Blocks accept
 * this instead of redeclaring element, motion, and heading props themselves.
 */
export interface CaseStudySectionLayout {
  /** Element id. Also seeds the heading id used to name the section. */
  id?: string;
  /** Element the block renders as. Defaults per block. */
  as?: CaseStudyElement;
  /** Extra classes on the block's own element. */
  className?: string;
  style?: CSSProperties;
  /** Reveal direction. Defaults to "none". */
  reveal?: CaseStudyReveal;
  /** Reveals once instead of on every re-entry. Matches ScrollFade's `once`. */
  revealOnce?: boolean;
  /** Classes on the motion wrapper, not the block. */
  revealClassName?: string;
  /** Heading level for the block's title. */
  titleAs?: CaseStudyHeadingLevel;
  /** Classes for the title. Replaces the default label styling entirely. */
  titleClassName?: string;
  /** Keeps the title for assistive technology but not on screen. */
  titleHidden?: boolean;
}

/* ── Type scale ───────────────────────────────────────────────────────────
   Written as complete literals so Tailwind can see every class candidate.
   These mirror the scale the existing case studies already use; nothing here
   introduces a new visual style. */

/** Section label. */
export const CASE_STUDY_LABEL_CLASS = "text-sm lg:text-[18px] font-light text-white/60";

/** Section label with the tighter leading the page headers use. */
export const CASE_STUDY_LABEL_TIGHT_CLASS =
  "text-sm lg:text-[18px] font-light leading-none text-white/60";

/** Case study H1. */
export const CASE_STUDY_HEADLINE_CLASS =
  "font-serif leading-[1.02] lg:leading-[96px] tracking-[-0.015em] text-[clamp(36px,9vw,96px)] lg:text-[96px]";

/** Header fact value. */
export const CASE_STUDY_FACT_VALUE_CLASS =
  "text-lg lg:text-[32px] font-light leading-snug lg:leading-[42px]";

/** Opening statement type scale. */
export const CASE_STUDY_LEAD_CLASS =
  "text-[clamp(20px,4.5vw,48px)] lg:text-[48px] font-light leading-[1.3]";

/**
 * Gap that equals one blank line at the lead scale's 1.3 leading, so split
 * paragraphs sit exactly where a paragraph break sat before.
 */
export const CASE_STUDY_LEAD_GAP_CLASS = "gap-[1.3em]";

/** Body copy and lists. */
export const CASE_STUDY_BODY_CLASS =
  "text-base lg:text-[24px] font-light leading-[1.5] lg:leading-[1.4]";

/** Gap that equals one blank line at the body scale's 1.4 leading. */
export const CASE_STUDY_BODY_GAP_CLASS = "gap-[1.4em]";

/** Supporting copy, one step down from body. */
export const CASE_STUDY_SUPPORTING_CLASS =
  "text-sm lg:text-[18px] font-light leading-snug";

/** Outcome figure. */
export const CASE_STUDY_METRIC_VALUE_CLASS =
  "metric-figure font-serif text-[clamp(40px,9vw,72px)] lg:text-[72px] font-normal leading-none";

/** Wording under an outcome figure. Sits 17px below it, measured ink-to-ink. */
export const CASE_STUDY_METRIC_LABEL_CLASS = "metric-label mt-[17px] text-sm lg:text-[18px] font-light";

/** Default vertical rhythm inside a block. */
export const CASE_STUDY_STACK_CLASS = "flex w-full flex-col gap-[14px]";

/** Caption under a diagram or chart. */
export const CASE_STUDY_CAPTION_CLASS =
  "text-sm lg:text-[18px] font-light leading-snug text-white/60";

/** Keyboard focus ring for the interactive parts of these blocks. */
export const CASE_STUDY_FOCUS_CLASS =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70";

/** Convenience alias for blocks that take arbitrary rendered copy. */
export type CaseStudyCopy = ReactNode;
