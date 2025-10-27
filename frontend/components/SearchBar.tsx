// FILE: frontend/components/SearchBar.tsx
// (This is a new file. Use this full code.)

"use client";

import { SearchIcon } from "./Icons";

export function SearchBar() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search logic will be added in a future batch
    console.log("Search submitted");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full"
    >
      <input
        type="search"
        placeholder="Search all articles..."
        className="w-full rounded-full border border-border bg-background-secondary px-6 py-4 pr-12 text-base text-text-primary placeholder-text-secondary focus:border-text-accent focus:outline-none focus:ring-1 focus:ring-text-accent"
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center pr-5 text-text-secondary transition-colors hover:text-text-primary"
        aria-label="Search"
      >
        <SearchIcon />
      </button>
    </form>
  );
}