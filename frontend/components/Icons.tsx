// FILE: frontend/components/Icons.tsx
// (This is the full, corrected code with no duplicates)

// Icon for Copy Link / Share
export const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5 mx-auto"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.19.02.38.05.57.093m-5.717 1.103a2.25 2.25 0 01.571-.093m0 0a2.25 2.25 0 014.143 1.5M1.99 8.03c.07.7.35 1.34.76 1.85m0 0c.41.51.94.92 1.5 1.23m-2.26-.05a2.25 2.25 0 01-.571-.093m0 0c.19.02.38.05.57.093m0 0a2.25 2.25 0 00.571-.093m0 0c.41.51.94.92 1.5 1.23m0 0c.56.31 1.19.52 1.85.64m0 0a2.25 2.25 0 003.341 0m0 0c.66-.12 1.29-.33 1.85-.64m0 0c.56.31 1.09-.72 1.5-1.23m0 0c.41-.51.69-1.15.76-1.85m0 0A2.25 2.25 0 0019.5 6.5m0 0c-.66.12-1.29.33-1.85.64m0 0c-.56.31-1.09.72-1.5 1.23m0 0c-.41.51-.69 1.15-.76-1.85m0 0A2.25 2.25 0 0012 13.5m0 0a2.25 2.25 0 00-3.341 0m0 0c-.66.12-1.29.33-1.85.64m0 0c-.56.31-1.09.72-1.5 1.23m0 0c-.41.51-.69 1.15-.76-1.85m0 0A2.25 2.25 0 006.5 19.5m0 0c.66-.12 1.29-.33 1.85-.64m0 0c.56.31 1.09-.72 1.5-1.23m0 0c.41-.51.69-1.15-.76-1.85m0 0A2.25 2.25 0 0012 13.5m0 0a2.25 2.25 0 003.341 0m0 0c.66.12 1.29.33 1.85-.64m0 0c.56.31 1.09.72 1.5-1.23m0 0c.41-.51-.69 1.15-.76-1.85m0 0A2.25 2.25 0 0017.5 19.5m0 0c-.66.12-1.29.33-1.85-.64m0 0c-.56-.31-1.09-.72-1.5-1.23m0 0c-.41-.51-.69-1.15-.76-1.85M12 13.5m-2.25 0a2.25 2.25 0 00-2.25 2.25"
    />
  </svg>
);

// Icon for Copied (Checkmark)
export const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5 mx-auto text-green-500"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

// Icon for Twitter/X
export const TwitterIcon = () => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    className="h-5 w-5 mx-auto"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Icon for LinkedIn
export const LinkedInIcon = () => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    className="h-5 w-5 mx-auto"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

// Icon for Reddit
export const RedditIcon = () => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    className="h-5 w-5 mx-auto"
  >
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.044 13.911c-.551 0-.999.447-.999.999s.448.999.999.999.999-.447.999-.999-.448-.999-.999-.999zm4.088 0c-.551 0-.999.447-.999.999s.448.999.999.999.999-.447.999-.999-.448-.999-.999-.999zm2.138-3.003c.54 0 .978.438.978.978 0 .428-.276.793-.655.922-.093 1.157-.775 2.158-1.849 2.511l.921 2.222c.113.273.01.59-.264.704-.081.034-.166.05-.25.05-.198 0-.389-.104-.501-.28l-1.077-2.601c-.139.014-.279.022-.42.022s-.281-.008-.42-.022l-1.077 2.601c-.113.176-.303.28-.501.28-.084 0-.169-.016-.25-.05-.273-.113-.377-.43-.264-.704l.921-2.222c-1.074-.353-1.756-1.353-1.849-2.511-.379-.129-.655-.494-.655-.922 0-.54.438-.978.978-.978s.978.438.978.978c0 .178-.05.344-.135.492.276.04.536.14.773.282 1.341-.54 1.727-1.758 1.757-2.917 0-.005 0-.009 0-.014-.24-.138-.401-.39-.401-.682 0-.441.359-.8.8-.8s.8.359.8.8c0 .293-.16.544-.401.682 0 .005 0 .009 0 .014.031 1.158.416 2.376 1.757 2.917.237-.142.497-.242.773-.282-.085-.148-.135-.314-.135-.492 0-.54.438-.978.978-.978z" />
  </svg>
);

// Icon for TOC Mobile Button
export const ContentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
    />
  </svg>
);

// Icon for Closing Modals
export const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Icon for Mobile Menu (Hamburger)
export const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);


export const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3} // Make it a bit bolder
    stroke="currentColor"
    className="h-3 w-3"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

export const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2} // Slightly thicker
    stroke="currentColor"
    className="h-5 w-5" // A bit smaller than menu icons
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

export const ArrowLeftIcon = () => (
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
      d="M15.75 19.5L8.25 12l7.5-7.5"
    />
  </svg>
);

export const ArrowRightIcon = () => (
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
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
);

// FILE: frontend/components/Icons.tsx
// Complete icon components

import React from "react";



export function ChevronRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-5 h-5 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}



export function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-6 h-6 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

