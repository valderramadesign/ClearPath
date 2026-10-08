"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  direction?: "left" | "right";
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function ScrollFade({ children, direction = "left", once = false, className, style }: Props) {
  /* Reduced motion still gets the content, just already in place. */
  const still = useReducedMotion();
  const offset = still ? 0 : direction === "left" ? -60 : 60;

  return (
    <motion.div
      initial={{ opacity: still ? 1 : 0, x: offset }}
      whileInView={{ opacity: 1, x: 0 }}
      exit={{ opacity: still ? 1 : 0, x: offset }}
      viewport={{ once, margin: "-60px" }}
      transition={still ? { duration: 0 } : { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
