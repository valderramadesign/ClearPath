import Image from "next/image";
import step1 from "@/components/images/service-process/step-1.webp";
import step2 from "@/components/images/service-process/step-2.webp";
import step3 from "@/components/images/service-process/step-3.webp";
import step4 from "@/components/images/service-process/step-4.webp";
import { CLEARPATH } from "@/lib/content";

const ART = [step1, step2, step3, step4];

function Arrow() {
  return (
    <span aria-hidden className="mx-[clamp(14px,2cqw,32px)] flex min-w-0 flex-1 items-center text-white/50">
      <span className="h-px flex-1 bg-current" />
      <svg width="7" height="13" viewBox="0 0 7 13" fill="none" className="-ml-[7px] shrink-0">
        <path d="M.5.5l6 6-6 6" stroke="currentColor" />
      </svg>
    </span>
  );
}

/** The four service steps as one chain, under a bracket that spans them all. Desktop only. */
export default function ServiceProcess({ className = "" }: { className?: string }) {
  const { items, management } = CLEARPATH.services;
  return (
    <section aria-labelledby="service-process-label" className={`hidden lg:block ${className}`}>
      <div className="flex items-start gap-6">
        <span aria-hidden className="mt-[14px] h-[14px] flex-1 border-l border-t border-white/30" />
        <p id="service-process-label" className="font-sans font-light text-white/80 text-lg leading-[1.55]">
          {management}
        </p>
        <span aria-hidden className="mt-[14px] h-[14px] flex-1 border-r border-t border-white/30" />
      </div>

      <ol className="mt-10 flex [--step:clamp(168px,18cqw,300px)]">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.title} className={last ? "w-[var(--step)]" : "min-w-0 flex-1"}>
              <div className="flex items-center">
                <Image src={ART[index]} alt="" sizes="300px" className="h-auto w-[var(--step)] shrink-0" />
                {!last && <Arrow />}
              </div>
              <p className="mt-7 w-[var(--step)] text-balance text-center font-sans font-light text-white/80 text-[17px] leading-[1.45] xl:text-lg">
                {item.title}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
