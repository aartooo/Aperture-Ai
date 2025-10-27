// FILE: frontend/components/ScrollToTopButton.tsx
// (This is the full code for this file)

"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (latest > 0.2) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* This is the reading progress bar */}
      <motion.div
        // --- FIX: Set z-index to 40 ---
        className="fixed left-0 right-0 top-0 h-1 origin-[0%] bg-text-accent z-40"
        style={{ scaleX }}
      />

      {/* This is the "Back to Top" button */}
      <motion.button
        onClick={scrollToTop}
        // --- FIX: Set z-index to 40 and adjust position ---
        className="fixed bottom-8 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-text-accent text-white shadow-lg"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        aria-label="Scroll to top"
      >
        {/* Simple SVG Arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
          />
        </svg>
      </motion.button>
    </>
  );
}