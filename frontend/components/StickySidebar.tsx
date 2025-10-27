// FILE: frontend/components/StickySidebar.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface StickySidebarProps {
  children: React.ReactNode;
  side: "left" | "right";
}

export function StickySidebar({ children, side }: StickySidebarProps) {
  const [stopPosition, setStopPosition] = useState<number | null>(null);

  useEffect(() => {
    const calculateStopPosition = () => {
      const footer = document.querySelector("footer");
      if (!footer) return;

      const footerTop = footer.getBoundingClientRect().top + window.scrollY;
      const viewportHeight = window.innerHeight;
      const sidebarHeight = Math.min(viewportHeight - 128, 800); // Approximate max sidebar height
      
      // Calculate where sidebar should stop (footer top - sidebar height - padding)
      const stop = footerTop - sidebarHeight - 32;
      setStopPosition(stop);
    };

    const handleScroll = () => {
      calculateStopPosition();
    };

    // Initial calculation
    calculateStopPosition();

    // Listen to Lenis scroll if available
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.on("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
    
    window.addEventListener("resize", calculateStopPosition);

    return () => {
      if (lenis) {
        lenis.off("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", calculateStopPosition);
    };
  }, []);

  const positionClass = side === "left" ? "left-4 xl:left-20" : "right-4 xl:right-20";
  
  // Check if we should stop being fixed
  const shouldStopFixed = stopPosition !== null && window.scrollY >= stopPosition;

  return (
    <div className="hidden lg:block w-64">
      <div
        className={`w-64 ${positionClass} transition-none`}
        style={{
          position: shouldStopFixed ? "absolute" : "fixed",
          top: shouldStopFixed ? `${stopPosition}px` : "6rem",
        }}
      >
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}