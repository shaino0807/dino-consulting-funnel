"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", shouldUseDark);
    const frame = window.requestAnimationFrame(() => setIsDark(shouldUseDark));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  const Icon = isDark ? Sun : Moon;

  return (
    <Button
      aria-label={isDark ? "切換為淺色模式" : "切換為深色模式"}
      className="bg-card/85 backdrop-blur hover:bg-card"
      onClick={toggleTheme}
      size="icon"
      type="button"
      variant="outline"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
