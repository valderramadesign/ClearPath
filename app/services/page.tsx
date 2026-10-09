import type { Metadata } from "next";
import Link from "next/link";
import Header, { PrimaryNav } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactCta from "@/components/ui/contact-cta";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/theme-toggle";
import { CLEARPATH } from "@/lib/content";

export const metadata: Metadata = {
  title: `Services — ${CLEARPATH.name}`,
  description: CLEARPATH.services.intro,
  alternates: { canonical: "/services/" },
};

const EYEBROW = "text-white/60 text-[12px] uppercase tracking-[0.18em] font-sans";

export default function ServicesPage() {
  const { intro, items } = CLEARPATH.services;
  return (
    <div className="theme-site min-h-[100svh] overflow-clip bg-black text-white">
      <div className="hidden lg:block p-[24px]">
        <Header current="services" />
      </div>
      <div className="lg:hidden px-5 pt-5 sm:px-6 sm:pt-6">
        <header className="flex items-center justify-between">
          <Link href="/" aria-label={`${CLEARPATH.name} home`}>
            <Logo />
          </Link>
          <ThemeToggle />
        </header>
        <nav aria-label="Primary" className="mt-5 flex items-center gap-2">
          <PrimaryNav current="services" />
        </nav>
      </div>

      {/* Bottom padding is 35% of the old gap to the footer copy, less the footer's own 32px top padding. */}
      <main className="@container px-5 pb-[clamp(4px,calc(4.9vh_-_21px),31px)] sm:px-6 lg:px-[24px]">
        <div className="relative isolate pt-[clamp(64px,14vh,140px)]">
          {/* Day and night images swap in CSS (globals.css), so only the active one downloads. */}
          <div
            aria-hidden
            className="services-hero-bg pointer-events-none absolute inset-y-0 -right-5 -z-10 w-[calc(100%+20px)] opacity-40 [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_45%),linear-gradient(to_bottom,#000_60%,transparent)] sm:-right-6 sm:w-[calc(100%+24px)] lg:-right-[24px] lg:w-[70%] lg:opacity-100"
          />

          <p className={EYEBROW}>{CLEARPATH.name}</p>
          <h1 className="mt-5 font-serif text-[clamp(56px,10cqw,128px)] leading-[0.94] tracking-[-0.02em] text-white">
            Services
          </h1>
          <p className="mt-8 max-w-[34ch] font-sans font-light text-white leading-[1.32] tracking-[-0.015em] text-[clamp(21px,2.4cqw,28px)]">
            {intro}
          </p>
        </div>

        <ol className="mt-16 border-b border-white/15 @[760px]:mt-24">
          {items.map((item, index) => (
            <li
              key={item.title}
              className="grid gap-x-10 gap-y-4 border-t border-white/15 py-8 @[760px]:grid-cols-[56px_minmax(0,0.9fr)_minmax(0,1.3fr)] @[760px]:py-12"
            >
              <span aria-hidden className="pt-[6px] font-sans text-sm tabular-nums tracking-[0.08em] text-white/50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="font-serif text-white text-[clamp(28px,3.2cqw,40px)] leading-[1.02] tracking-[-0.015em]">
                {item.title}
              </h2>
              <p className="max-w-[56ch] font-sans font-light text-white/80 text-[17px] leading-[1.55] sm:text-lg">
                {item.body}
              </p>
            </li>
          ))}
        </ol>

        {/* Starts on the last row's rule. The art is shown whole at its 3:2 size and
            runs on behind the footer. The mask softens the right and bottom edges
            into the page; it is written before the mirror, so "to right" fades the
            displayed right edge. */}
        <div className="relative pt-10 @[760px]:pt-14">
          <div
            aria-hidden
            className="services-hero-bg pointer-events-none absolute top-0 -left-5 aspect-[3/2] w-[calc(100%+20px)] -scale-x-100 opacity-40 [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_14%),linear-gradient(to_top,transparent,#000_14%)] sm:-left-6 sm:w-[calc(100%+24px)] lg:-left-[24px] lg:w-[62%] lg:opacity-100"
          />

          <section className="relative grid items-center lg:grid-cols-2">
            <div className="flex flex-col items-start gap-7 lg:col-start-2">
              <p className="max-w-[18ch] font-serif text-white text-[clamp(34px,5.2cqw,64px)] leading-[1] tracking-[-0.015em]">
                {CLEARPATH.contact.headline}
              </p>
              <ContactCta />
            </div>
          </section>
        </div>
      </main>

      <Footer overArt />
    </div>
  );
}
