# Design System — TimV Website

The rules this site already follows, written down. Everything here was read off
the built site, not invented for it: if a value appears below, it appears in the
source. Use it as the reference for anything new, and change it here first when
the site's behaviour genuinely needs to change.

Two things to know before using it:

- **The odd numbers are load-bearing.** `pt-[10.28px]`, `calc(81.5vh - 214px)`,
  `clamp(0.47px, calc((100vw - 48px) / 1805), 1px)` — none of these are drift.
  Each was derived or measured, and each is explained below. Rounding them to
  "clean" values breaks something visible.
- **Tailwind v4, no config file.** There is no `tailwind.config.js`. Tokens live
  in `@theme` inside [`app/globals.css`](app/globals.css). Everything else is
  arbitrary-value utilities, because most desktop numbers come off a fixed
  design frame rather than a scale.

---

## 1. Premise

A black room with one object lit in it. The site is near-monochrome; the only
sustained colour is the work itself — video, product screens, rendered timelines.
Chrome recedes to grey pills and a single logo, and the display serif does the
talking.

Three consequences that govern every decision downstream:

1. **Colour is content, not chrome.** The interface carries no brand colour. When
   colour appears it belongs to a project, a metric, or a photograph.
2. **Hierarchy is set by size and weight, not by boxes.** There is essentially no
   card chrome on desktop; sections are separated by space, not borders.
3. **Motion states what changed.** Fades and wipes, no bounce, no attention-
   seeking loops except the two that are the content (the showreel and the
   "Next Case Study" ticker).

**Voice.** Declarative, specific, quantified. Figures are quoted exactly as
measured and always labelled with what they measure and — when they are not
achieved results — what they actually are. Never round a metric to make it read
better.

---

## 2. Colour

### 2.1 Surface

| Role | Value | Where |
| --- | --- | --- |
| Page ground | `#000` | `<body className="bg-black antialiased">` |
| Chrome fill (pills, buttons) | `#262626` | pills, top bar, back-to-home |
| Chrome fill, hover | `#333333` | back-to-home only |
| Hairline | `border-white/10` – `border-white/30` | mobile cards, dividers |

Black is the only page background on the site. There is no dark-grey "surface 2"
tier — depth comes from image and video, not from stacked greys.

### 2.2 The white ramp

Text and fills are white at a fixed set of alphas. This *is* the greyscale
palette; do not introduce hex greys for text.

| Alpha | Job |
| --- | --- |
| `white` | Headlines, metric figures, primary body |
| `white/90` `white/80` | Panel copy, card labels |
| `white/70` `white/75` | Metric labels, secondary lines |
| **`white/60`** | **The workhorse.** Section labels, eyebrows, captions, all supporting text (44 uses — the single most common colour token on the site) |
| `white/55` `white/45` | Small uppercase micro-labels |
| `white/35` | Disabled / furthest recessed |

Fills follow the same discipline: `bg-white/[0.04]` and `bg-white/5` for the
faintest card grounds, `bg-white/10` – `bg-white/30` for chips and rules, and
`bg-white/25` for the mobile card system's repeating tint.

### 2.3 Scrims

Only four gradients exist, and each has one job.

```
bg-gradient-to-t from-black/70 via-black/10 to-transparent   /* image → caption legibility */
bg-gradient-to-r from-black/85 via-black/40 to-transparent   /* left edge, over background video */
bg-gradient-to-l from-black/85 via-black/40 to-transparent   /* right edge, over background video */
```

Scrims are applied **per layer**, not as one blanket over the whole hero. If new
copy needs protection from a background, give that copy its own scrim rather than
darkening the video.

### 2.4 Project accents

Each case study carries one colour, used for the full-bleed "Next Case Study"
ticker and occasionally for a diagram accent. They are deliberately dark and
desaturated — closer to the brand than to it, so they read as a tint of the black
room rather than as a logo drop.

| Project | Accent |
| --- | --- |
| PayPal Credit German Products | `#eb2f2f` |
| PayPal Credit Applications | `#4d2d8d` |
| Meta Monthly Invoicing | `#5f7611` |
| Ms. Sunshine App | `#066c84` |
| Sutter Health Patient Portal | `#167975` |
| DoorDash Dashboard | `#f5006e` |

Inside a case study, product colours are quoted at brand value where the artefact
demands it — `#00b0d8` (PayPal Credit cyan), `#0064d1`, `#1877f2`/`#1b74e4` (Meta
blue), `#e5652a`. These belong to reconstructed UI, not to the site.

### 2.5 The résumé palette — the one exception

[`components/ui/resume-panel.tsx`](components/ui/resume-panel.tsx) is the only
light surface on the site, and the only place a fourth typeface appears. It is a
code editor: cream paper, window chrome with traffic lights, CSS-counter line
numbers, and syntax colouring that carries real meaning.

| Token | Value | Job |
| --- | --- | --- |
| Paper | `#fcf5e0` | Panel ground |
| Title bar | `#f0e4b8` | Sticky window chrome |
| Chrome border | `#e0d3a3` | 1px under the title bar |
| Gutter numerals | `#b5a47a` | Line numbers, 12px, tabular |
| Comment slate | `#7c8896` | Dates, employers, punctuation, labels |
| Brace yellow | `#fd0` | `{ }` delimiters — the most-used colour in the file |
| Role orange | `#e5652a` | Job titles |
| Type cyan | `#00b0d8` | Employment type |
| Highlights | `rgba(255,180,0,0.3)` / `rgba(0,176,216,0.18)` | Marker passes on key phrases |
| Traffic lights | `#ff5f57` `#febc2e` `#28c840` | macOS window dots |

Keep this palette sealed inside the résumé. It is a costume, not a theme.

---

## 3. Typography

### 3.1 The four faces

| Face | Variable | Weights | Job |
| --- | --- | --- | --- |
| **Libertinus Serif Display** | `--font-serif` | Regular (self-hosted OTF) | The signature. Every headline, every metric figure. Nothing else. |
| **League Spartan** | `--font-sans` / `--font-league-spartan` | 300 / 400 / 600 / 700 | Everything else: body, labels, pills, nav, the ticker. |
| **PT Serif** | `--font-pt-serif` | 400 / 700 | Reconstructed product UI inside case studies. |
| **JetBrains Mono** | `--font-jetbrains-mono` | 400 | Résumé panel only. |

Libertinus is loaded with `@font-face` from `/fonts/LibertinusSerif_OTF/` and
`font-display: swap`; the other three come through `next/font/google` in
[`app/layout.tsx`](app/layout.tsx). Body weight defaults to **light (300)** —
`font-light` is the site's normal, not an exception.

### 3.2 The scale

The case-study scale is tokenised in
[`components/case-study/types.ts`](components/case-study/types.ts). Use the
constants; do not re-type the classes.

| Token | Desktop | Mobile | Notes |
| --- | --- | --- | --- |
| `CASE_STUDY_HEADLINE_CLASS` | 96px / 96px lh | `clamp(36px, 9vw, 96px)` | serif, `tracking-[-0.015em]` |
| `CASE_STUDY_LEAD_CLASS` | 48px / 1.3 | `clamp(20px, 4.5vw, 48px)` | light |
| `CASE_STUDY_METRIC_VALUE_CLASS` | 72px | `clamp(40px, 9vw, 72px)` | serif, `leading-none`, `.metric-figure` |
| `CASE_STUDY_FACT_VALUE_CLASS` | 32px / 42px | 18px | light |
| `CASE_STUDY_BODY_CLASS` | 24px / 1.4 | 16px / 1.5 | light |
| `CASE_STUDY_LABEL_CLASS` | 18px | 14px | `text-white/60` |
| `CASE_STUDY_SUPPORTING_CLASS` | 18px | 14px | `leading-snug` |
| `CASE_STUDY_CAPTION_CLASS` | 18px | 14px | `text-white/60` |
| `CASE_STUDY_METRIC_LABEL_CLASS` | 18px | 14px | `mt-[17px]`, `.metric-label` |

Paragraph rhythm is set in ems so it tracks the type size:
`CASE_STUDY_LEAD_GAP_CLASS` = `gap-[1.3em]`, `CASE_STUDY_BODY_GAP_CLASS` =
`gap-[1.4em]`. Block internals use `CASE_STUDY_STACK_CLASS`
(`flex w-full flex-col gap-[14px]`).

Homepage type sits outside those tokens because it is viewport-driven:

| Element | Value |
| --- | --- |
| Hero headline | `clamp(46px, min(6.02vw, 9.6vh), 77px)`, `leading-[0.96]`, `tracking-[-0.015em]`, serif |
| Mobile H1 | `clamp(40px, 11vw, 72px)` |
| Positioning line | 24px / 28px, `tracking-[-0.015em]`, light |
| Panel copy | `clamp(17px, calc(var(--rollover-band) * 0.055), 24px)` / `1.4`, light, right-aligned, `text-white/80` — the body size at the 1280x800 reference, scaled down off the same band that caps the panel art so the column keeps clearing the hero headline |
| Panel metric | 58px serif over an 18px label |
| Micro-label | 11px, uppercase, `tracking-[0.18em]`, `text-white/45` |
| "Next Case Study" ticker | `clamp(96px, 24vw, 250px)`, `leading-1`, League Spartan |

### 3.3 Tracking

Negative tracking on display sizes, wide tracking on micro-labels, nothing in
between.

- `tracking-[-0.015em]` — hero and case-study headlines
- `tracking-[-0.01em]` — large body and leads
- `tracking-[-0.96px]` / `-0.64px` / `-0.32px` / `-0.24px` — fixed-size display
  text inside case-study canvases, where the design frame specified points
- `tracking-[0.18em]` — the 11px uppercase micro-label (also `0.14em`, `0.15em`
  on chips)

### 3.4 Two optical corrections — do not "clean these up"

**League Spartan ascent, on every pill.** The face's ascent (0.74em) overshoots
its cap height (0.66em), so a `leading-none` label renders visibly high in a
pill. The fix is **split padding whose total equals the original symmetric
padding**, so heights never change:

| Size | Padding | Shift down | Original |
| --- | --- | --- | --- |
| 16px | `pt-[10.28px] pb-[5.72px]` | 2.28px | `py-2` (16px total) |
| 18px | `pt-[13.94px] pb-[10.06px]` | 1.94px | `py-3` (24px total) |
| 20px | `pt-[13.6px] pb-[10.4px]` | 1.60px | `py-3` (24px total) |
| 32px | `pt-[19.56px] pb-[12.44px]` | 3.56px | `py-4` (32px total) |

The shifts are **measured per size, not proportional** — browsers round font
ascent to whole pixels, so the correction does not scale linearly. Never convert
them to `em`, and never interpolate a new size: measure it. Sizes 18/20/32 are
already packaged in `CTA_PILL_SIZE` in
[`components/ui/cta-pill.tsx`](components/ui/cta-pill.tsx).

**Figure-over-label trim.** A text box is taller than its ink: the display serif
reserves ~12px of descender under a row of digits and a label reserves ~6px above
its cap height, so a stated gap renders ~15px larger than it reads. Two utility
classes in `globals.css` fix it:

```css
.metric-figure { text-box: trim-end text alphabetic; }
.metric-label  { text-box: trim-start cap text; }
```

With them, the gap in the markup is the gap on screen: **14px** on homepage
panels, **17px** on case studies. Firefox has no `text-box` and falls back to the
untrimmed spacing — acceptable, and the reason the gap values differ by surface.
Any new figure/label pair must use both classes or its spacing will not match.

---

## 4. Space and layout

### 4.1 Breakpoints

`sm: 480px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.

**`lg` is the real boundary.** Below it the site is a scrolling stack of cards;
at and above it, the homepage becomes a fixed full-viewport composition and case
studies switch to their design-frame pixel values. The homepage ships two
distinct trees — `lg:hidden` and `hidden lg:flex` — not one responsive layout.

### 4.2 Gutter

`px-5 lg:px-[24px]` — 20px mobile, 24px desktop, everywhere. The desktop 24px is
the same figure the design canvas subtracts, so it is not free to change.

### 4.3 Vertical rhythm

Desktop values come off the design frame; the mobile pair is the nearest Tailwind
step. Reach for an existing pair before inventing a number.

| Pair | Use |
| --- | --- |
| `mt-24 lg:mt-[200px]` / `pb-24 lg:pb-[200px]` | Major section break |
| `mt-20 lg:mt-[167px]` | Secondary break |
| `pt-16 lg:pt-[78px]` | Block opener |
| `py-12 lg:py-[75px]` / `py-6 lg:py-[42px]` | Banded section padding |
| `gap-10 lg:gap-[62px]` | Column gap in a two-up |
| `gap-8 lg:gap-[46px]` | Related blocks |
| `gap-4 lg:gap-[27px]` | Within a block |
| `gap-3 lg:gap-[18px]` | Tight pairs |

### 4.4 Content widths

Text measure is capped hard; media runs wide. Recurring desktop widths:
**1335 / 1333** (full text column), **1045**, **861**, **688 / 671**, **437**
(the standard narrow column, 21 uses), **408**, **260**, **200**. Media caps sit
at **1600 / 1563 / 1476 / 1417 / 1279**.

### 4.5 The design-canvas unit

Case-study timeline canvases are absolutely positioned reconstructions of a
1853px Figma frame. Rather than converting every coordinate, the canvas sets a
font size where **1em === 1 frame pixel**:

```ts
const DESIGN_UNIT = "clamp(0.47px, calc((100vw - 48px) / 1805), 1px)";
```

1805 = 1853 − 48 (the two 24px gutters). The `1px` ceiling stops it scaling past
its design size; the `0.47px` floor is a legibility limit — below it the canvas
stops shrinking and the container scrolls (via `DragScroll`). Shapes are placed
with a `box(x, y, w, h)` helper reading straight off the frame.

Use this pattern for any pixel-faithful reconstruction. Do not use it for
ordinary page content.

### 4.6 The rollover band

Homepage rollover panels hang from the nav band; the hero headline is anchored
50px off the bottom. The gap between them closes as the viewport shortens — and
closes faster than the viewport, because the headline scales with height too. So
panel height is capped against a derived variable rather than stepped through
media queries:

```css
:root                { --rollover-band: calc(81.5vh - 214px); }  /* hover */
.rollover-band-idle  { --rollover-band: calc(90.7vh - 287px); }  /* showreel */
```

The headline's top is `100vh - 50px - lines * 0.96 * min(77px, 9.6vh)`; subtract
the panel's top offset and 16px of clearance. Below 9.6vh the headline is
height-driven, above it it holds at 77px and the expression under-states the real
gap — wrong in the safe direction.

There is **one** band, not one per project, because every panel of an orientation
is now the same height: the figure has to be the room the worst-placed of them
has. The idle variant uses the one-line coefficient (the showreel headline is
always the name) but a larger subtraction, because the positioning block sits at
full height instead of collapsed. The two land within a pixel at 800px tall, so
panels do not resize when the pointer arrives.

Panel heights consume it:

```ts
PORTRAIT_PANEL_HEIGHT  = "min(532px, var(--rollover-band))"
LANDSCAPE_PANEL_HEIGHT = "min(394px, var(--rollover-band))"
```

All four portraits share one height; both landscapes share another. Aspect ratios
stay native per image.

### 4.7 Radius

| Value | Use |
| --- | --- |
| `rounded-full` | Every pill, chip, and dot (32 uses) |
| `rounded-[30px]` | The standard card/panel radius (17 uses) |
| `rounded-[24px]` / `rounded-2xl` / `rounded-3xl` | Secondary containers |
| `rounded-[8px]` / `[10px]` / `[6px]` | Small inset elements, reconstructed UI |

Two radii carry the site: full and 30px. Anything else should be reproducing a
product artefact.

---

## 5. Motion

### 5.1 Durations

`150ms` colour/hover · `300ms` short fade · `500ms` chrome fade · `700ms` scroll
reveal. Longer, hand-tuned figures belong to the panel system and the showreel
below.

### 5.2 Easing

| Curve | Use |
| --- | --- |
| `[0.22, 1, 0.36, 1]` | Entrances, wipes, panel slides — the site's signature ease-out |
| `[0.25, 0.1, 0.25, 1]` | Scroll reveals |
| `[0.4, 0, 0.6, 1]` | Showreel crossfades — symmetric, so in and out feel identical |
| ease-out cubic | Counter roll-ups |
| `linear` | The ticker only |

No spring, no overshoot, no bounce anywhere on the site. Keep it that way.

### 5.3 The two panel modes

Rollover panels animate differently depending on why they appeared
([`components/home-client.tsx`](components/home-client.tsx)):

**Hover** — deliberate, and the image reveals rather than fades:

```
shell: opacity 1 → exit 0            0.20s
copy:  opacity 0 → 1                 0.35s, delay 0.25s
image: clipPath inset(100% 0 0 0) → inset(0)   0.60s, [0.22,1,0.36,1]
```

**Showreel** — plain opacity, no wipe, because a wipe repeating on a timer reads
as a loading state.

```ts
SHOWREEL = { COPY_LEAD: 0.15, FADE_IN: 0.9, HOLD: 3, FADE_OUT: 0.7, GAP: 0.6 }
SHOWREEL_EASE = [0.4, 0, 0.6, 1]
// step 5350ms · full loop 32.1s
```

The `GAP` is non-negotiable: each panel must be fully out before the next starts
in. Copy leads the image by 150ms so the two do not arrive as one flat block.
The reel pauses on any hover, and does not run at all under reduced motion.

### 5.4 Scroll reveal

One primitive, [`components/ui/scroll-fade.tsx`](components/ui/scroll-fade.tsx):
opacity 0 + `x: ±60`, 0.7s, `[0.25, 0.1, 0.25, 1]`, `viewport margin -60px`, and
`once: false` by default so it re-plays on scroll back. Case-study blocks reach
it through a `reveal` prop (`"none" | "left" | "right"`); `"none"` adds no DOM
and no motion. Never add a second reveal mechanism — reduced-motion behaviour is
correct in one place only.

### 5.5 Named motions

| Component | Behaviour |
| --- | --- |
| Résumé panel (desktop) | Width `0 → 717px`, 0.5s `[0.22,1,0.36,1]` |
| Résumé sheet (mobile) | `y: 100% → 0`, 0.4s, with a `bg-black/60 backdrop-blur-sm` scrim at 0.25s |
| Case-study top bar | Opacity → 0 over 500ms when `#next-case-study-section` intersects |
| Hero headline swap | `AnimatePresence mode="wait"`, 0.25s opacity |
| Positioning block | Collapses `height: auto → 12px` with opacity, 0.25s, on hover |
| `CounterNumber` | 1200ms ease-out cubic, fires once at 40% visibility |
| `NextCaseStudyTicker` | `ticker-scroll` 13.5s linear infinite, 50% translate on a duplicated span |
| `ImageSpotlight` | ±8° tilt, 0.2s ease-out, radial mask follows the cursor |

### 5.6 Reduced motion

Honoured in six places: the showreel, the intro montage, `DragScroll`,
`AsciiCubes`, `CardStack`, `ActivityFlowCarousel`, `DashboardAssembleReveal`.
Either `useReducedMotion()` from framer-motion or a `matchMedia` check — match
whichever the surrounding file uses. Touch devices additionally get
`@media (hover: none) { .cursor-none { cursor: auto !important; } }`.

**Any new autonomous motion must check it.** Hover-triggered motion need not.

---

## 6. Components

### 6.1 Pill

The site's only button. `rounded-full`, 16px League Spartan, `leading-none`,
split padding, 1px border, 150ms colour transition.

```
idle    bg-[#262626] text-white border-transparent  hover:border-white
active  bg-white text-black border-white
```

Hover changes the **border**, not the fill — the fill only moves for a genuine
selected state. `PillButton` renders a `<Link>` when given `href`, a `<button>`
otherwise.

### 6.2 CTA pill

Larger relative, sized through `CTA_PILL_SIZE` (`lg` = 18px → 32px at `lg`;
`xl` = 20px → 32px). `BackToHomeButton` is the canonical instance: `px-6
lg:px-[30px]`, `hover:bg-[#333333]`.

### 6.3 Rollover panel (desktop homepage)

Image plus a right-aligned copy column 40px to its left, in a 350px measure.
Copy anchoring follows one rule:

> Bottom-anchor the copy **80px above the image's lower edge**
> (`PANEL_COPY_CLASS`). If that would push it past the top of the image, switch
> the whole panel to **vertical centring** (`CENTERED_PANEL_COPY_CLASS`,
> `top-1/2 -translate-y-1/2`).

Currently 3 panels each way. Re-check after any copy or height change — the
split is a consequence, not a setting.

Panel copy stack, top to bottom: metric figure (58px serif) → metric label (18px
`white/70`) → description (24px/1.4 `white/80` at the reference height, band-scaled
down to a 17px floor). The figure and label are fixed, so the description is the
only part of the stack that gives when the viewport shortens. Behind each panel
sits either a muted background video (30–50% opacity) or a generative canvas.

No paragraph on this site ends with a single word alone on its last line. The
rollover copy resizes with the viewport, so a sentence that rags cleanly at the
reference height widows two hundred pixels down; `cardProblem()` binds each
paragraph's final two words with a non-breaking space so the last line always
carries at least two, on the cards as well as the panels. Apply the same rule to
any new body copy.

### 6.4 Card (mobile / tablet)

The only place card chrome exists:

```
rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm
active:scale-[0.99] transition-transform duration-150
```

Image `aspect-[4/3] sm:aspect-[16/10]` under a
`from-black/70 via-black/10 to-transparent` scrim. Two chip forms: solid
(`bg-black/60`, 12px) and outlined (`border-white/20 bg-black/45`, 10px
uppercase `tracking-[0.14em]`).

### 6.5 `CaseStudySection`

Every case-study block funnels through one wrapper
([`case-study-section.tsx`](components/case-study/case-study-section.tsx)), which
owns element choice, reveal, heading level, heading class, and the
`aria-labelledby` tie between a `<section>` and its heading. Compose it; do not
re-implement the wrapper. `CaseStudyHeader` extends it and reads eyebrow and H1
from the shared project record so a page title cannot drift from metadata.

### 6.6 Metric

Serif figure over a `white/60` label, both trimmed (§3.4). One to three per
section — `OutcomeMetrics` **throws** past three, deliberately: "more than three
stops being a result and starts being a report."

Every figure declares a status — `achieved | estimated | projected | target |
baseline` — and anything other than `achieved` renders its status **as words**,
never as colour alone, so the distinction survives greyscale, high contrast, and
screen readers. Figures are built from the shared `ProjectResult` records in
[`lib/content.ts`](lib/content.ts) so a number and its wording cannot diverge
between the homepage card, the rollover, and the case study.

### 6.7 Content layer

All copy lives in `lib/content.ts`: `SITE`, `CAPABILITIES`, and a `PROJECTS`
array whose `Project` type is documented field by field. It feeds the homepage,
the case studies, `app/layout.tsx` metadata, and the JSON-LD `@graph`
(Person + WebSite + one CreativeWork per project). **Never hard-code a project
string in a component.** Adding a surface means adding a field, not a literal.

---

## 7. Page patterns

**Homepage, desktop (≥1024px).** One fixed viewport, `p-[24px]`, no page scroll.
Header pill and logo top; left nav of project pills; hero headline anchored 50px
off the bottom with a reserved right column (`clamp(320px, 26vw, 480px)`);
rollover panels hanging top-right. Idle, it runs the showreel; on hover it swaps
the headline, reveals the hovered panel, and collapses the positioning block.

**Homepage, mobile.** `min-h-[100svh]`, a `gap-10 sm:gap-14` stack of `WorkCard`s
at `px-5 sm:px-6 pt-6 pb-16`. Carries the supporting paragraph the desktop layout
gave up to the showreel.

**Case study.** `<main className="bg-black text-white">` → fixed top bar (with an
invisible spacer preserving flow height) → `CaseStudyHeader` → composed blocks →
`#next-case-study-section` with the accent ticker. Sections at `px-5
lg:px-[24px]`, content in the §4.4 widths, rhythm from §4.3.

---

## 8. Accessibility

Already established, and worth keeping:

- **Focus.** The site token is `CASE_STUDY_FOCUS_CLASS` —
  `focus-visible:outline-2 focus-visible:outline-offset-4
  focus-visible:outline-white/70`. Offset 4 so the ring clears a `rounded-full`
  edge. Apply it to anything focusable you add.
- **Names.** `CaseStudySection` wires `aria-labelledby` automatically; use
  `titleHidden` for an `sr-only` heading rather than dropping the heading.
- **Landmarks.** One exposed `<main>` per page. The homepage ships two — desktop
  and mobile — but `lg:hidden` / `hidden lg:flex` are `display: none`, so exactly
  one is in the accessibility tree at any viewport. Keep them mutually exclusive.
  `CaseStudyHeader` renders `<header>` nested inside sectioning content so it
  does not become a banner.
- **Decoration is hidden.** The ticker, scrims, and canvases carry `aria-hidden`;
  the top-bar spacer is `aria-hidden inert`.
- **Never colour alone.** Metric status is text (§6.6). Applies to anything new.
- **Reduced motion** — §5.6.

Two gaps worth closing when touched:

- **Focus styling is barely applied.** `CASE_STUDY_FOCUS_CLASS` is imported by
  exactly one component (`supporting-appendix.tsx`), and the only other focus
  treatment on the site is a `ring-2 ring-white/50` inside
  `ActivityFlowCarousel`. Every pill, nav link, and mobile card falls back to the
  user-agent ring — which on `#262626` is weak. New focusable elements should
  take the token; existing ones should as they are touched.
- **`text-white/45` at 11px** sits below 4.5:1 on black. Fine as a decorative
  micro-label, not for anything a reader must have.

---

## 9. Working rules

1. **Read a token before writing a value.** Case-study type, CTA sizes, panel
   heights, and rhythm pairs already exist. New arbitrary values need a reason.
2. **Copy lives in `lib/content.ts`.** Components render records.
3. **New pixel value on desktop?** It probably comes off the design frame. Say so
   in a comment.
4. **Comment the derivations, not the obvious.** The existing comments in
   `globals.css`, `pill-button.tsx`, and `home-client.tsx` are the model: what the
   number is, what it was derived from, and what breaks if it changes.
5. **No new colour without a reason that lives in the content.** The interface
   palette is black, the white ramp, and `#262626`.
6. **No new motion primitive.** Extend `ScrollFade`, or use the panel modes.
7. **Test at short viewports.** The homepage is height-driven; 1280×800 is the
   working reference and 1280×640 is where the band actually bites.
8. **Tailwind v4 scanner gotcha.** A class name immediately adjacent to `${` is
   not extracted — `` `... h-screen ${expr}` `` needs the space.

---

## 10. Known inconsistencies

Recorded so they are decisions, not surprises.

- **Rollover panel frames do not share an origin.** Tops run 139 / 139 / 148 /
  143 / 143 / 148px, and Ms. Sunshine alone sits at `right-[93px]` against the
  other five at `right-[69px]`. The frame therefore jitters ~4–9px vertically and
  24px horizontally as the showreel steps. Heights are unified; positions are
  not.
- **`--font-mono` in `@theme` is `ui-monospace`**, but the résumé sets JetBrains
  Mono inline via `var(--font-jetbrains-mono)`. The `@theme` token is effectively
  unused.
- **`text-box` is Chromium-only.** Firefox gets ~15px more air under every metric
  figure. Accepted.
- **Case-study pages carry local constants** (`CYAN`, `PANEL`, `DESIGN_UNIT`,
  `box`) rather than sharing them. Fine while each page reconstructs a different
  product; worth extracting if a third page needs the same canvas.
