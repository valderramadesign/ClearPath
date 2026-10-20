"use client";

import { useContact } from "@/components/ui/contact-modal";

/**
 * The Contact Us pill as it sits beside the logo in the page chrome. It opens
 * the inquiry form, so every route into contact lands on the same form. The
 * pill matches the header's nav pills.
 */
export default function ContactLine({ className }: { className?: string }) {
  const { openContact } = useContact();
  return (
    <button
      type="button"
      onClick={openContact}
      aria-haspopup="dialog"
      className={`theme-pill inline-flex items-center rounded-full border border-transparent bg-[#262626] px-4 pt-[10.28px] pb-[5.72px] text-base font-normal font-sans leading-none text-white whitespace-nowrap transition-colors duration-150 hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70${
        className ? ` ${className}` : ""
      }`}
    >
      Contact Us
    </button>
  );
}
