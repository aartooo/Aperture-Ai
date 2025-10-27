// FILE: frontend/components/ThemeSwitcher.tsx
// (This is the full code for this file)

"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cycleTheme = () => {
    if (resolvedTheme === "light") {
      setTheme("dark");
    } else if (resolvedTheme === "dark") {
      setTheme("black");
    } else if (resolvedTheme === "black") {
      setTheme("light");
    }
  };

  if (!mounted) {
    // Render a placeholder
    return (
      <button
        className="h-9 w-9 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
        aria-label="Loading theme"
        disabled
      />
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-background-secondary text-text-primary shadow-sm transition-all hover:bg-border"
      aria-label="Toggle theme"
    >
      {/* Sun Icon (Light) */}
      {resolvedTheme === "light" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 011.06-1.06l1.591 1.59a.75.75 0 01-1.06 1.06l-1.59-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.894 17.894a.75.75 0 011.06 1.06l-1.59 1.591a.75.75 0 01-1.06-1.06l1.59-1.59zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM6.106 17.894a.75.75 0 011.06-1.06l1.59 1.59a.75.75 0 11-1.06 1.06l-1.59-1.59zM3 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3.75A.75.75 0 013 12zM6.106 6.106a.75.75 0 011.06 1.06l-1.59 1.591a.75.75 0 01-1.06-1.06l1.59-1.59z" />
        </svg>
      )}
      {/* Moon Icon (Dark) */}
      {resolvedTheme === "dark" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6.75a8.969 8.969 0 008.969 8.969 8.97 8.97 0 005.215-1.668.75.75 0 01.819.162l.305.305a.75.75 0 01-.162.819A10.47 10.47 0 0118 19.5a10.47 10.47 0 01-10.47-10.47 10.47 10.47 0 012.829-7.171l.305.305z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {/* Star Icon (Black) */}
      {resolvedTheme === "black" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.597 2.89c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}