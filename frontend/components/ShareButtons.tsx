// FILE: frontend/components/ShareButtons.tsx
// (This is the full code for this file)

"use client";

// --- THE FIX IS HERE ---
import { useState } from "react"; // Changed 'in' to 'from'
// --- END FIX ---

import {
  TwitterIcon,
  LinkedInIcon,
  RedditIcon,
  ShareIcon,
  CheckIcon,
} from "./Icons"; // We'll add these icons in the next step

interface ShareButtonProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonProps) {
  const [didCopy, setDidCopy] = useState(false);
  
  // Construct the full URL
  const url = typeof window !== "undefined" 
    ? `${window.location.origin}/articles/${slug}` 
    : ``;

  // Twitter share URL
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(title)}`;
  
  // LinkedIn share URL
  const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    url
  )}&title=${encodeURIComponent(title)}`;
  
  // Reddit share URL
  const redditShareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
    url
  )}&title=${encodeURIComponent(title)}`;

  // Copy to Clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setDidCopy(true);
      setTimeout(() => setDidCopy(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="flex space-x-2">
      <a
        href={twitterShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 rounded-lg border border-border bg-background-primary p-2.5 text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
        aria-label="Share on Twitter"
      >
        <TwitterIcon />
      </a>
      <a
        href={linkedInShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 rounded-lg border border-border bg-background-primary p-2.5 text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon />
      </a>
      <a
        href={redditShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 rounded-lg border border-border bg-background-primary p-2.5 text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
        aria-label="Share on Reddit"
      >
        <RedditIcon />
      </a>
      <button
        onClick={copyToClipboard}
        className="flex-1 rounded-lg border border-border bg-background-primary p-2.5 text-text-secondary transition-all hover:bg-border hover:text-text-primary"
        aria-label="Copy link"
      >
        {/* Show checkmark on success */}
        {didCopy ? <CheckIcon /> : <ShareIcon />}
      </button>
    </div>
  );
}