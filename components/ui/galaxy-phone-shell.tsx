import type { CSSProperties, ReactNode, Ref } from "react";

/* ── The handset ─────────────────────────────────────────────────────────

   Drawn rather than photographed, so it stays sharp at any width and the
   screen is real markup underneath. Every length is in cqw — percent of
   the figure's own width — off a Galaxy S25 Ultra measured against its
   77.6mm case: a near-flat titanium rail, a uniform bezel, and the
   centred punch-hole that lands in the application's own white header.

   The caller owns the sizing container and must set
   `containerType: "inline-size"` on it, since cqw resolves against the
   nearest such ancestor. */

export const PHONE_BODY_W = 100;
export const PHONE_BEZEL_X = 2.7;
export const PHONE_BEZEL_TOP = 2.7;
export const PHONE_BEZEL_BOTTOM = 2.7;
export const PHONE_SCREEN_W = PHONE_BODY_W - 2 * PHONE_BEZEL_X;
export const PHONE_BODY_RADIUS = 7.4;
export const PHONE_SCREEN_RADIUS = 5.2;

/** The prototype's own capture ratio, 1608 × 3496, which is what the
    handset was drawn around. */
export const PHONE_SCREEN_ASPECT = 3496 / 1608;

export const phoneScreenH = (aspect: number = PHONE_SCREEN_ASPECT) =>
  PHONE_SCREEN_W * aspect;
export const phoneBodyH = (aspect: number = PHONE_SCREEN_ASPECT) =>
  PHONE_BEZEL_TOP + phoneScreenH(aspect) + PHONE_BEZEL_BOTTOM;

/* Titanium Silverblue: a cool grey rail that keeps a lit edge against the
   page's black without ever going bright. */
const FRAME_FILL =
  "linear-gradient(122deg,#6E727B 0%,#3D414A 16%,#282B32 38%,#2E323A 62%,#4A4E57 84%,#22252B 100%)";

const RAIL_FILL = "linear-gradient(180deg,#585C65 0%,#33363D 55%,#1E2026 100%)";

const rail = (top: string, height: string): CSSProperties => ({
  right: "-0.5cqw",
  top,
  width: "0.6cqw",
  height,
  borderRadius: "0.3cqw",
  background: RAIL_FILL,
});

export function GalaxyPhoneShell({
  aspect = PHONE_SCREEN_ASPECT,
  screenRef,
  children,
  overlay,
}: {
  /** Screen height as a multiple of its width. */
  aspect?: number;
  screenRef?: Ref<HTMLDivElement>;
  /** Everything behind the glass; it clips to the screen's radius. */
  children: ReactNode;
  /** A layer above the glass, clipped to the body outline instead — for
      anything that may lap onto the bezel, the way a hand would. */
  overlay?: ReactNode;
}) {
  const screenH = phoneScreenH(aspect);
  const bodyH = phoneBodyH(aspect);

  return (
    <div
      className="relative mx-auto"
      style={{
        width: `${PHONE_BODY_W}cqw`,
        height: `${bodyH.toFixed(3)}cqw`,
        borderRadius: `${PHONE_BODY_RADIUS}cqw`,
        backgroundImage: FRAME_FILL,
        /* The page ground is black, so the machined rail is the only thing
           separating the handset from it: a bright inner edge, a soft
           outer one, and the shadow it sits in. */
        boxShadow:
          "inset 0 0 0 0.14cqw rgba(255,255,255,0.3), inset 0 0.2cqw 0.5cqw rgba(255,255,255,0.09), 0 0 0 0.08cqw rgba(255,255,255,0.06), 0 3cqw 6cqw rgba(0,0,0,0.55)",
      }}
    >
      {/* Volume rocker and side key, on the right rail. */}
      <span aria-hidden="true" className="absolute" style={rail("22cqw", "13cqw")} />
      <span aria-hidden="true" className="absolute" style={rail("38cqw", "8cqw")} />

      <div
        ref={screenRef}
        className="absolute overflow-hidden bg-white"
        style={{
          left: `${PHONE_BEZEL_X}cqw`,
          top: `${PHONE_BEZEL_TOP}cqw`,
          width: `${PHONE_SCREEN_W}cqw`,
          height: `${screenH.toFixed(3)}cqw`,
          borderRadius: `${PHONE_SCREEN_RADIUS}cqw`,
        }}
      >
        {children}

        {/* Punch-hole camera, over the application's own white header. */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 rounded-full"
          style={{
            top: "3.2cqw",
            width: "2.4cqw",
            height: "2.4cqw",
            marginLeft: "-1.2cqw",
            background: "radial-gradient(circle at 34% 28%,#2B2E36 0%,#0C0D10 62%,#050506 100%)",
            boxShadow: "0 0 0 0.09cqw rgba(255,255,255,0.14)",
          }}
        />
      </div>

      {overlay ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ borderRadius: `${PHONE_BODY_RADIUS}cqw` }}
        >
          {overlay}
        </div>
      ) : null}
    </div>
  );
}
