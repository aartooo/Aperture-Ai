// FILE: frontend/components/TableOfContents.tsx
// (This is the NEW code for the DESKTOP-ONLY sidebar)

"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { slugify } from "../lib/utils";
import { StrapiBlock } from "../lib/types";
import React from "react";

function getBlockText(block: StrapiBlock): string {
  // Find the text from children, works for headings
  if (block.children) {
    return block.children.map((child) => child.text || "").join("");
  }
  return "";
}

// Simple smooth scroll handler
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerHeight - 16;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
};

export function TableOfContents({ blocks }: { blocks: StrapiBlock[] | null }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Parse headings from the body
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

  // IntersectionObserver to highlight the active heading
  useEffect(() => {
    if (typeof window === 'undefined' || !headings.length) return;
    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 } // Adjust margins
    );
    observerRef.current = observer;

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null; // Don't render anything if no headings
  }

  // Base level for indentation (e.g., if only H3s exist, they become the base)
  const baseLevel = Math.min(...headings.map(h => h.level));

  // This component ONLY renders the desktop sidebar.
  // It is wrapped in 'hidden lg:block' in the page.tsx file.
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-text-primary">
        On This Page
      </h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => { e.preventDefault(); scrollToHeading(heading.id); }}
              // --- Apply dynamic active styling ---
              className={`block border-l-2 text-sm transition-colors hover:border-text-accent hover:text-text-primary
                ${heading.level > baseLevel ? "pl-6 font-normal" : "pl-3 font-medium"}
                ${activeId === heading.id 
                  ? "border-text-accent text-text-primary" 
                  : "border-transparent text-text-secondary"}
              `}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}