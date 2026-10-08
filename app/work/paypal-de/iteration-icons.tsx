import type { SVGProps } from "react";

/* ── Iteration icons ─────────────────────────────────────────────────────

   Seven line drawings, one per iteration in Behind the Work. Drawn to the
   same rules as the Meta case study's opportunity icons so the two pages
   read as one publication: a 32-unit grid, currentColor, round caps and
   joins, and a stroke that stays a hairline at any rendered size — hence
   the non-scaling-stroke reaching the shapes as a descendant selector,
   since vector-effect does not inherit.

   The set rhymes on purpose. The checkout sheet carries the Pay in 30 Days
   changes; the Ratenzahlung ones answer it with the application itself —
   one amount split four ways, and four pages collapsed into one. */

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

/** The bank, now standing inside the checkout sheet. */
export function IconBankInCheckout(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="26" height="22" rx="3.6" />
      <path d="M3 11h26" />
      <path d="M8.4 18.6 16 14.4l7.6 4.2" />
      <path d="M11.4 19.4v3M16 19.4v3M20.6 19.4v3" />
      <path d="M8.6 23.4h14.8" />
    </Icon>
  );
}

/** The terms, read and agreed to at the step that reviews them. */
export function IconDisclosuresAtReview(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="6" y="3.4" width="20" height="25.2" rx="3" />
      <path d="M10 9h12M10 12.6h12M10 16.2h7" />
      <path d="m10 22 2.2 2.2 4.8-5.2" />
    </Icon>
  );
}

/** A payment moved down the calendar. */
export function IconRescheduledPayment(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.4" y="6" width="25.2" height="22.4" rx="3.4" />
      <path d="M3.4 12.2h25.2" />
      <path d="M10 3.6v4.8M22 3.6v4.8" />
      <circle cx="10.6" cy="20.3" r="1.2" />
      <path d="M13.8 20.3h7.6" />
      <path d="m19 17.9 2.4 2.4-2.4 2.4" />
    </Icon>
  );
}

/** Every option offered before the choice, not after it. */
export function IconOptionsUpfront(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="4.8" width="26" height="6.2" rx="1.8" />
      <circle cx="7.6" cy="7.9" r="1.7" />
      <circle cx="7.6" cy="7.9" r="0.75" />
      <rect x="3" y="13.6" width="26" height="6.2" rx="1.8" />
      <circle cx="7.6" cy="16.7" r="1.7" />
      <rect x="3" y="22.4" width="26" height="6.2" rx="1.8" />
      <circle cx="7.6" cy="25.5" r="1.7" />
    </Icon>
  );
}

/** One amount, divided into the four terms customers can pick from. */
export function IconFourInstallments(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="11.6" width="26" height="8.8" rx="2.8" />
      <path d="M9.5 11.6v8.8M16 11.6v8.8M22.5 11.6v8.8" />
    </Icon>
  );
}

/** Four pages of application, answered on the one in front. */
export function IconOnePageApplication(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10.6 3h12.6a2.8 2.8 0 0 1 2.8 2.8v16.4" />
      <path d="M7.4 6.2h12.6a2.8 2.8 0 0 1 2.8 2.8v16.4" />
      <rect x="3.2" y="9.4" width="16.6" height="19.4" rx="2.8" />
      <path d="m7.4 19.4 3 3 5.8-6.2" />
    </Icon>
  );
}

/** The same checkout, moved up to the framework it runs on now. */
export function IconCheckoutUpgrade(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="26" height="22" rx="3.6" />
      <path d="M3 11h26" />
      <path d="M16 23.4v-9.2" />
      <path d="m11.8 18.4 4.2-4.2 4.2 4.2" />
    </Icon>
  );
}
