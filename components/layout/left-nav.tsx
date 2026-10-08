"use client";

import PillButton from "@/components/ui/pill-button";
import { HOMEPAGE_EXPERIMENTS, HOMEPAGE_FLAGSHIPS, type Project } from "@/lib/content";

type LeftNavProps = {
  onHover?: (id: string | null) => void;
};

export default function LeftNav({ onHover }: LeftNavProps) {
  const pills = (projects: Project[]) =>
    projects.map(({ id, title, route }) => (
      <PillButton
        key={id}
        label={title}
        href={route}
        onMouseEnter={() => onHover?.(id)}
        onMouseLeave={() => onHover?.(null)}
      />
    ));

  const column = (label: string, projects: Project[]) => (
    <div className="flex flex-col gap-3 items-start">
      <p className="mb-[6px] text-white/60 text-[12px] uppercase tracking-[0.18em] font-sans">{label}</p>
      {pills(projects)}
    </div>
  );

  // Columns wrap to a stack when there is no room for both side by side.
  return (
    <nav aria-label="Selected work" className="flex flex-wrap items-start gap-x-12 gap-y-8 shrink-0">
      {column("Case studies", HOMEPAGE_FLAGSHIPS)}
      {HOMEPAGE_EXPERIMENTS.length > 0 && column("Experiments", HOMEPAGE_EXPERIMENTS)}
    </nav>
  );
}
