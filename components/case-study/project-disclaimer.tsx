import type { Project } from "@/lib/content";
import { cx } from "./types";

export interface ProjectDisclaimerProps {
  project: Project;
  className?: string;
}

/**
 * The affiliation notice independent work carries, read from the record.
 *
 * A concept that names a real company has to say so before the reader has
 * formed a view of what the work was, so this sits directly under the facts
 * row rather than in an appendix. It is quiet — a rule and one line at the
 * caption size — because it is a fact about the project, not a warning.
 *
 * Renders nothing for projects that carry no disclaimer, so a page can compose
 * it unconditionally and a project that becomes client work simply drops it.
 */
export function ProjectDisclaimer({ project, className }: ProjectDisclaimerProps) {
  if (!project.disclaimer) return null;

  return (
    <p
      className={cx(
        "border-t border-white/10 pt-5 text-white/50 text-[15px] font-light leading-[1.5] max-w-[68ch]",
        className,
      )}
    >
      {project.disclaimer}
    </p>
  );
}
