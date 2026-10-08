import type { SVGProps } from "react";

/* ── The Opportunity icons ───────────────────────────────────────────────

   Seven line drawings, set at the size the panel rows actually render
   them: one idea each, no detail that survives only at full size.
   Everything is stroked in currentColor on a 32-unit grid with round caps
   and joins, so the weight reads the same across the set and the corners
   stay soft.

   The line is a hairline and stays one: a 32-unit drawing painted at 44 or
   52px would carry its stroke up with it, so the shapes opt out of the
   scaling and are stroked a literal pixel wide instead. vector-effect does
   not inherit, which is why the rule reaches the shapes as a descendant
   selector rather than sitting on the svg for them to pick up.

   The two columns rhyme deliberately. The clock counting out the end of
   the day becomes a single tap; the page written twice becomes one update
   carried to three children; the eye that could not see becomes a live
   signal. */

const GRID = 32;
const STROKE = 1;
const HAIRLINE = "[&_*]:[vector-effect:non-scaling-stroke]";

type IconProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "fill">;

function Icon({ children, className, ...props }: IconProps) {
  return (
    <svg
      viewBox={`0 0 ${GRID} ${GRID}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ? `${HAIRLINE} ${className}` : HAIRLINE}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** A clock run late: the reporting that waited for the end of the day. */
export function IconEndOfDay(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="16" cy="16" r="12.5" />
      <path d="M16 8.4V16l5.6 3.3" />
    </Icon>
  );
}

/** The same page written a second time. */
export function IconWrittenTwice(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5.5" y="3.5" width="13.5" height="18.5" rx="2.2" />
      <rect x="13" y="10" width="13.5" height="18.5" rx="2.2" />
      <path d="M16.6 17.2h6.3M16.6 21.3h4.2" />
    </Icon>
  );
}

/** An eye struck through: the hours parents could not see into. */
export function IconUnseen(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.6 16S7.6 8.6 16 8.6 29.4 16 29.4 16 24.4 23.4 16 23.4 2.6 16 2.6 16Z" />
      <circle cx="16" cy="16" r="3.5" />
      <path d="M5.4 27 26.6 5" />
    </Icon>
  );
}

/** A handset answering one touch. */
export function IconFewTaps(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="9.5" y="2.5" width="13" height="27" rx="3.4" />
      <path d="M13.8 5.4h4.4" />
      <circle cx="16" cy="19.2" r="1.9" />
      <path d="M12.4 15.6a5.1 5.1 0 0 1 7.2 0" />
    </Icon>
  );
}

/** One update, confirmed across the group it applies to. */
export function IconOneToMany(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m11.2 6.2 3.2 3.2L20.8 3" />
      <circle cx="7.2" cy="16" r="2.7" />
      <path d="M2.9 25.6a4.4 4.4 0 0 1 8.6 0" />
      <circle cx="16" cy="16" r="2.7" />
      <path d="M11.7 25.6a4.4 4.4 0 0 1 8.6 0" />
      <circle cx="24.8" cy="16" r="2.7" />
      <path d="M20.5 25.6a4.4 4.4 0 0 1 8.6 0" />
    </Icon>
  );
}

/** A signal going out the moment it is logged. */
export function IconLiveFeed(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="16" cy="16" r="2.2" />
      <path d="M10.9 10.9a7.2 7.2 0 0 0 0 10.2M21.1 21.1a7.2 7.2 0 0 0 0-10.2" />
      <path d="M6.9 6.9a12.9 12.9 0 0 0 0 18.2M25.1 25.1a12.9 12.9 0 0 0 0-18.2" />
    </Icon>
  );
}

/** The day's record, drafted for the teacher to check. */
export function IconDraftedSummary(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 5.5a2 2 0 0 1 2-2h8.6l7.4 7.4v15.6a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2z" />
      <path d="M17.1 3.5v7.4h7.4" />
      <path d="M10.8 16.4h5.4M10.8 20.6h3.6" />
      <path d="m20.8 17.5 1.05 2.45 2.45 1.05-2.45 1.05-1.05 2.45-1.05-2.45-2.45-1.05 2.45-1.05z" />
    </Icon>
  );
}
