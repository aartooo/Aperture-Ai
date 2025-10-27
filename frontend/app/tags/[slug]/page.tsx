// FILE: frontend/app/tags/[slug]/page.tsx
// (This is a new file. Use this full code.)

import { fetchApi } from "../../../lib/api";
import {
  Article as ArticleType,
  StrapiApiResponse,
  Tag as TagType,
  StrapiData,
  StrapiBlock,
} from "../../../lib/types";
import { ArticleGrid } from "../../../components/ArticleGrid";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import React from "react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

interface TagPageParams {
  slug: string;
}

// --- Data Fetching Functions ---

// 1. Fetches a SINGLE tag and its articles
async function getTagData(slug: string) {
  const query = {
    filters: { slug: { $eq: slug } },
    // Use the explicit V5 populate query
    populate: {
      articles: {
        populate: {
          coverImage: true,
          category: true,
        },
      },
    },
  };
  
  try {
    const res = await fetchApi<StrapiApiResponse<TagType>>("tags", query);
    
    // We expect a FLAT response because of the transformer plugin
    if (!res?.data?.[0]) return null;
    return res.data[0];
  } catch (error) {
    console.error("Error fetching tag data:", error);
    return null;
  }
}

// 2. Generates static pages for all tags
export async function generateStaticParams() {
  try {
    const res = await fetchApi<StrapiApiResponse<TagType>>("tags", {
      fields: ["slug"],
    });
    if (!Array.isArray(res.data)) return [];
    // Use FLAT structure
    return res.data.map((tag) => ({
      slug: tag.slug,
    }));
  } catch (error) {
    console.error("Error fetching tag slugs:", error);
    return [];
  }
}

// 3. Generates metadata for the page
export async function generateMetadata({
  params,
}: {
  params: TagPageParams;
}): Promise<Metadata> {
  const { slug } = params;
  const tag = await getTagData(slug);

  if (!tag) return { title: "Tag Not Found" };

  const tagName = tag.name || "Tag";
  const siteName = "Project Apature";
  const description = `All articles tagged with "${tagName}" on ${siteName}.`;

  return {
    title: `${tagName} | ${siteName}`,
    description: description,
    openGraph: {
      title: `${tagName} | ${siteName}`,
      description: description,
    },
    twitter: {
      card: "summary",
      title: `${tagName} | ${siteName}`,
      description: description,
    },
  };
}

// --- Main Page Component (Server Component) ---
export default async function TagPage({ params }: { params: TagPageParams }) {
  const { slug } = params;
  const tag = await getTagData(slug);

  if (!tag) {
    notFound();
  }
  
  const { name, articles } = tag;
  const articlesData = articles || [];

  return (
    <main className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Tag Header */}
      <header className="mb-12 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-text-accent">
          Tag
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-text-primary md:text-5xl">
          {name}
        </h1>
      </header>

      {/* Article Grid */}
      {articlesData.length > 0 ? (
        <ArticleGrid articles={articlesData} />
      ) : (
        <p className="text-text-secondary">
          There are no articles associated with this tag yet.
        </p>
      )}
    </main>
  );
}