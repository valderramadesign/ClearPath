import Image from "next/image";
import logoDay from "@/components/images/Logo/clearpath-logo-blue.png";
import logoDark from "@/components/images/Logo/clearpath-logo-dark-mode.png";

/* Both versions render; globals.css shows the one that matches
   html[data-theme]. The PNGs carry wide transparent padding, so each image
   is drawn larger than the box and offset to sit the mark on the box edges. */
export default function Logo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="ClearPath"
      className={`relative inline-block h-[30px] w-[166px] shrink-0 select-none${
        className ? ` ${className}` : ""
      }`}
    >
      {[
        { src: logoDark, theme: "logo-dark" },
        { src: logoDay, theme: "logo-day" },
      ].map(({ src, theme }) => (
        <Image
          key={theme}
          src={src}
          alt=""
          aria-hidden
          priority
          sizes="181px"
          className={`${theme} absolute left-[-8.4px] top-[-14.4px] h-[60.3px] w-[181px] max-w-none`}
        />
      ))}
    </span>
  );
}
