"use client";

import { ArrowRight } from "lucide-react";
import { useContact } from "@/components/ui/contact-modal";
import { CLEARPATH } from "@/lib/content";

/** The site's one call to action. Every instance opens the same inquiry form. */
export default function ContactCta({ className = "" }: { className?: string }) {
  const { openContact } = useContact();
  return (
    <button
      type="button"
      onClick={openContact}
      aria-haspopup="dialog"
      className={`cta-solid group inline-flex items-center gap-3 rounded-full px-6 pt-[15.28px] pb-[10.72px] text-base font-sans leading-none whitespace-nowrap sm:text-lg sm:pt-[16.6px] sm:pb-[11.4px] ${className}`}
    >
      {CLEARPATH.cta}
      <ArrowRight
        aria-hidden
        className="-mt-[3px] h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-[3px]"
        strokeWidth={1.75}
      />
    </button>
  );
}
