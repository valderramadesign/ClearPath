"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { CLEARPATH } from "@/lib/content";

/* FormSubmit relays the JSON post to the inbox in the path. The first post
   sends that inbox an activation link, and nothing is delivered until it is
   clicked. */
const ENDPOINT = `https://formsubmit.co/ajax/${CLEARPATH.email}`;

type Field = "name" | "email" | "company" | "challenge";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent" | "failed";

const EMPTY: Values = { name: "", email: "", company: "", challenge: "" };
const FIELD_ORDER: Field[] = ["name", "email", "company", "challenge"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!values.email.trim()) errors.email = "Enter your work email.";
  else if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = "Enter an email address in the format name@company.com.";
  if (!values.company.trim()) errors.company = "Enter your company name.";
  if (!values.challenge.trim())
    errors.challenge = "Tell us briefly about the process challenge.";
  return errors;
}

type ContactContextValue = { openContact: () => void };

const ContactContext = createContext<ContactContextValue | null>(null);

export function useContact() {
  const value = useContext(ContactContext);
  if (!value) throw new Error("useContact must be used inside <ContactProvider>.");
  return value;
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);

  const openContact = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Wait for the exit so focus does not land on a control under the scrim.
    requestAnimationFrame(() => returnFocus.current?.focus());
  }, []);

  return (
    <ContactContext.Provider value={{ openContact }}>
      {children}
      <AnimatePresence>{open && <ContactModal onClose={close} />}</AnimatePresence>
    </ContactContext.Provider>
  );
}

const FIELD_CLASS =
  "contact-field w-full rounded-[14px] border px-4 pt-[13px] pb-[11px] text-base font-sans leading-[1.35] outline-none transition-colors duration-150";

function ContactModal({ onClose }: { onClose: () => void }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const dialog = useRef<HTMLDivElement | null>(null);
  const fields = useRef<Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const id = useId();
  const titleId = `${id}-title`;
  const bodyId = `${id}-body`;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    fields.current.name?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (status === "sent") dialog.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
  }, [status]);

  const update = (field: Field, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Errors only follow typing once a send has been tried, so nobody is told
    // off for a field they have not finished.
    if (attempted) setErrors(validate(next));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    setAttempted(true);
    const found = validate(values);
    setErrors(found);
    const first = FIELD_ORDER.find((field) => found[field]);
    if (first) {
      fields.current[first]?.focus();
      return;
    }

    const honeypot = new FormData(event.currentTarget).get("_honey");
    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim(),
          message: values.challenge.trim(),
          _subject: `ClearPath inquiry from ${values.name.trim()}, ${values.company.trim()}`,
          _replyto: values.email.trim(),
          _template: "table",
          _honey: honeypot ?? "",
        }),
      });
      const result = await response.json().catch(() => null);
      const ok = response.ok && (result?.success === true || result?.success === "true");
      setStatus(ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  // Keeps Tab inside the dialog, and stops Escape here so it does not also
  // close a panel open underneath.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialog.current) return;
    const focusable = Array.from(
      dialog.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([type="hidden"]):not([tabindex="-1"]), textarea, a[href]'
      )
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const describedBy = (field: Field) => (errors[field] ? `${id}-${field}-error` : undefined);

  const renderError = (field: Field) =>
    errors[field] ? (
      <p id={`${id}-${field}-error`} className="contact-error mt-2 text-sm font-sans leading-snug">
        {errors[field]}
      </p>
    ) : null;

  const label = (field: Field, text: string) => (
    <label htmlFor={`${id}-${field}`} className="mb-2 block text-sm font-sans leading-none text-white/70">
      {text}
    </label>
  );

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div aria-hidden className="contact-scrim absolute inset-0" onClick={onClose} />
      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        onKeyDown={onKeyDown}
        className="contact-surface relative w-full max-w-[600px] max-h-[calc(100svh-32px)] overflow-y-auto rounded-[28px] border text-white"
        initial={{ opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.99 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="theme-pill absolute right-4 top-4 grid h-[34px] w-[34px] place-items-center rounded-full border border-transparent bg-[#262626] text-white transition-colors duration-150 hover:border-white sm:right-5 sm:top-5"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>

        {status === "sent" ? (
          <div className="px-6 pt-14 pb-8 sm:px-10 sm:pt-16 sm:pb-10" aria-live="polite">
            <span className="contact-check grid h-11 w-11 place-items-center rounded-full">
              <Check className="h-5 w-5" strokeWidth={2} />
            </span>
            <h2
              id={titleId}
              className="mt-6 font-serif text-[36px] leading-[1] tracking-[-0.015em] text-white sm:text-[44px]"
            >
              Thank you, {values.name.trim().split(/\s+/)[0]}.
            </h2>
            <p id={bodyId} className="mt-4 max-w-[44ch] font-sans text-lg font-light leading-[1.45] text-white/80">
              Your inquiry is on its way. We’ll reply to {values.email.trim()} to arrange a conversation.
            </p>
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              className="cta-solid mt-8 rounded-full px-6 pt-[14.28px] pb-[9.72px] text-base font-sans leading-none"
            >
              Close
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={onSubmit} className="px-6 pt-12 pb-7 sm:px-10 sm:pt-14 sm:pb-10">
            <p className="text-white/60 text-[12px] uppercase tracking-[0.18em] font-sans">
              {CLEARPATH.cta}
            </p>
            <h2
              id={titleId}
              className="mt-4 pr-8 font-serif text-[34px] leading-[1] tracking-[-0.015em] text-white sm:text-[44px]"
            >
              {CLEARPATH.contact.headline}
            </h2>
            <p id={bodyId} className="mt-4 max-w-[48ch] font-sans text-base font-light leading-[1.5] text-white/80 sm:text-lg">
              {CLEARPATH.contact.body}
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                {label("name", "Name")}
                <input
                  ref={(node) => { fields.current.name = node; }}
                  id={`${id}-name`}
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy("name")}
                  aria-required="true"
                  maxLength={120}
                  className={FIELD_CLASS}
                />
                {renderError("name")}
              </div>
              <div>
                {label("company", "Company")}
                <input
                  ref={(node) => { fields.current.company = node; }}
                  id={`${id}-company`}
                  name="company"
                  autoComplete="organization"
                  value={values.company}
                  onChange={(e) => update("company", e.target.value)}
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={describedBy("company")}
                  aria-required="true"
                  maxLength={160}
                  className={FIELD_CLASS}
                />
                {renderError("company")}
              </div>
              <div className="sm:col-span-2">
                {label("email", "Work email")}
                <input
                  ref={(node) => { fields.current.email = node; }}
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("email")}
                  aria-required="true"
                  maxLength={254}
                  className={FIELD_CLASS}
                />
                {renderError("email")}
              </div>
              <div className="sm:col-span-2">
                {label("challenge", "The process challenge")}
                <textarea
                  ref={(node) => { fields.current.challenge = node; }}
                  id={`${id}-challenge`}
                  name="challenge"
                  rows={4}
                  value={values.challenge}
                  onChange={(e) => update("challenge", e.target.value)}
                  aria-invalid={Boolean(errors.challenge)}
                  aria-describedby={describedBy("challenge")}
                  aria-required="true"
                  maxLength={2000}
                  placeholder="For example: month-end reporting takes three people four days."
                  className={`${FIELD_CLASS} min-h-[124px] resize-y`}
                />
                {renderError("challenge")}
              </div>
            </div>

            {/* Bots fill every field they find; people never see this one. */}
            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute -left-[9999px] h-px w-px opacity-0"
            />

            {status === "failed" && (
              <p role="alert" className="contact-error mt-6 text-sm font-sans leading-snug">
                We couldn’t send your inquiry. Please try again, or email us at{" "}
                <a href={`mailto:${CLEARPATH.email}`} className="underline underline-offset-2">
                  {CLEARPATH.email}
                </a>
                .
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <p className="max-w-[34ch] text-xs font-sans leading-snug text-white/55">
                All fields are required. We use your details only to reply. See our{" "}
                <Link href="/privacy" onClick={onClose} className="underline underline-offset-2 hover:opacity-70">
                  privacy policy
                </Link>
                .
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                aria-busy={status === "sending"}
                className="cta-solid rounded-full px-6 pt-[14.28px] pb-[9.72px] text-base font-sans leading-none disabled:cursor-progress disabled:opacity-70"
              >
                {status === "sending" ? "Sending…" : CLEARPATH.contact.submit}
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              {status === "sending" ? "Sending your inquiry." : ""}
            </p>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
