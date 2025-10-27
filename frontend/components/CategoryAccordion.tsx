// FILE: frontend/components/CategoryAccordion.tsx
// Modern, beautiful category UI with hover expansion

"use client";
import { FlatCategory } from "../lib/types";
import Link from "next/link";
import React, { useState } from "react";
import { ChevronRightIcon } from "./Icons";

interface CategoryAccordionProps {
  categories: FlatCategory[];
}

export function CategoryAccordion({ categories }: CategoryAccordionProps) {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Explore Topics
        </h2>
        <p className="text-sm text-text-secondary">
          Discover articles across our curated categories
        </p>
      </div>

      {/* Categories Container */}
      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            className="group relative"
          >
            {/* Main Category Card */}
            <Link href={`/categories/${category.slug}`}>
              <div
                className={`
                  relative overflow-hidden rounded-xl border-2 
                  transition-all duration-300 ease-out
                  ${
                    hoveredCategory === category.id
                      ? "border-accent bg-accent/5 shadow-lg shadow-accent/20 scale-[1.02]"
                      : "border-border/30 bg-background-secondary/50 hover:border-accent/50"
                  }
                `}
              >
                {/* Gradient Overlay on Hover */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent 
                    transition-opacity duration-300
                    ${hoveredCategory === category.id ? "opacity-100" : "opacity-0"}
                  `}
                />

                {/* Content */}
                <div className="relative px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Icon Circle */}
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300
                        ${
                          hoveredCategory === category.id
                            ? "bg-accent text-white scale-110"
                            : "bg-accent/10 text-accent"
                        }
                      `}
                    >
                      <CategoryIcon name={category.name} />
                    </div>

                    {/* Category Name */}
                    <div>
                      <h3
                        className={`
                          font-bold transition-colors duration-300
                          ${
                            hoveredCategory === category.id
                              ? "text-accent"
                              : "text-text-primary"
                          }
                        `}
                      >
                        {category.name}
                      </h3>
                      {category.children && category.children.length > 0 && (
                        <p className="text-xs text-text-secondary mt-0.5">
                          {category.children.length} subcategories
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div
                    className={`
                      transition-all duration-300
                      ${
                        hoveredCategory === category.id
                          ? "translate-x-1 text-accent"
                          : "text-text-secondary"
                      }
                    `}
                  >
                    <ChevronRightIcon />
                  </div>
                </div>
              </div>
            </Link>

            {/* Subcategories - Expanding on Hover */}
            {category.children && category.children.length > 0 && (
              <div
                className={`
                  overflow-hidden transition-all duration-300 ease-out origin-top
                  ${
                    hoveredCategory === category.id
                      ? "max-h-[500px] opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                  }
                `}
              >
                <div className="ml-4 space-y-2 pl-4 border-l-2 border-accent/20">
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/categories/${child.slug}`}
                      className="block group/sub"
                    >
                      <div
                        className="
                          px-4 py-2.5 rounded-lg
                          bg-background-secondary/30
                          border border-border/20
                          hover:border-accent/40 hover:bg-accent/5
                          transition-all duration-200
                          flex items-center justify-between
                        "
                      >
                        <span className="text-sm font-medium text-text-primary group-hover/sub:text-accent transition-colors">
                          {child.name}
                        </span>
                        <ChevronRightIcon className="w-3 h-3 text-text-secondary group-hover/sub:text-accent group-hover/sub:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Decorative Element */}
      <div className="mt-8 pt-6 border-t border-border/30">
        <p className="text-xs text-text-secondary text-center">
          Can't find what you're looking for?{" "}
          <Link href="/search" className="text-accent hover:underline font-medium">
            Try searching
          </Link>
        </p>
      </div>
    </div>
  );
}

// Category Icon Component
function CategoryIcon({ name }: { name: string }) {
  // You can customize icons based on category names
  const getIcon = (categoryName: string) => {
    const lowerName = categoryName.toLowerCase();
    
    if (lowerName.includes("ai") || lowerName.includes("tool")) {
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    }
    
    if (lowerName.includes("news")) {
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      );
    }
    
    if (lowerName.includes("review")) {
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    }
    
    if (lowerName.includes("culture") || lowerName.includes("ethic")) {
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    }
    
    // Default icon
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  };

  return getIcon(name);
}