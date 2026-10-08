import Link from "next/link";

type PillButtonProps = {
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function PillButton({
  label,
  active,
  href,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: PillButtonProps) {
  // League Spartan's ascent (0.74em) overshoots its cap height (0.66em), so a
  // leading-none label renders 2.28px above centre. The split padding puts the
  // cap box on the pill's midline without changing its 34px height.
  const className = `theme-pill px-4 pt-[10.28px] pb-[5.72px] rounded-full text-base font-normal font-sans leading-none whitespace-nowrap border transition-colors duration-150 cursor-pointer ${
    active
      ? "bg-white text-black border-white"
      : "bg-[#262626] text-white border-transparent hover:border-white"
  }`;

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={className}
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {label}
    </button>
  );
}
