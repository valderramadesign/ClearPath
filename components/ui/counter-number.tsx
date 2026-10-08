"use client";

import { useEffect, useRef, useState } from "react";

interface CounterNumberProps {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export default function CounterNumber({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1200,
  className,
}: CounterNumberProps) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          const startTime = performance.now();

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(eased * to);
            if (progress < 1) requestAnimationFrame(tick);
            else setCurrent(to);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
}
