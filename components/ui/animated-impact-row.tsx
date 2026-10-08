"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CASE_STUDY_BODY_CLASS } from "@/components/case-study/types";
import { cx } from "@/lib/cx";

/** Row label: the same League Spartan light the scale over the chart is
    set in, so the label and the dates read as one apparatus around the
    bars, carried at the label's own larger size. Sized down on small
    screens, where the label column is only 110px wide. */
const IMPACT_LABEL_CLASS =
  "font-[family-name:var(--font-league-spartan)] text-[clamp(18px,4.5vw,32px)] lg:text-[clamp(24px,2.6vw,32px)] font-light leading-[1.15]";

/** The figure carried by each bar, in both of its positions. */
const IMPACT_VALUE_CLASS =
  "font-serif font-normal text-base lg:text-[40px] leading-none whitespace-nowrap";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type AnimatedImpactRowProps = {
  label: string;
  todayPct: number;
  futurePct: number;
  todayLabel: string;
  futureLabel: string;
  sublabel?: string;
};

export function AnimatedImpactRow({
  label,
  todayPct,
  futurePct,
  todayLabel,
  futureLabel,
  sublabel,
}: AnimatedImpactRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  /* Narrow gains leave less exposed green than the figure needs, and the
     part that falls behind the baseline is simply not there to read. When
     that happens the figure steps outside and keeps the bar's colour, so
     it still belongs to the growth. */
  const gain = useRef<HTMLDivElement>(null);
  const baseline = useRef<HTMLDivElement>(null);
  const value = useRef<HTMLSpanElement>(null);
  const [valueOutside, setValueOutside] = useState(false);

  const measure = useCallback(() => {
    const grown = gain.current;
    const base = baseline.current;
    const figure = value.current;
    if (!grown || !base || !figure) return;
    const pad = parseFloat(getComputedStyle(grown).paddingRight) || 0;
    const exposed = grown.getBoundingClientRect().right - base.getBoundingClientRect().right;
    /* Room the figure needs to sit inside the gain: its own width, the
       padding holding it off the leading edge, and half that again so it
       never reads as flush against the lip of the baseline bar. */
    setValueOutside(figure.getBoundingClientRect().width + pad * 1.5 > exposed);
  }, []);

  useIsomorphicLayoutEffect(() => {
    measure();
    const node = gain.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure]);

  return (
    /* Label and bar share the first row so the label centres on the bar
       itself; the sublabel hangs off the bar rather than taking a row of
       its own, so every row in the set is exactly one bar tall and the
       spacing between them stays even. */
    <div
      ref={ref}
      className="grid grid-cols-[110px_1fr] items-center gap-x-4 [--impact-inset:6px] lg:grid-cols-[280px_1fr] lg:gap-x-12 lg:[--impact-inset:10px]"
    >
      <h3 className={cx(IMPACT_LABEL_CLASS, "whitespace-pre-line")}>{label}</h3>
      <div className="relative h-[56px] w-full rounded-[14px] bg-[rgba(217,217,217,0.2)] lg:h-[89px] lg:rounded-[20px]">
        {/* inner area with inset on left, top, bottom */}
        <div className="absolute left-[var(--impact-inset)] top-[var(--impact-inset)] bottom-[var(--impact-inset)] right-0">
          {/* The whole new figure, drawn from the same origin as the bar
              behind it and lying under that bar, so only the gain shows.
              Clipping the right edge open sweeps it out from beneath the
              baseline left to right — the growth, not a second bar parked
              beside the first. The figure rides the leading edge. */}
          <motion.div
            ref={gain}
            className="absolute left-0 top-0 h-full bg-[#cef252] rounded-[10px] lg:rounded-[20px] flex items-center justify-end px-3 lg:px-4"
            style={{ right: `${100 - futurePct}%` }}
            initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
            animate={{ clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)" }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
          >
            {/* Held in place when it steps out, so the fit can be
                re-measured as the bar resizes. */}
            <span
              ref={value}
              className={cx(IMPACT_VALUE_CLASS, "text-black", valueOutside && "invisible")}
            >
              {futureLabel}
            </span>
          </motion.div>
          {/* The baseline sits on top: its square right edge is the lip the
              growth comes out from under. */}
          <div
            ref={baseline}
            className="absolute left-0 top-0 h-full bg-[#230808] rounded-l-[10px] lg:rounded-l-[20px] flex items-center px-3 lg:px-6 overflow-hidden"
            style={{ width: `${todayPct}%` }}
          >
            <span className={cx(IMPACT_VALUE_CLASS, "text-white")}>{todayLabel}</span>
          </div>
          {valueOutside && (
            <motion.span
              className={cx(IMPACT_VALUE_CLASS, "absolute top-0 flex h-full items-center pl-3 text-[#cef252] lg:pl-4")}
              style={{ left: `${futurePct}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ duration: 0.45, delay: 1.1 }}
            >
              {futureLabel}
            </motion.span>
          )}
        </div>
        {sublabel && (
          <p
            className={`${CASE_STUDY_BODY_CLASS} absolute left-0 top-full mt-2 text-right text-[#cef252] lg:mt-3`}
            /* The gain is the sublabel's measure, so the sentence hangs off
               the leading edge of the bar. On a narrow screen that measure
               can fall under the length of the sentence, and since the
               sublabel is out of flow the extra lines would land on the row
               below: it may take back as much of the bar as the words need,
               and no more. */
            style={{
              minWidth: `calc(var(--impact-inset) + (100% - var(--impact-inset)) * ${futurePct / 100})`,
              width: "max-content",
              maxWidth: "100%",
            }}
          >
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}
