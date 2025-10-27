// FILE: frontend/app/authors/[slug]/page.tsx
import { fetchApi } from "../../../lib/api";
import {
  Article as ArticleType,
  StrapiApiResponse,
  AuthorProfile,
  StrapiData,
  StrapiBlock,
} from "../../../lib/types";
import { StrapiImage } from "../../../components/StrapiImage";
import { ArticleGrid } from "../../../components/ArticleGrid";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import React from "react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

interface AuthorPageParams {
  slug: string;
}

function blocksToText(blocks: StrapiBlock[] | null | undefined): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";
  let textContent = "";
  function extractText(children: any[] | undefined) {
    if (!Array.isArray(children)) return;
    children.forEach((child: any) => {
      if (child.text) textContent += child.text + " ";
      if (child.children && Array.isArray(child.children)) extractText(child.children);
    });
  }
  blocks.forEach((block) => extractText(block.children));
  return textContent.replace(/\s+/g, " ").trim();
}

async function getAuthorProfile(slug: string): Promise<AuthorProfile | null> {
  const query = {
    filters: { slug: { $eq: slug } },
    populate: {
      avatar: true,
      articles: { populate: ["coverImage", "category"] },
    },
  };

  try {
    const res = await fetchApi<StrapiApiResponse<AuthorProfile>>("author-profiles", query);
    // FIXED: Handle flat structure (no .attributes)
    if (!res?.data?.[0]) return null;
    const author = res.data[0];
    return author;
  } catch (error) {
    console.error("Error fetching author profile:", error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetchApi<StrapiApiResponse<AuthorProfile>>("author-profiles", {
      fields: ["slug"],
    });
    if (!Array.isArray(res.data)) return [];
    // FIXED: Handle flat structure
    return res.data.map((author) => ({
      slug: author.slug,
    }));
  } catch (error) {
    console.error("Error fetching author slugs:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: AuthorPageParams;
}): Promise<Metadata> {
  const { slug } = params;
  const author = await getAuthorProfile(slug);

  if (!author) return { title: "Author Not Found" };

  const authorName = author.name || "Project Apature Author";
  const siteName = "Project Apature";
  const authorBioText = author.bio ? blocksToText(author.bio) : `Articles by ${authorName} on ${siteName}.`;
  // FIXED: Flat structure
  const avatarUrl = author.avatar?.url;

  return {
    title: `${authorName} | ${siteName}`,
    description: authorBioText,
    openGraph: {
      title: `${authorName} | ${siteName}`,
      description: authorBioText,
      images: avatarUrl ? [`${process.env.NEXT_PUBLIC_STRAPI_URL}${avatarUrl}`] : [],
    },
    twitter: {
      card: "summary",
      title: `${authorName} | ${siteName}`,
      description: authorBioText,
      images: avatarUrl ? [`${process.env.NEXT_PUBLIC_STRAPI_URL}${avatarUrl}`] : [],
    },
  };
}

export default async function AuthorProfilePage({
  params,
}: {
  params: AuthorPageParams;
}) {
  const { slug } = params;
  const author = await getAuthorProfile(slug);

  if (!author) notFound();

  const { name, bio, avatar, articles } = author;
  // FIXED: Flat structure for articles
  const articlesData = articles || [];

  return (
    <main className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 overflow-x-hidden">
      <header className="mb-12 flex flex-col items-center gap-6 border-b border-border pb-12 text-center md:flex-row md:items-start md:text-left">
        {avatar?.url && (
          <div className="flex-shrink-0">
            <StrapiImage
              src={avatar.url}
              alt={`Profile picture of ${name}`}
              width={150}
              height={150}
              className="rounded-full object-cover shadow-lg"
            />
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-wider text-text-accent">
            Author
          </p>
          <h1 className="mt-1 text-4xl font-extrabold text-text-primary md:text-5xl">
            {name}
          </h1>
          {bio && (
            <div className="mt-4 text-lg text-text-secondary prose dark:prose-invert max-w-none">
              <BlocksRenderer content={bio} />
            </div>
          )}
        </div>
      </header>

      <h2 className="mb-8 text-3xl font-bold text-text-primary">
        Articles by {name}
      </h2>

      {articlesData.length > 0 ? (
        <ArticleGrid articles={articlesData} />
      ) : (
        <p className="text-text-secondary">This author has not published any articles yet.</p>
      )}
    </main>
  );
}