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
    <div className="theme-site min-h-[100svh] bg-black text-white">
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

      <main className="@container px-5 pt-[clamp(64px,14vh,140px)] pb-[clamp(72px,14vh,148px)] sm:px-6 lg:px-[24px]">
        <p className={EYEBROW}>{CLEARPATH.name}</p>
        <h1 className="mt-5 font-serif text-[clamp(56px,10cqw,128px)] leading-[0.94] tracking-[-0.02em] text-white">
          Services
        </h1>
        <p className="mt-8 max-w-[34ch] font-sans font-light text-white leading-[1.32] tracking-[-0.015em] text-[clamp(21px,2.4cqw,28px)]">
          {intro}
        </p>

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

        <section className="mt-20 flex flex-col items-start gap-7 @[760px]:mt-28">
          <p className="max-w-[18ch] font-serif text-white text-[clamp(34px,5.2cqw,64px)] leading-[1] tracking-[-0.015em]">
            {CLEARPATH.contact.headline}
          </p>
          <ContactCta />
        </section>
      </main>

      <Footer />
    </div>
  );
}
