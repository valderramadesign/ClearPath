"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Header, { panelPillClass } from "@/components/layout/header";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/theme-toggle";

const barClasses =
  "w-full shrink-0 px-5 pt-5 pb-5 lg:px-[24px] lg:pt-[24px] lg:pb-[24px]";

export default function CaseStudyTopBar() {
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

  const content = (
    <>
      <div className="hidden lg:block">
        <Header />
      </div>
      {/* Below `lg` the bar is only wide enough for the mark and one pill,
          so the footer carries the rest. */}
      <div className="lg:hidden flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <Link href="/" aria-label="ClearPath Transformation home">
            <Logo />
          </Link>
          <Link href="/" className={panelPillClass(false)}>
            Home
          </Link>
        </div>
        <ThemeToggle />
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
      <div ref={bar} className={`fixed top-0 left-0 right-0 z-50 bg-black ${barClasses}`}>
        {content}
      </div>
    </>
  );
}
