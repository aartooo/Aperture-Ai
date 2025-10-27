// FILE: frontend/components/ArticleCarousel.tsx
// (Updated with mobile arrow buttons)

"use client";

import { Article } from "../lib/types";
import { ArticleCard } from "./ArticleCard";
import { ArrowLeftIcon, ArrowRightIcon } from "./Icons";
import React, { useRef } from "react";

interface ArticleCarouselProps {
  articles: Article[];
}

export function ArticleCarousel({ articles }: ArticleCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.9;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.9;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Left Arrow - Now visible on mobile too */}
      <button
        onClick={scrollLeft}
        className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-background-secondary text-text-primary shadow-md transition-all hover:bg-border hover:scale-105 active:scale-95"
        aria-label="Scroll left"
      >
        <ArrowLeftIcon />
      </button>

      {/* Article Row */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-6 overflow-x-scroll scrollbar-hide scroll-smooth py-4 px-8 sm:px-12"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {articles.map((article) => (
          <div
            key={article.id}
            className="w-[300px] flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <ArticleCard article={article} />
          </div>
        ))}
      </div>

      {/* Right Arrow - Now visible on mobile too */}
      <button
        onClick={scrollRight}
        className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-background-secondary text-text-primary shadow-md transition-all hover:bg-border hover:scale-105 active:scale-95"
        aria-label="Scroll right"
      >
        <ArrowRightIcon />
      </button>
    </div>
  );
}