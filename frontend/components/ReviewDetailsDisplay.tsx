// FILE: frontend/components/ReviewDetailsDisplay.tsx
// (This is a new file)

"use client"; // This makes it a Client Component

import { ReviewDetails, StrapiBlock } from "../lib/types";
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import React from 'react';

// Define the type for the props
interface ReviewDetailsProps {
  details: ReviewDetails | null;
}

export function ReviewDetailsDisplay({ details }: ReviewDetailsProps) {
    if (!details || !details.productName) return null;

    const renderReviewContent = (content: string | StrapiBlock[] | null | undefined) => {
      if (!content) return null;
      if (typeof content === 'string') { return <p className="text-text-secondary">{content}</p>; }
      if (Array.isArray(content) && content.length > 0) { 
        // This is safe now because it's all in one client component
        return <BlocksRenderer content={content} />; 
      }
      return null;
    };

    return (
      <section className="my-12 rounded-xl border border-border/50 bg-gradient-to-br from-background-secondary via-background-primary to-background-secondary p-6 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl">
        <h3 className="mb-6 border-b border-border/50 pb-3 text-2xl font-semibold text-text-primary">
          <span className="text-text-accent">{details.productName}</span> Review
        </h3>
        {details.rating != null && ( <div className="mb-5 flex items-baseline"> <span className="mr-3 font-medium text-text-primary">Our Rating:</span> <span className="font-bold text-2xl text-yellow-500">{details.rating}</span> <span className="text-sm text-text-secondary">/10 ★</span> </div> )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {details.pros && ( <div> <h4 className="mb-2 text-lg font-medium text-green-600 dark:text-green-400">Pros 👍</h4> <div className="prose prose-sm dark:prose-invert max-w-none text-text-secondary marker:text-green-600 dark:marker:text-green-400 space-y-1"> {renderReviewContent(details.pros)} </div> </div> )}
          {details.cons && ( <div> <h4 className="mb-2 text-lg font-medium text-red-600 dark:text-red-400">Cons 👎</h4> <div className="prose prose-sm dark:prose-invert max-w-none text-text-secondary marker:text-red-600 dark:marker:text-red-400 space-y-1"> {renderReviewContent(details.cons)} </div> </div> )}
        </div>
        {details.verdict && ( <div className="mt-6 border-t border-border/50 pt-5"> <h4 className="mb-2 text-lg font-medium text-text-primary">The Verdict 🧐</h4> <div className="prose prose-sm dark:prose-invert max-w-none text-text-secondary space-y-2"> {renderReviewContent(details.verdict)} </div> </div> )}
      </section>
    );
}