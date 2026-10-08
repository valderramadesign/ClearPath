"use client";

import { useEffect, useRef } from "react";

// AsciiCubes — a procedural grid of rounded cubes that fills its parent and
// scrolls a source image behind itself. Each cube samples the color of the
// image directly beneath it (chameleon), and its opacity is driven by organic
// value-noise so the fade variation is shapeless and spread across the surface.
export function AsciiCubes({
  active = true,
  imageSrc,
  className,
}: {
  active?: boolean;
  imageSrc: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const sampleRef = useRef<{ data: Uint8ClampedArray; w: number; h: number } | null>(null);

  // Preload the source image once and bake a small color-sample buffer from it.
  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      if (cancelled) return;
      imgRef.current = img;
      const sw = 360;
      const sh = Math.max(1, Math.round((sw * img.height) / img.width));
      const off = document.createElement("canvas");
      off.width = sw;
      off.height = sh;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, sw, sh);
      sampleRef.current = { data: octx.getImageData(0, 0, sw, sh).data, w: sw, h: sh };
    };
    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  useEffect(() => {
    if (!active) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const context = cv.getContext("2d");
    if (!context) return;
    const canvas: HTMLCanvasElement = cv;
    const ctx: CanvasRenderingContext2D = context;

    const CELL = 26; // grid pitch in px
    const CUBE = 18; // cube size in px (~20% larger than before)
    const RADIUS = 4; // slightly rounded corners
    const SPEED = 56.25; // px/sec scroll — matches the prior tuned speed
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
    }

    // Hash-based value noise → organic, shapeless clouds (no sine banding).
    function hash(ix: number, iy: number) {
      let h = (ix * 374761393 + iy * 668265263) | 0;
      h = (h ^ (h >> 13)) * 1274126177;
      return ((h ^ (h >> 16)) >>> 0) / 4294967295;
    }
    function vnoise(x: number, y: number) {
      const ix = Math.floor(x);
      const iy = Math.floor(y);
      const fx = x - ix;
      const fy = y - iy;
      const ux = fx * fx * (3 - 2 * fx);
      const uy = fy * fy * (3 - 2 * fy);
      const a = hash(ix, iy);
      const b = hash(ix + 1, iy);
      const c = hash(ix, iy + 1);
      const d = hash(ix + 1, iy + 1);
      return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
    }
    function fbm(x: number, y: number) {
      return vnoise(x, y) * 0.6 + vnoise(x * 2.1 + 5.2, y * 2.1 + 1.3) * 0.3 + vnoise(x * 4.3, y * 4.3) * 0.1;
    }

    let raf = 0;
    const start = performance.now();

    function draw(now: number) {
      const t = reduce ? 0 : (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      const img = imgRef.current;
      const sample = sampleRef.current;
      if (!img || !sample) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const aspect = img.height / img.width;
      const scaledH = width * aspect;
      const dist = Math.max(scaledH - height, 1);
      const period = Math.max(dist / SPEED, 7.5);
      const scrollY = reduce ? 0 : ((t % period) / period) * dist;

      // Dim base image so the dashboard stays legible beneath the cubes.
      ctx.globalAlpha = 0.22;
      ctx.drawImage(img, 0, -scrollY, width, scaledH);
      ctx.globalAlpha = 1;

      const sData = sample.data;
      const sw = sample.w;
      const sh = sample.h;

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const px = cx * CELL;
          const py = cy * CELL;

          // organic opacity from drifting value-noise
          const n = fbm(cx * 0.12 + t * 0.05, cy * 0.12 - t * 0.04);
          const i = Math.max(0, Math.min(1, (n - 0.2) / 0.55));
          const alpha = 0.05 + Math.pow(i, 1.4) * 0.9;

          // chameleon color: sample the image pixel under this cube
          let sx = ((px / width) * sw) | 0;
          let sy = (((py + scrollY) / scaledH) * sh) | 0;
          if (sx < 0) sx = 0;
          else if (sx >= sw) sx = sw - 1;
          if (sy < 0) sy = 0;
          else if (sy >= sh) sy = sh - 1;
          const idx = (sy * sw + sx) * 4;
          const boost = 0.45 + i * 1.05;
          const r = Math.min(sData[idx] * boost, 255) | 0;
          const g = Math.min(sData[idx + 1] * boost, 255) | 0;
          const b = Math.min(sData[idx + 2] * boost, 255) | 0;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.roundRect(px, py, CUBE, CUBE, RADIUS);
          ctx.fill();
        }
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    }

    resize();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now());
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
