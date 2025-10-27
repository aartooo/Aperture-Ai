// FILE: frontend/components/ArticleBodyRenderer.tsx
"use client";

import { BlocksRenderer, type BlocksContent } from "@strapi/blocks-react-renderer";
import { StrapiImage } from "./StrapiImage";
import { slugify } from "../lib/utils";
import { ContentBlock } from "../lib/types";
import React from "react";

interface ArticleBodyRendererProps {
  body: BlocksContent | null | undefined;
  contentBlocks: ContentBlock[] | null | undefined;
}

export function ArticleBodyRenderer({ body, contentBlocks }: ArticleBodyRendererProps) {
  return (
    <div className="prose prose-lg max-w-none text-text-primary dark:prose-invert">
      <BlocksRenderer
        content={body || []}
        blocks={{
          heading: ({ children, level }) => {
            const text = React.Children.toArray(children)
              .map((child) => {
                if (typeof child === "string") return child;
                if (typeof child === "object" && child !== null && "props" in child) {
                  return (child.props as any).text;
                }
                return "";
              })
              .join("");
            const id = slugify(text);
            const Tag = `h${level}` as keyof JSX.IntrinsicElements;
            return <Tag id={id}>{children}</Tag>;
          },
          image: ({ image }) => {
            // Handle both flat and nested structures for body images
            const img = image?.attributes || image;
            if (!img?.url) return null;
            return (
              <div className="my-8 overflow-hidden rounded-lg shadow-md not-prose">
                <StrapiImage
                  src={img.url}
                  alt={img.alternativeText || `Article image`}
                  width={img.width || 800}
                  height={img.height || 450}
                  className="w-full object-cover"
                />
                {img.caption && (
                  <p className="mt-2 text-center text-sm italic text-text-secondary">{img.caption}</p>
                )}
              </div>
            );
          },
          embed: ({ embed }) => {
            if (!embed?.html) return null;
            return (
              <div className="my-8 aspect-video w-full overflow-hidden rounded-lg shadow-md not-prose">
                <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: embed.html }} />
              </div>
            );
          },
        }}
      />

      {contentBlocks && Array.isArray(contentBlocks) && contentBlocks.length > 0 && (
        <section className="my-10 space-y-8">
          {contentBlocks.map((block) => {
            const key = `content-block-${block.id}`;

            if (block.__component === "article-images.image-block") {
              // FIXED: Your API returns flat structure, not nested data.attributes
              const img = block.image;
              
              if (!img?.url) {
                console.warn(`Image block (ID: ${block.id}) missing populated URL. Data:`, block);
                return null;
              }

              // Check if it's a video file (ID 11 is a video)
              const isVideo = img.mime?.startsWith('video/');
              const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
              
              if (isVideo) {
                return (
                  <div key={key} className="overflow-hidden rounded-lg shadow-md not-prose">
                    <video 
                      controls 
                      className="w-full"
                      preload="metadata"
                    >
                      <source 
                        src={`${strapiUrl}${img.url}`} 
                        type={img.mime} 
                      />
                      Your browser does not support the video tag.
                    </video>
                    {img.caption && (
                      <p className="mt-2 text-center text-sm italic text-text-secondary">{img.caption}</p>
                    )}
                  </div>
                );
              }

              // Regular image (ID 10)
              return (
                <div key={key} className="overflow-hidden rounded-lg shadow-md not-prose">
                  <StrapiImage
                    src={img.url}
                    alt={img.alternativeText || img.name || `Image block ${block.id}`}
                    width={img.width || 800}
                    height={img.height || 450}
                    className="w-full object-cover"
                  />
                  {img.caption && (
                    <p className="mt-2 text-center text-sm italic text-text-secondary">{img.caption}</p>
                  )}
                </div>
              );
            }

            if (block.__component === "article-images.video-embed-block" && block.embedCode) {
              return (
                <div key={key} className="aspect-video w-full overflow-hidden rounded-lg shadow-md not-prose">
                  <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: block.embedCode }} />
                </div>
              );
            }

            console.warn("Unsupported content block:", block);
            return null;
          })}
        </section>
      )}
    </div>
  );
}