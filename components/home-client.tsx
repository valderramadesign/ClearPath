"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Header, { PANEL_LABELS, PrimaryNav, type Panel } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LeftNav from "@/components/layout/left-nav";
import InfoPanel from "@/components/ui/info-panel";
import ContactCta from "@/components/ui/contact-cta";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/theme-toggle";
import { CLEARPATH } from "@/lib/content";

const EYEBROW = "text-white/60 text-[12px] uppercase tracking-[0.18em] font-sans";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Panel share of the desktop width. Capped so the homepage keeps 480px, the
    narrowest the header row fits in without wrapping. */
function panelWidthFor(viewport: number) {
  return Math.round(Math.min(viewport * 0.6, viewport - 480));
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return desktop;
}

function Expertise({ className = "" }: { className?: string }) {
  return (
    <ul
      aria-label="Expertise"
      className={`flex flex-wrap items-center gap-x-7 gap-y-2 ${EYEBROW} ${className}`}
    >
      {CLEARPATH.home.expertise.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Headline({ id, className, style }: { id: string; className: string; style?: React.CSSProperties }) {
  const reduced = useReducedMotion();
  return (
    <h1 id={id} className={className} style={style}>
      {CLEARPATH.home.headline.map((line, i) => (
        <motion.span
          key={line}
          className="block"
          initial={{ opacity: 0, y: reduced ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12 + i * 0.14, ease: EASE }}
        >
          {line}
        </motion.span>
      ))}
    </h1>
  );
}

function FadeIn({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** The brief's promise, set apart from the hero on a plain ground so the
    longest sentence on the page never competes with the shader. */
function PromiseSection() {
  return (
    <section
      aria-labelledby="promise-label"
      className="relative z-10 bg-black border-t border-white/10 px-5 py-[clamp(72px,14vh,148px)] sm:px-6 lg:px-[24px]"
    >
      <div className="@container grid gap-x-12 gap-y-6 @[760px]:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
        <h2 id="promise-label" className={`${EYEBROW} pt-[10px]`}>
          How we work
        </h2>
        <div>
          <p className="max-w-[28ch] font-serif text-white text-[clamp(30px,4.4cqw,54px)] leading-[1.06] tracking-[-0.015em]">
            {CLEARPATH.home.promise}
          </p>
          <ContactCta className="mt-10" />
        </div>
      </div>
    </section>
  );
}

export default function HomeClient() {
  const [panel, setPanel] = useState<Panel | null>(null);
  const [panelWidth, setPanelWidth] = useState(768);
  const desktop = useIsDesktop();
  const opener = useRef<HTMLElement | null>(null);

  const togglePanel = useCallback((next: Panel) => {
    setPanel((current) => {
      if (current === next) return null;
      if (!current) opener.current = document.activeElement as HTMLElement | null;
      return next;
    });
  }, []);

  const closePanel = useCallback(() => {
    setPanel(null);
    requestAnimationFrame(() => opener.current?.focus());
  }, []);

  // Other pages link to /#about to open the sleeve here.
  useEffect(() => {
    if (window.location.hash !== "#about") return;
    setPanel("about");
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  useEffect(() => {
    const sync = () => setPanelWidth(panelWidthFor(window.innerWidth));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (!panel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, closePanel]);

  // Only the mobile sheet covers the page; the desktop panel sits beside it.
  useEffect(() => {
    if (!panel || desktop) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [panel, desktop]);

  return (
    <div className="theme-site flex min-h-[100svh] flex-row bg-black text-white overflow-x-clip">
      {/* Desktop panel — slides in from the left and squeezes the homepage */}
      <AnimatePresence initial={false}>
        {desktop && panel && (
          <motion.div
            key="info-panel-desktop"
            className="sticky top-0 z-20 h-screen shrink-0 self-start overflow-hidden border-r border-white/10"
            initial={{ width: 0 }}
            animate={{ width: panelWidth }}
            exit={{ width: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Fixed inner width, so the copy does not reflow while the
                panel opens and closes. */}
            <div className="h-full" style={{ width: panelWidth }}>
              <InfoPanel panel={panel} onClose={closePanel} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex-1 min-w-0">
        <div className="relative">
          {/* Day and night photos swap in CSS (globals.css), so only the active one downloads. */}
          <div aria-hidden="true" className="home-hero-bg absolute inset-0" />

          {/* ── Desktop hero ── */}
          <main className="@container relative z-10 hidden lg:flex flex-col min-h-screen p-[24px]">
            <Header panel={panel} onPanel={togglePanel} />

            <div className="mt-[clamp(32px,calc(18vh_-_120px),140px)]">
              <LeftNav />
            </div>

            <div className="flex-1 min-h-[40px]" />

            <section aria-labelledby="hero-title" className="pb-[14px]">
              {/* w-fit sizes to the headline; the copy's w-0 min-w-full fills that width without widening it. */}
              <div className="w-fit">
                <Headline
                  id="hero-title"
                  className="text-white font-serif leading-[0.95] tracking-[-0.02em]"
                  style={{ fontSize: "clamp(40px, min(7.6cqw, 11.5vh), 116px)" }}
                />
                <FadeIn delay={0.55} className="mt-[30px] flex flex-col items-start gap-[30px]">
                  <p className="w-0 min-w-full text-white font-light font-sans text-[clamp(20px,1.9cqw,24px)] leading-[1.32] tracking-[-0.015em]">
                    {CLEARPATH.home.supporting}
                  </p>
                  <ContactCta />
                </FadeIn>
              </div>
              <FadeIn delay={0.7}>
                <Expertise className="mt-[30px] pt-[20px] border-t border-white/10" />
              </FadeIn>
            </section>
          </main>

          {/* ── Mobile + tablet hero ── */}
          <div className="lg:hidden relative z-10 flex min-h-[100svh] flex-col px-5 pt-5 pb-10 sm:px-6 sm:pt-6">
            <header className="flex items-center justify-between">
              <Logo />
              <ThemeToggle />
            </header>
            <nav aria-label="Primary" className="mt-5 flex items-center gap-2">
              <PrimaryNav panel={panel} onPanel={togglePanel} />
            </nav>
            <div className="mt-10">
              <LeftNav />
            </div>

            <div className="flex-1 min-h-[64px]" />

            <section aria-labelledby="hero-title-mobile" className="flex flex-col">
              <div className="w-fit">
                <Headline
                  id="hero-title-mobile"
                  className="text-white font-serif leading-[0.95] tracking-[-0.02em]"
                  style={{ fontSize: "clamp(42px, 12.4vw, 84px)" }}
                />
                <FadeIn delay={0.55}>
                  <p className="mt-6 w-0 min-w-full text-white font-light font-sans text-xl leading-[1.35] tracking-[-0.015em] sm:text-2xl">
                    {CLEARPATH.home.supporting}
                  </p>
                  <ContactCta className="mt-8" />
                </FadeIn>
              </div>
              <FadeIn delay={0.7}>
                <Expertise className="mt-9 pt-5 border-t border-white/10 gap-x-5" />
              </FadeIn>
            </section>
          </div>
        </div>

        <PromiseSection />
        <Footer />
      </div>

      {/* Mobile sheet — full screen, rises from the bottom */}
      <AnimatePresence>
        {!desktop && panel && (
          <motion.div
            key="info-panel-mobile"
            role="dialog"
            aria-modal="true"
            aria-label={PANEL_LABELS[panel]}
            className="fixed inset-0 z-50"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <InfoPanel panel={panel} onClose={closePanel} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
