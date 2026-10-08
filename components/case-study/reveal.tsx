import type { ReactNode } from "react";
import ScrollFade from "@/components/ui/scroll-fade";
import type { CaseStudyReveal } from "./types";

/**
 * Wraps a scroll reveal around content only when a direction is asked for, so
 * a block adds no DOM and no motion by default. Reuses the site's existing
 * ScrollFade rather than adding motion of its own, which keeps reduced-motion
 * behaviour identical to every other section on the site.
 *
 * Internal to this folder: pages get reveal behaviour through a block's
 * `reveal` prop, not by reaching for the wrapper themselves.
 */
export function Reveal({
  reveal = "none",
  once = false,
  className,
  children,
}: {
  reveal?: CaseStudyReveal;
  once?: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (reveal === "none") {
    return className ? <div className={className}>{children}</div> : <>{children}</>;
  }
  return (
    <ScrollFade direction={reveal} once={once} className={className}>
      {children}
    </ScrollFade>
  );
}
