interface NextCaseStudyTickerProps {
  color: string;
  /** Darker day-mode variant. Falls back to `color` when the brand hue
   * already clears AAA on the cream day background unaided. */
  dayColor?: string;
}

export default function NextCaseStudyTicker({ color, dayColor }: NextCaseStudyTickerProps) {
  const text = "Next Case Study.   ";

  return (
    <div
      aria-hidden
      className="pointer-events-none select-none absolute inset-x-0 overflow-hidden"
      style={{ top: 0, bottom: 0 }}
    >
      <div
        className="next-case-study-ticker-text flex whitespace-nowrap"
        style={{
          animation: "ticker-scroll 13.5s linear infinite",
          willChange: "transform",
          fontFamily: "var(--font-league-spartan)",
          fontSize: "clamp(96px, 24vw, 250px)",
          lineHeight: "1",
          paddingTop: "clamp(80px, 30vw, 306px)",
          ["--ticker-dark-color" as string]: color,
          ["--ticker-day-color" as string]: dayColor ?? color,
        }}
      >
        {/* Duplicate for seamless loop */}
        <span>{text.repeat(6)}</span>
        <span>{text.repeat(6)}</span>
      </div>
    </div>
  );
}
