"use client";

import { useLayoutEffect, useRef, useState } from "react";

import {
  GalaxyPhoneShell,
  PHONE_SCREEN_ASPECT,
} from "@/components/ui/galaxy-phone-shell";

/* ── The parent's feed, running ───────────────────────────────────────────
   The same handset the walkthrough is drawn in, except the screen is the
   deployed prototype rather than stills — so what the section claims about
   parents having the day as it happens can simply be read off it.

   `view=parent` is the prototype's guardian mode: no back button, no
   "add to feed", no per-tile edit. A guardian sees Mei's day and can
   comment or heart it, which is exactly the permission the copy describes.

   The frame renders at a real phone's width and is scaled down to the
   screen, the way the stills were captured, so type in the two handsets on
   this page is the same size. Before the measurement lands — and with
   scripting off — it simply fills the screen instead. */

const FEED_URL = "https://ms-sunshine-app-prototype.vercel.app/school/c01?view=parent";

/** The logical width the prototype is laid out against; the stills the
    walkthrough uses were captured at it. */
const FEED_W = 375;
const FEED_H = Math.round(FEED_W * PHONE_SCREEN_ASPECT);

export function SunshineParentFeed({ className }: { className?: string }) {
  const screen = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const node = screen.current;
    if (!node) return;

    const measure = () => setScale(node.clientWidth / FEED_W);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={className} style={{ containerType: "inline-size" }}>
      <GalaxyPhoneShell screenRef={screen}>
        <iframe
          src={FEED_URL}
          title="The Ms. Sunshine prototype running the parent view of Mei's newsfeed"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          className="absolute left-0 top-0 origin-top-left border-0"
          style={
            scale === null
              ? { width: "100%", height: "100%" }
              : { width: FEED_W, height: FEED_H, transform: `scale(${scale})` }
          }
        />
      </GalaxyPhoneShell>
    </div>
  );
}
