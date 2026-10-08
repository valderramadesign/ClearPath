"use client";

import { Fragment } from "react";
import { useContact } from "@/components/ui/contact-modal";
import { CLEARPATH } from "@/lib/content";

/* Sampled from the dots in the logo mark. */
const LOGO_DOT_BLUE = "#00B0D8";

/**
 * Renders a string with its periods in the logo's blue, so the contact line
 * reads as an extension of the mark beside it rather than as loose text. Split
 * on the character rather than styling the whole string, because only the
 * periods carry the accent.
 */
function DottedText({ children }: { children: string }) {
  const parts = children.split(".");
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part}
          {index < parts.length - 1 && (
            <span style={{ color: `var(--logo-dot-blue, ${LOGO_DOT_BLUE})` }}>.</span>
          )}
        </Fragment>
      ))}
    </>
  );
}

/**
 * The inquiry email as it sits beside the logo in the page chrome. It opens
 * the inquiry form rather than a mail client, so every route into contact
 * lands on the same form.
 */
export default function ContactLine({ className }: { className?: string }) {
  const { openContact } = useContact();
  return (
    <button
      type="button"
      onClick={openContact}
      aria-haspopup="dialog"
      className={`text-base font-normal font-sans leading-none text-white whitespace-nowrap pt-[3px] rounded-sm transition-opacity duration-150 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70${
        className ? ` ${className}` : ""
      }`}
    >
      <DottedText>{CLEARPATH.email}</DottedText>
    </button>
  );
}
