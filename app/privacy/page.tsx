import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/theme-toggle";
import { CLEARPATH } from "@/lib/content";

export const metadata: Metadata = {
  title: `Privacy policy — ${CLEARPATH.name}`,
  description: `How ${CLEARPATH.name} collects and uses the information you send through the inquiry form.`,
  alternates: { canonical: "/privacy/" },
};

const EYEBROW = "text-white/60 text-[12px] uppercase tracking-[0.18em] font-sans";
const UPDATED = "October 2026";

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "What we collect",
    body: (
      <p>
        When you send an inquiry, we collect your name, work email, company and the description of
        your process challenge. We do not use cookies for tracking or advertising. The site saves
        your light or dark mode choice in your own browser only.
      </p>
    ),
  },
  {
    title: "How we use it",
    body: (
      <p>
        We use your inquiry only to reply to you and to discuss the challenge you describe. We do not
        sell your information, and we do not add you to a mailing list.
      </p>
    ),
  },
  {
    title: "Who processes it",
    body: (
      <p>
        The form is delivered by FormSubmit (formsubmit.co), which passes your inquiry to our email
        inbox. FormSubmit handles the data under its own privacy policy. We keep inquiries in email
        for as long as we need them to reply and to keep a record of our conversation.
      </p>
    ),
  },
  {
    title: "Your choices",
    body: (
      <p>
        You can ask us to show, correct or delete the information you sent. Email{" "}
        <a href={`mailto:${CLEARPATH.email}`} className="underline underline-offset-4 hover:opacity-70">
          {CLEARPATH.email}
        </a>{" "}
        and we will reply.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="theme-site min-h-[100svh] bg-black text-white">
      <header className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6 lg:px-[24px] lg:pt-[24px]">
        <Link
          href="/"
          className="theme-pill inline-flex items-center gap-2 rounded-full border border-transparent bg-[#262626] px-4 pt-[10.28px] pb-[5.72px] font-sans text-base leading-none text-white transition-colors duration-150 hover:border-white"
        >
          <ArrowLeft aria-hidden className="-mt-[4px] h-4 w-4" strokeWidth={1.75} />
          Home
        </Link>
        <div className="flex items-center gap-[12px]">
          <ThemeToggle />
          <Link href="/" aria-label={`${CLEARPATH.name} home`}>
            <Logo />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-5 pt-[clamp(64px,14vh,140px)] pb-24 sm:px-6">
        <p className={EYEBROW}>{CLEARPATH.name}</p>
        <h1 className="mt-5 font-serif text-[clamp(48px,9vw,96px)] leading-[0.94] tracking-[-0.02em] text-white">
          Privacy policy
        </h1>
        <p className="mt-6 font-sans text-sm text-white/60">Last updated {UPDATED}</p>

        <div className="mt-14 border-b border-white/15">
          {SECTIONS.map((section) => (
            <section key={section.title} className="grid gap-x-10 gap-y-3 border-t border-white/15 py-8 sm:grid-cols-[180px_minmax(0,1fr)]">
              <h2 className={`${EYEBROW} pt-[6px]`}>{section.title}</h2>
              <div className="font-sans text-[17px] font-light leading-[1.6] text-white/80 sm:text-lg">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
