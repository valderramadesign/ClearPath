import Link from "next/link";
import { SITE } from "@/lib/content";

/**
 * Case studies carry the contact line in the top bar, which only has room for
 * it from `lg` up. Below that the same details land here, so a reader on a
 * phone leaves any case study with the address and number the homepage shows.
 */
export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <footer className="lg:hidden bg-black px-5 pb-16 sm:px-6">
        <div className="flex flex-col gap-2 border-t border-white/10 pt-6 text-sm font-sans text-white/60">
          <a
            href={`mailto:${SITE.email}`}
            className="w-fit text-white/70 underline-offset-4 hover:underline"
          >
            {SITE.email}
          </a>
          <a
            href={`tel:${SITE.phoneTel}`}
            className="w-fit text-white/70 underline-offset-4 hover:underline"
          >
            {SITE.phone}
          </a>
          <Link
            href="/resume/print"
            className="w-fit text-white/70 underline-offset-4 hover:underline"
          >
            View full résumé
          </Link>
          <p>
            {SITE.location} · {SITE.citizenship}
          </p>
        </div>
      </footer>
    </>
  );
}
