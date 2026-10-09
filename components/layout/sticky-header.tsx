"use client";

import { useEffect, useState } from "react";

/** Pins the page chrome to the top of the viewport. It stays clear over the
    hero and takes on a frosted backing once the page scrolls (globals.css). */
export default function StickyHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      data-scrolled={scrolled || undefined}
      className={`sticky-header sticky top-0 z-30${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
