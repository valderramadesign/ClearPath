"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ContactCta from "@/components/ui/contact-cta";
import { PANEL_LABELS, type Panel } from "@/components/layout/header";
import { CLEARPATH } from "@/lib/content";

const EYEBROW = "text-white/60 text-[12px] uppercase tracking-[0.18em] font-sans";
const LEAD =
  "font-sans font-light text-white leading-[1.32] tracking-[-0.015em] text-[clamp(21px,3.1cqw,28px)]";
const BODY = "font-sans font-light text-white/80 text-[17px] leading-[1.55] sm:text-lg";

function About() {
  const { intro, people, together } = CLEARPATH.about;
  return (
    <>
      <p className={`${LEAD} max-w-[34ch]`}>{intro}</p>

      <div className="mt-16 grid gap-x-12 gap-y-14 @[680px]:grid-cols-2">
        {people.map((person) => (
          <article key={person.name} className="border-t border-white/15 pt-7">
            <p className={EYEBROW}>{person.role}</p>
            <h3 className="mt-4 font-serif text-white text-[clamp(34px,4.4cqw,44px)] leading-[1] tracking-[-0.015em]">
              {person.name}
            </h3>
            <p className={`${BODY} mt-5`}>{person.bio}</p>
          </article>
        ))}
      </div>

      <section className="mt-16 grid gap-x-12 gap-y-5 border-t border-white/15 pt-7 @[680px]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <h3 className={EYEBROW}>Working together</h3>
        <p className={`${LEAD} max-w-[36ch]`}>{together}</p>
      </section>
    </>
  );
}

/**
 * About Us as a page-like panel. Desktop slides it in beside the
 * homepage; mobile shows it as a full-screen sheet. Both share this content,
 * which sizes off its own width (container queries) rather than the viewport.
 */
export default function InfoPanel({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  const heading = useRef<HTMLHeadingElement | null>(null);
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
    heading.current?.focus({ preventScroll: true });
  }, [panel]);

  return (
    <div
      id="info-panel"
      role="region"
      aria-label={PANEL_LABELS[panel]}
      className="@container relative flex h-full w-full flex-col bg-black text-white"
    >
      <div ref={scroller} className="flex-1 overflow-y-auto overscroll-contain">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-black px-5 pt-5 pb-4 sm:px-8 sm:pt-6 lg:px-[56px] lg:pt-[24px]">
          <p className={EYEBROW}>{CLEARPATH.name}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${PANEL_LABELS[panel]}`}
            className="theme-pill grid h-[34px] w-[34px] place-items-center rounded-full border border-transparent bg-[#262626] text-white transition-colors duration-150 hover:border-white"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={panel}
            className="px-5 pt-8 pb-16 sm:px-8 lg:px-[56px] lg:pt-[clamp(32px,7vh,72px)] lg:pb-[72px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              ref={heading}
              tabIndex={-1}
              className="mb-8 font-serif text-white leading-[0.94] tracking-[-0.02em] text-[clamp(56px,10cqw,112px)] outline-none"
            >
              {PANEL_LABELS[panel]}
            </h2>

            <About />

            <section className="mt-20 flex flex-col items-start gap-7 @[680px]:mt-24">
              <p className="max-w-[18ch] font-serif text-white text-[clamp(34px,5.2cqw,56px)] leading-[1] tracking-[-0.015em]">
                {CLEARPATH.contact.headline}
              </p>
              <ContactCta />
            </section>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
