// FILE: frontend/lib/utils.ts
// (This is the full code for this file)

import { StrapiBlock, StrapiBlockChild, ContentBlock } from "./types";

// A simple function to create URL-friendly "slugs" from text
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

// --- ADDING THESE FUNCTIONS HERE ---

// Helper to extract text from rich text blocks for reading time
export function blocksToText(blocks: StrapiBlock[] | null | undefined): string {
  if (!Array.isArray(blocks)) { return ''; }
  let textContent = '';
  function extractText(children: StrapiBlockChild[] | undefined) {
    if (!Array.isArray(children)) return;
    children.forEach((child: any) => {
      if (child.text) { textContent += child.text + ' '; }
      if (child.children && Array.isArray(child.children)) { extractText(child.children); }
    });
  }
  blocks.forEach(block => {
    extractText(block.children);
    if (block.type === 'paragraph' || block.type === 'heading' || block.type === 'list') { textContent += '\n'; }
  });
  return textContent.replace(/\s+/g, ' ').trim();
}

// Helper to extract text from dynamic zone blocks (if any)
export function contentBlocksToText(blocks: ContentBlock[] | null | undefined): string {
  // We currently don't count this for reading time
  return '';
}