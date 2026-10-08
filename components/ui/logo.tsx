/* Set in type rather than drawn: the wordmark follows the TiM.V mark's cut
   (League Spartan Bold, 17px caps in a 29px box) and its blue period, and
   .text-white lets day mode darken the letters while the period keeps
   --logo-dot-blue, the same var contact-line.tsx uses. */
export default function Logo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="ClearPath"
      className={`inline-flex h-[29px] items-center font-sans text-[25px] font-semibold leading-none tracking-[0.02em] text-white whitespace-nowrap select-none${
        className ? ` ${className}` : ""
      }`}
    >
      <span aria-hidden className="pt-[4px]">
        CLEAR
        <span style={{ color: "var(--logo-dot-blue, #00B0D8)" }}>.</span>
        PATH
      </span>
    </span>
  );
}
