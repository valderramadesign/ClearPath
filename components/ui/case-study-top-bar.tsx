"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ContactLine from "@/components/ui/contact-line";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/theme-toggle";

const barClasses =
  "flex w-full items-center justify-between shrink-0 px-5 pt-5 pb-5 lg:px-[24px] lg:pt-[24px] lg:pb-[24px]";

export default function CaseStudyTopBar() {
  const [visible, setVisible] = useState(true);
  const bar = useRef<HTMLDivElement | null>(null);

  /* Published so sections that pin under the bar can say where they land
     without hard-coding a height that only this file knows. */
  useEffect(() => {
    const node = bar.current;
    if (!node) return;
    const publish = () =>
      document.documentElement.style.setProperty(
        "--case-study-bar-h",
        `${node.offsetHeight}px`
      );
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = document.getElementById("next-case-study-section");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const content = (
    <>
      {/* Split padding compensates League Spartan's high ascent so the label
          sits on the pill's midline; total height is unchanged. */}
      <div className="flex items-center gap-[12px]">
        <Link
          href="/"
          className="theme-pill rounded-full border border-transparent bg-[#262626] px-4 pt-[10.28px] pb-[5.72px] text-base font-normal font-sans leading-none whitespace-nowrap text-white transition-colors duration-150 hover:border-white"
        >
          Home
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex items-center gap-[24px]">
        <Link href="/" aria-label="Timothy Valderrama — home">
          <Logo />
        </Link>
        {/* Same line the homepage header carries. Below `lg` the bar is only
            wide enough for the pill and the mark, so the footer takes it. */}
        <ContactLine className="hidden lg:block" />
      </div>
    </>
  );

  return (
    <>
      {/* Spacer preserves document flow height */}
      <div aria-hidden inert className={`invisible ${barClasses}`}>
        {content}
      </div>
      {/* Fixed bar: stays visible while page scrolls behind it */}
      <div
        ref={bar}
        className={`fixed top-0 left-0 right-0 z-50 bg-black transition-opacity duration-500 ease-out ${barClasses}`}
        style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
      >
        {content}
      </div>
    </>
  );
}
