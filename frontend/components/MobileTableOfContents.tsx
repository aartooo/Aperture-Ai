// FILE: frontend/components/MobileTableOfContents.tsx
// (This is a new file for the MOBILE-ONLY button and drawer)

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { StrapiBlock } from "../lib/types";
import { slugify } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ContentIcon, CloseIcon } from "./Icons"; // We assume Icons.tsx exists

function getBlockText(block: StrapiBlock): string {
  if (block.children) {
    return block.children.map((child) => child.text || "").join("");
  }
  return "";
}

// Simple smooth scroll handler
const scrollToHeading = (id: string, callback: () => void) => {
  const element = document.getElementById(id);
  if (element) {
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerHeight - 16;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
  callback(); // Close the modal
};

export function MobileTableOfContents({ blocks }: { blocks: StrapiBlock[] | null }) {
  const [isOpen, setIsOpen] = useState(false);

  const headings = useMemo(() => {
    if (!blocks) return [];
    return blocks
      .filter(
        (block): block is StrapiBlock & { type: "heading"; level: number } =>
          block.type === "heading" && (block.level === 2 || block.level === 3)
      )
      .map((headingBlock) => {
        const text = getBlockText(headingBlock);
        const id = slugify(text);
        return { id, text, level: headingBlock.level };
      });
  }, [blocks]);

  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (headings.length === 0) {
    return null; // Don't render anything if no headings
  }

  const baseLevel = Math.min(...headings.map(h => h.level));

  return (
    <>
      {/* --- Mobile Floating Button (Visible only on < LG) --- */}
      {/* --- FIX: Z-index is 40, same as ScrollToTop, but different position --- */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-background-secondary shadow-lg border border-border lg:hidden"
        aria-label="Open table of contents"
      >
        <ContentIcon />
      </motion.button>

      {/* --- Mobile Modal/Drawer --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex p-4 lg:hidden" // z-50 is highest
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-[51] m-auto w-full max-w-md rounded-xl border border-border bg-background-primary p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text-primary">
                  On This Page
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-text-secondary">
                  <CloseIcon />
                </button>
              </div>
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                {/* Re-using the list logic */}
                <ul className="space-y-3">
                  {headings.map((heading) => (
                    <li key={heading.id} style={{ paddingLeft: `${(heading.level - baseLevel) * 16}px` }}>
                      <a
                        href={`#${heading.id}`}
                        onClick={(e) => { e.preventDefault(); scrollToHeading(heading.id, () => setIsOpen(false)); }}
                        className="block text-base font-medium text-text-secondary transition-colors hover:text-text-primary"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}