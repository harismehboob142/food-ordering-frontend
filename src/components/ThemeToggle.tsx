// src/components/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-105 transition"
        aria-label="Toggle Theme"
      >
        {theme === "light" ? (
          <MoonIcon className="w-5 h-5 text-white" />
        ) : (
          <SunIcon className="w-5 h-5 text-yellow-400" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
