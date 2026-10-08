/**
 * Type size and vertical padding for the paired CTA pills that close each case
 * study ("Back to Homepage" plus its prototype link).
 *
 * Every label these pills carry descends below the baseline — "Prototype",
 * "Back to Homepage" — so the shape the eye reads as the word is the full ink
 * box, cap top to descender bottom, not the cap-to-baseline box. Centring the
 * cap box leaves the word hanging low by half a descender: 3.2px at the 32px
 * size, on a 66px pill. The padding below centres the ink box instead, and
 * each pair sums to the original symmetric padding (24px under lg, 32px at lg)
 * so no button changes height.
 *
 * The correction has to be stated per type size rather than in `em`: the
 * browser rounds the font's ascent to whole pixels, which makes the offset
 * non-proportional (1.81px at 18px, 2.00px at 20px, 3.19px at 32px). Each
 * figure is the midpoint of the two labels' measured shifts, which sit within
 * a third of a pixel of each other.
 */
export const CTA_PILL_SIZE = {
  lg: "text-lg pt-[12.13px] pb-[11.87px] lg:text-[32px] lg:pt-[16.37px] lg:pb-[15.63px]",
  xl: "text-xl pt-[11.6px] pb-[12.4px] lg:text-[32px] lg:pt-[16.37px] lg:pb-[15.63px]",
} as const;

