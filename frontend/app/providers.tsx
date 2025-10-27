// FILE: frontend/app/providers.tsx
// (This is the full code for this file)

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

// We only need the ThemeProvider now
export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={["light", "dark", "black"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}