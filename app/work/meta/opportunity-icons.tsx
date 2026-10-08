import type { SVGProps } from "react";

/* ── The case study's line drawings ──────────────────────────────────────

   Two sets on one grid: the six that open The Opportunity, and the six that
   mark the recovery paths further down. Each is set at the size the page
   actually renders it: one idea each, no detail that survives only at full
   size. Everything is stroked in currentColor on a 32-unit grid with round
   caps and joins, so the weight reads the same across both sets and the
   corners stay soft.

   The line is a hairline and stays one: a 32-unit drawing painted at 44 or
   52px would carry its stroke up with it, so the shapes opt out of the
   scaling and are stroked a literal pixel wide instead. vector-effect does
   not inherit, which is why the rule reaches the shapes as a descendant
   selector rather than sitting on the svg for them to pick up.

   ── The Opportunity ──

   The two columns rhyme deliberately. The buried envelope on the left is
   the same envelope carried across the top of the page on the right; the
   nine tiles that collect become the three that confirm. */

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

/** A page with the invitation tucked into a corner of it. */
export function IconBuriedOffer(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="26" height="22" rx="3.6" />
      <path d="M3 11h26" />
      <rect x="17.5" y="16" width="8.5" height="6.6" rx="1.6" />
      <path d="M18.1 16.9 21.75 19.6l3.65-2.7" />
    </Icon>
  );
}

/** Nine tiles: the application that asked nine times. */
export function IconNineScreens(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="12.5" y="3" width="7" height="7" rx="2" />
      <rect x="22" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="12.5" width="7" height="7" rx="2" />
      <rect x="12.5" y="12.5" width="7" height="7" rx="2" />
      <rect x="22" y="12.5" width="7" height="7" rx="2" />
      <rect x="3" y="22" width="7" height="7" rx="2" />
      <rect x="12.5" y="22" width="7" height="7" rx="2" />
      <rect x="22" y="22" width="7" height="7" rx="2" />
    </Icon>
  );
}

/** A card, paused. */
export function IconCardPaused(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="7" width="26" height="18" rx="3.6" />
      <path d="M3 12.8h26" />
      <path d="M19 17.6v4.6M23.2 17.6v4.6" />
    </Icon>
  );
}

/** The same envelope, carried across the top of the page instead. */
export function IconOfferUpstream(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="26" height="22" rx="3.6" />
      <rect x="6.6" y="8.6" width="18.8" height="9.4" rx="2.2" />
      <path d="M6.6 10.6 16 15.4l9.4-4.8" />
      <path d="M7 22.4h9.6" />
    </Icon>
  );
}

/** Verified already: a shield that has been checked. */
export function IconAlreadyVerified(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16 3.2 27 7.1v8.6c0 6.4-4.5 10.7-11 13.1-6.5-2.4-11-6.7-11-13.1V7.1z" />
      <path d="M11.2 15.6 14.8 19.2 21.2 12.6" />
    </Icon>
  );
}

/** Three pages, the last one confirmed. */
export function IconThreePages(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.6" y="7.5" width="8" height="17" rx="2.2" />
      <rect x="12" y="7.5" width="8" height="17" rx="2.2" />
      <rect x="21.4" y="7.5" width="8" height="17" rx="2.2" />
      <path d="M23.3 16.3 24.9 17.9 27.6 14.6" />
    </Icon>
  );
}

/* ── What happens when the record is wrong ───────────────────────────────

   Six more drawings on the same grid, for the recovery paths below the
   workflow diagram. They mark blocks of prose rather than single lines, so
   they sit in the left gutter of each block instead of beside a sentence —
   the drawing language is unchanged. Two of them answer icons above: the
   shield struck through is the shield that was checked, and the record with
   a clock on it is the verification the engine had already done, later. */

/** A record with a clock on it: verification data that has aged. */
export function IconStaleRecord(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.6" y="3" width="15" height="19" rx="2.4" />
      <path d="M6.2 8.6h7.8M6.2 12.8h7.8M6.2 17h5" />
      <circle cx="23.4" cy="23.4" r="5.8" />
      <path d="M23.4 19.9v3.5l2.4 1.4" />
    </Icon>
  );
}

/** Two fields on one record, struck: what is held and what is given disagree. */
export function IconMismatchedField(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.2" y="9.4" width="25.6" height="13.2" rx="2.8" />
      <path d="M7.4 13h17.2M7.4 19h17.2" />
      <path d="M21 10.9 11 21.1" />
    </Icon>
  );
}

/** An hourglass: the explicit pending state, waiting on a decision. */
export function IconPendingReview(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8.6 3.4h14.8M8.6 28.6h14.8" />
      <path d="M10.6 3.4v4.3c0 3.6 5.4 5.1 5.4 8.3s-5.4 4.7-5.4 8.3v4.3" />
      <path d="M21.4 3.4v4.3c0 3.6-5.4 5.1-5.4 8.3s5.4 4.7 5.4 8.3v4.3" />
    </Icon>
  );
}

/** The same shield, struck through: the entity that does not clear. */
export function IconFailedCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16 3.2 27 7.1v8.6c0 6.4-4.5 10.7-11 13.1-6.5-2.4-11-6.7-11-13.1V7.1z" />
      <path d="M12.4 12.4 19.6 19.6M19.6 12.4 12.4 19.6" />
    </Icon>
  );
}

/** The record shown in full, with a pencil beside it. */
export function IconInspectAndCorrect(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.6" y="4" width="13" height="24" rx="2.4" />
      <path d="M5.9 10.4h6.8M5.9 15h6.8M5.9 19.6h4.4" />
      <path d="M26.4 4.4 28.6 6.6 19.4 15.8 16.1 16.9 17.2 13.6z" />
      <path d="m24.2 6.6 2.2 2.2" />
    </Icon>
  );
}

/** Two switches, one given and one withheld: consent carried on the record. */
export function IconConsentInline(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.4 11h10.6" />
      <rect x="17.4" y="7.8" width="11" height="6.4" rx="3.2" />
      <circle cx="25.2" cy="11" r="1.9" />
      <path d="M3.4 21h7.4" />
      <rect x="17.4" y="17.8" width="11" height="6.4" rx="3.2" />
      <circle cx="20.6" cy="21" r="1.9" />
    </Icon>
  );
}
