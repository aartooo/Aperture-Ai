// FILE: frontend/app/articles/[slug]/page.tsx
// (Updated to check authentication server-side and pass to CommentSection)

import { fetchApi } from "../../../lib/api";
import {
  Article as ArticleType,
  StrapiApiResponse,
  StrapiBlock,
  ContentBlock,
  ReviewDetails,
  Tag,
  SeoComponent,
} from "../../../lib/types";
import { StrapiImage } from "../../../components/StrapiImage";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import React from "react";
import readingTime from "reading-time";
import Link from "next/link";
import { ArticleBodyRenderer } from "../../../components/ArticleBodyRenderer";
import { ReviewDetailsDisplay } from "../../../components/ReviewDetailsDisplay";
import { TableOfContents } from "../../../components/TableOfContents";
import { MobileTableOfContents } from "../../../components/MobileTableOfContents";
import { ArticleContext } from "../../../components/ArticleContext";
import { blocksToText } from "../../../lib/utils";
import { CommentSection } from "../../../components/CommentSection";
import { cookies } from "next/headers"; // Added for server-side cookie access

interface ArticlePageParams {
  slug: string;
}

async function getArticleBySlug(slug: string): Promise<ArticleType | null> {
  const query = {
    filters: { slug: { $eq: slug } },
    populate: {
      coverImage: true,
      category: true,
      tags: true,
      seo: { populate: "*" },
      reviewDetails: true,
      author: { populate: "*" },
      contentBlocks: {
        populate: "*",
      },
    },
  };
  try {
    const res = await fetchApi<StrapiApiResponse<ArticleType>>("articles", query, {
      next: { revalidate: 3600 },
    });
    const article = res?.data?.[0] || null;
    if (!article) {
      return null;
    }
    return article;
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetchApi<StrapiApiResponse<ArticleType>>("articles", {
      fields: ["slug"],
    });
    if (!Array.isArray(res.data)) return [];
    const paths = res.data
      .map((article) => (article?.slug ? { slug: article.slug } : null))
      .filter(Boolean);
    return paths;
  } catch (error) {
    console.error("Error fetching slugs for generateStaticParams:", error);
    return [];
  }
}

// New function to check authentication server-side
async function checkAuthentication(): Promise<boolean> {
  try {
    const jwt = cookies().get("strapiJwt")?.value;
    if (!jwt) return false;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/auth/session`, {
      headers: {
        Cookie: `strapiJwt=${jwt}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return false;

    const data = await res.json();
    return data.authenticated === true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: ArticlePageParams;
}) {
  const { slug } = params;
  const [article, isAuthenticated] = await Promise.all([
    getArticleBySlug(slug),
    checkAuthentication(), // Check authentication status
  ]);

  if (!article) notFound();

  const {
    id,
    title,
    body,
    coverImage,
    author,
    publishedAt,
    category,
    isSponsored,
    isAffiliate,
    tags,
    reviewDetails,
    contentBlocks,
  } = article;

  const publicationDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date unknown";
  const bodyTextForReadingTime = blocksToText(body);
  const stats = readingTime(bodyTextForReadingTime);
  const readTimeText = stats.text;

  const authorName = author?.name || "Unknown Author";
  const authorSlug = author?.slug;
  const categoryName = category?.name || "Uncategorized";
  const categorySlug = category?.slug;
  const coverImageData = coverImage || null;
  const tagsData = tags || [];

  return (
    <div className="min-h-screen flex flex-col">
      <MobileTableOfContents blocks={body} />

      {/* Main content area */}
      <div className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[280px_1fr_280px] lg:gap-8">
          {/* Left Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <TableOfContents blocks={body} />
            </div>
          </aside>

          {/* Main Article Content */}
          <article key={id} className="w-full max-w-3xl mx-auto">
            <header className="mb-8 border-b border-border pb-8">
              {categoryName && categorySlug ? (
                <Link href={`/categories/${categorySlug}`}>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-accent transition-colors hover:text-text-primary">
                    {categoryName}
                  </p>
                </Link>
              ) : (
                categoryName && (
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-accent">
                    {categoryName}
                  </p>
                )
              )}
              <h1 className="mb-4 text-4xl font-extrabold leading-tight text-text-primary md:text-5xl">
                {title || "Untitled Article"}
              </h1>
              <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary">
                {authorName && (
                  <div className="flex items-center">
                    {authorSlug ? (
                      <Link href={`/authors/${authorSlug}`} className="flex items-center hover:opacity-80 transition-opacity">
                        {author?.avatar?.url ? (
                          <div className="mr-2 h-8 w-8 rounded-full overflow-hidden">
                            <StrapiImage
                              src={author.avatar.url}
                              alt={authorName}
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mr-2 h-8 w-8 rounded-full bg-border"></div>
                        )}
                        <span className="hover:text-text-primary transition-colors">By {authorName}</span>
                      </Link>
                    ) : (
                      <>
                        {author?.avatar?.url ? (
                          <div className="mr-2 h-8 w-8 rounded-full overflow-hidden">
                            <StrapiImage
                              src={author.avatar.url}
                              alt={authorName}
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mr-2 h-8 w-8 rounded-full bg-border"></div>
                        )}
                        <span>By {authorName}</span>
                      </>
                    )}
                  </div>
                )}
                {publishedAt && <time dateTime={publishedAt}>{publicationDate}</time>}
                {publishedAt && <span>·</span>}
                <span>{readTimeText}</span>
                {isAffiliate === true && (
                  <>
                    <span>·</span>
                    <span className="font-semibold uppercase tracking-wider text-xs text-yellow-600 dark:text-yellow-400">
                      Affiliate
                    </span>
                  </>
                )}
                {isSponsored === true && (
                  <>
                    <span>·</span>
                    <span className="font-semibold uppercase tracking-wider text-xs text-purple-600 dark:text-purple-400">
                      Sponsored
                    </span>
                  </>
                )}
              </div>
              {tagsData && Array.isArray(tagsData) && tagsData.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tagsData.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/tags/${tag.slug}`}
                      className="rounded-full bg-background-secondary px-3 py-1 text-xs font-medium text-text-secondary border border-border transition-colors hover:bg-border hover:text-text-primary"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {coverImageData?.url && (
              <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
                <StrapiImage
                  src={coverImageData.url}
                  alt={coverImageData.alternativeText || `Cover image for ${title}`}
                  width={coverImageData.width || 1200}
                  height={coverImageData.height || 630}
                  className="w-full object-cover"
                  priority={true}
                />
              </div>
            )}

            <ArticleBodyRenderer body={body} contentBlocks={contentBlocks} />
            <ReviewDetailsDisplay details={reviewDetails} />
            <CommentSection articleId={id} slug={slug} isAuthenticated={isAuthenticated} /> {/* Pass isAuthenticated */}

            {/* Mobile-Only Context */}
            <div className="mt-12 block border-t border-border pt-8 lg:hidden">
              <ArticleContext article={article} />
            </div>
          </article>

          {/* Right Sidebar - Author/Share/Ads */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <ArticleContext article={article} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: ArticlePageParams;
}): Promise<Metadata> {
  const { slug } = params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Article Not Found" };

  const seoData = article.seo;
  const siteName = "Project Apature";
  const coverImageData = article.coverImage || null;
  const seoImageData = seoData?.metaImage || null;
  const imageUrl = seoImageData?.url || coverImageData?.url;
  const imageWidth = seoImageData?.width || coverImageData?.width || 1200;
  const imageHeight = seoImageData?.height || coverImageData?.height || 630;
  const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") || "http://localhost:1337";
  const relativeImageUrl = imageUrl?.startsWith("/") ? imageUrl : imageUrl ? `/${imageUrl}` : undefined;
  const fullImageUrl = imageUrl ? `${strapiBaseUrl}${relativeImageUrl}` : undefined;
  const pageTitle = seoData?.metaTitle || article.title || "Untitled Article";
  const pageDescription = seoData?.metaDescription || article.excerpt || "No description available.";
  const canonicalUrl = seoData?.canonicalURL || (article.slug ? `/articles/${article.slug}` : undefined);
  const authorName = article.author?.name || siteName;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName,
      images: fullImageUrl ? [{ url: fullImageUrl, width: imageWidth, height: imageHeight, alt: pageTitle }] : [],
      type: "article",
      publishedTime: article.publishedAt,
      authors: [authorName],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: fullImageUrl ? [fullImageUrl] : [],
    },
    robots: { index: true, follow: true },
    canonical: canonicalUrl,
  };
}