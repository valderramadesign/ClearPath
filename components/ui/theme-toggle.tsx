"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "day";

const STORAGE_KEY = "tim-v-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "day" ? "light" : "dark";
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The theme still works for this visit when storage is unavailable.
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "day" ? "day" : "dark";
    setTheme(current);
  }, []);

  const dayMode = theme === "day";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dayMode}
      aria-label={dayMode ? "Use dark theme" : "Use day theme"}
      title={dayMode ? "Use dark theme" : "Use day theme"}
      className="theme-toggle"
      onClick={() => {
        const nextTheme: Theme = dayMode ? "dark" : "day";
        applyTheme(nextTheme);
        setTheme(nextTheme);
      }}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <Sun className="theme-toggle__sun" strokeWidth={1.75} />
        <Moon className="theme-toggle__moon" strokeWidth={1.75} />
        <span className="theme-toggle__thumb" />
      </span>
    </button>
  );
}
