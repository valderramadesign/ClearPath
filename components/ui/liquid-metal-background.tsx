"use client";

import { useEffect, useRef, useState } from "react";
import { LiquidMetal, liquidMetalPresets } from "@paper-design/shaders-react";

export default function LiquidMetalBackground() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      // Map cursor to a gentle -0.5 → 0.5 range so movement feels subtle
      target.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 1,
        y: (e.clientY / window.innerHeight - 0.5) * 1,
      };
    };

    const tick = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      // 0.025 = moves ~2.5% of remaining distance per frame → feels slow and organic
      current.current.x = lerp(current.current.x, target.current.x, 0.025);
      current.current.y = lerp(current.current.y, target.current.y, 0.025);
      setOffset({ x: current.current.x, y: current.current.y });
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <LiquidMetal
      {...liquidMetalPresets[2]}
      shape="metaballs"
      colorBack="#000000"
      scale={1.5}
      offsetX={offset.x}
      offsetY={offset.y}
      className="theme-liquid-metal"
      style={{ position: "fixed", inset: 0, zIndex: -10 }}
    />
  );
}
