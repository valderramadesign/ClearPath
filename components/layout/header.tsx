"use client";

import Link from "next/link";
import ContactLine from "@/components/ui/contact-line";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/theme-toggle";

export type Panel = "about";

export const PANEL_LABELS: Record<Panel, string> = {
  about: "About Us",
};

/* Split padding compensates League Spartan's high ascent so the label sits on
   the pill's midline; total height is unchanged. */
const PILL_BASE =
  "theme-pill text-base font-normal font-sans leading-none px-4 pt-[10.28px] pb-[5.72px] rounded-full whitespace-nowrap border transition-colors duration-150";

export function panelPillClass(active: boolean) {
  return `${PILL_BASE} ${
    active
      ? "theme-pill-active bg-white text-black border-white"
      : "bg-[#262626] text-white border-transparent hover:border-white"
  }`;
}

/** Home and Services are pages; About Us opens the sleeve on the homepage.
    `onPanel` is only passed on the homepage. */
export function PrimaryNav({
  panel,
  onPanel,
  current,
}: {
  panel?: Panel | null;
  onPanel?: (panel: Panel) => void;
  current?: "services";
}) {
  const onHome = Boolean(onPanel);
  return (
    <>
      {onHome ? (
        <button
          type="button"
          onClick={() => (panel ? onPanel?.(panel) : window.scrollTo({ top: 0, behavior: "smooth" }))}
          aria-current={panel ? undefined : "page"}
          className={panelPillClass(!panel)}
        >
          Home
        </button>
      ) : (
        <Link href="/" className={panelPillClass(false)}>
          Home
        </Link>
      )}
      {onPanel ? (
        <button
          type="button"
          onClick={() => onPanel("about")}
          aria-expanded={panel === "about"}
          aria-controls="info-panel"
          className={panelPillClass(panel === "about")}
        >
          {PANEL_LABELS.about}
        </button>
      ) : (
        <Link href="/#about" className={panelPillClass(false)}>
          {PANEL_LABELS.about}
        </Link>
      )}
      <Link
        href="/services"
        aria-current={current === "services" ? "page" : undefined}
        className={panelPillClass(current === "services")}
      >
        Services
      </Link>
    </>
  );
}

interface HeaderProps {
  panel?: Panel | null;
  onPanel?: (panel: Panel) => void;
  current?: "services";
}

export default function Header({ panel = null, onPanel, current }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-6 w-full shrink-0">
      <nav aria-label="Primary" className="flex items-center gap-[12px]">
        <PrimaryNav panel={panel} onPanel={onPanel} current={current} />
        <ThemeToggle />
      </nav>
      <div className="flex items-center gap-[24px]">
        <Link href="/" aria-label="ClearPath Transformation home">
          <Logo />
        </Link>
        {/* Hidden while a panel is open: the homepage is squeezed to a third
            of the width, and the panel ends on the same call to action. */}
        {!panel && <ContactLine />}
      </div>
    </header>
  );
}
