"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SRC = "/videos/Intro/intro-montage.mp4";
const POSTER = "/videos/Intro/intro-montage-poster.jpg";

/**
 * Idle homepage background: a 16:9 montage cut from the case-study footage and
 * stills. It plays through once and then fades to the black it sits on, so the
 * page settles instead of cycling behind the work. Stays mounted while a
 * project is hovered — only its opacity changes — so it keeps its place rather
 * than restarting. A refresh or a return to the homepage remounts this
 * component, which is what plays it again.
 *
 * `onFinished` fires once, and is the homepage's cue to start its idle
 * showreel. It means "the montage is over" in the broad sense: it also fires
 * when there was never a montage to wait for — reduced motion, a rejected
 * autoplay, a video that failed to load — because a gate that only opened on a
 * clean playthrough would leave those visitors on a page that never moves.
 */
export default function IntroMontageBackground({
  active,
  onFinished,
}: {
  active: boolean;
  onFinished?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const [ended, setEnded] = useState(false);

  // Held in a ref so a caller passing an inline arrow doesn't re-run the
  // playback effect — which would call play() again on every render.
  const onFinishedRef = useRef(onFinished);
  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  const finishedRef = useRef(false);
  const openGate = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinishedRef.current?.();
  }, []);

  // Only a real playthrough fades the footage out. The other ways the gate
  // opens leave the frame as it is: under reduced motion the poster is the
  // background, and fading it to black would be motion asked not to happen.
  const finishPlayback = useCallback(() => {
    setEnded(true);
    openGate();
  }, [openGate]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (reducedMotion || !video) {
      // Nothing will ever play here, so nothing should be waiting on it.
      if (reducedMotion) openGate();
      return;
    }
    // canplay can fire either side of hydration, so seed from readyState and keep
    // an imperative listener — relying on the JSX handler alone can strand the
    // video at opacity 0 with the poster showing forever.
    const markReady = () => setReady(true);
    if (video.readyState >= 3) markReady();
    video.addEventListener("canplay", markReady);
    // Autoplay can be rejected before the user interacts; the poster covers that
    // case visually, and the gate has to open anyway or nothing downstream runs.
    video.play().catch(openGate);
    return () => video.removeEventListener("canplay", markReady);
  }, [reducedMotion, openGate]);

  return (
    <div
      aria-hidden
      className={`theme-background-media fixed inset-0 z-[-10] bg-black transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* One shared opacity on the stack — layering two translucent copies would
          double-expose. It carries the closing fade too: taking the poster down
          with the footage is what leaves black rather than a frozen still. */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
          ended ? "opacity-0" : "opacity-40"
        }`}
      >
        {/* Poster sits underneath so the frame is never empty while the video buffers. */}
        <img src={POSTER} alt="" className="absolute inset-0 w-full h-full object-cover" />
        {!reducedMotion && (
          <video
            ref={videoRef}
            src={SRC}
            poster={POSTER}
            autoPlay
            muted
            playsInline
            preload="auto"
            suppressHydrationWarning
            onCanPlay={() => setReady(true)}
            onEnded={finishPlayback}
            onError={openGate}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      {/* Full-bleed scrims, not boxes cropped to a band — sizing the fade
          entirely through the gradient stops (rather than clipping a shorter
          div) means there's no edge for the feather to hit before it reaches
          zero alpha. Grounds the headline/signals at the bottom and the logo
          up top without ever reading as a hard-edged panel. Idle-only: both
          live inside this component's own opacity toggle, so they fade out
          with the footage the instant a rollover starts. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 12%, rgba(0,0,0,0.45) 24%, rgba(0,0,0,0.28) 36%, rgba(0,0,0,0.14) 48%, rgba(0,0,0,0.04) 58%, rgba(0,0,0,0) 68%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 48% 42% at 100% 0%, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.50) 25%, rgba(0,0,0,0.31) 45%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.06) 82%, rgba(0,0,0,0) 100%)",
        }}
      />
    </div>
  );
}
