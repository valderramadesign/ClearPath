import Link from "next/link";
import ContactLine from "@/components/ui/contact-line";
import Logo from "@/components/ui/logo";
import { CLEARPATH } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-black border-t border-white/10 px-5 pt-8 pb-[max(32px,env(safe-area-inset-bottom))] sm:px-6 lg:px-[24px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="font-sans text-sm text-white/60">{CLEARPATH.name}</p>
        </div>
        <div className="flex flex-col gap-3 font-sans text-sm text-white/60 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
          <ContactLine className="!text-sm w-fit" />
          <Link href="/privacy" className="w-fit underline-offset-4 hover:underline hover:text-white">
            Privacy policy
          </Link>
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} {CLEARPATH.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
