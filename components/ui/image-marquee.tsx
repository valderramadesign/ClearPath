import Image, { type StaticImageData } from "next/image";
import { cx } from "@/components/case-study/types";

export interface ImageMarqueeProps {
  /**
   * One wide strip. It is rendered twice end to end and the track travels
   * exactly one copy plus one gap, so the second copy lands where the first
   * started and the loop never shows a seam.
   */
  src: StaticImageData;
  /** Names the strip for assistive tech. The duplicate is hidden from it. */
  alt: string;
  /**
   * Width of the gap that follows each copy, as a `width / height` ratio
   * against the strip's own height — so it stays in step with the artwork at
   * every breakpoint. Set it to the spacing the source image already uses
   * between its items and the join reads as one more gap. Omitted, the copies
   * butt together, which only looks right when the strip has its own margins.
   */
  gapAspect?: string;
  /** Seconds for one strip to travel its own width. Lower reads faster. */
  duration?: number;
  /** "right" is the reading direction; "left" is the ticker default. */
  direction?: "left" | "right";
  /** Strip height. Width follows the image's own ratio. */
  heightClassName?: string;
  className?: string;
}

/**
 * An endlessly looping strip of a single wide image, paused on hover and
 * stilled under `prefers-reduced-motion`. Decorative motion only: nothing here
 * is interactive, and the strip carries its meaning in the image itself.
 */
export function ImageMarquee({
  src,
  alt,
  gapAspect,
  duration = 45,
  direction = "right",
  heightClassName = "h-[220px] sm:h-[300px] lg:h-[400px]",
  className,
}: ImageMarqueeProps) {
  const imageClass = cx("block w-auto max-w-none shrink-0", heightClassName);

  // A definite height plus a ratio is what lets the track measure itself, so
  // the spacer is sized the same way the images are rather than in fixed px.
  const gap = gapAspect ? (
    <span
      aria-hidden
      className={cx("block shrink-0", heightClassName)}
      style={{ aspectRatio: gapAspect }}
    />
  ) : null;

  return (
    <div className={cx("group relative w-full overflow-hidden", className)}>
      <div
        className="marquee-track flex w-max group-hover:[animation-play-state:paused]"
        style={{
          animation: `ticker-scroll ${duration}s linear infinite${
            direction === "right" ? " reverse" : ""
          }`,
          willChange: "transform",
        }}
      >
        <Image src={src} alt={alt} className={imageClass} />
        {gap}
        <Image src={src} alt="" aria-hidden className={imageClass} />
        {gap}
      </div>
    </div>
  );
}
