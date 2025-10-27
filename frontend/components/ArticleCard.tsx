// FILE: frontend/components/ArticleCard.tsx
"use client";

import Link from "next/link";
import { StrapiImage } from "./StrapiImage";
import { Article } from "../lib/types";
import { motion } from "framer-motion";

export function ArticleCard({ article }: { article: Article }) {
  const { title, excerpt, slug, coverImage, category } = article;
  const categoryName = category?.name;

  return (
    <motion.div
      className="flex h-full flex-col"
      whileHover={{
        y: -8,
        boxShadow:
          "0 20px 25px -5px rgb(var(--color-text-primary) / 0.1), 0 8px 10px -6px rgb(var(--color-text-primary) / 0.1)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/articles/${slug}`} className="group block h-full overflow-hidden rounded-xl border border-border bg-background-secondary shadow-md">
        <div className="relative h-48 w-full overflow-hidden">
          {coverImage?.url ? (
            <StrapiImage
              src={coverImage.url}
              alt={coverImage.alternativeText || `Cover image for ${title}`}
              width={coverImage.width || 400}
              height={coverImage.height || 300}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-border">
              <span className="text-sm text-text-secondary">No Image</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div>
            {categoryName && (
              <Link
                href={`/categories/${category.slug}`}
                className="mb-2 inline-block rounded-full bg-text-accent/10 px-3 py-1 text-sm font-semibold text-text-accent hover:bg-text-accent/20 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {categoryName}
              </Link>
            )}

            <h3 className="mb-3 text-2xl font-bold text-text-primary transition-colors group-hover:text-text-accent">
              {title}
            </h3>
            <p className="mb-4 text-text-secondary line-clamp-3">{excerpt}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}