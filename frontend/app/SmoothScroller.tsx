// FILE: frontend/app/SmoothScroller.tsx
// (This is a new file. Use this full code.)

"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "@studio-freight/lenis";

function SmoothScroller({ children }: { children: ReactNode }) {
  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis();

    // This is the render loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []); // Only run once on mount

  return <>{children}</>;
}

export default SmoothScroller;