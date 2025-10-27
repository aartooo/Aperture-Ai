// FILE: frontend/app/page.tsx
// FINAL VERSION — HERO SLIDER ON ALL DEVICES

import { fetchApi } from "../lib/api";
import { ArticleGrid } from "../components/ArticleGrid";
import { PartnerRibbon } from "../components/PartnerRibbon";
import { CategoryAccordion } from "../components/CategoryAccordion";
import { SearchBar } from "../components/SearchBar";
import { HeroSlider } from "../components/HeroSlider";
import { ArticleCarousel } from "../components/ArticleCarousel";
import Link from "next/link";
import React from "react";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Collect all descendant category IDs
function collectDescendantIds(category: any): number[] {
  const ids = [category.id];
  const children = Array.isArray(category.children) ? category.children : [];
  children.forEach((child: any) => {
    ids.push(...collectDescendantIds(child));
  });
  return ids;
}

async function getHomepageData() {
  const articleQuery = {
    populate: {
      coverImage: { fields: ["url", "alternativeText", "width", "height", "formats"] },
      category: { fields: ["id", "name", "slug"] },
      author: { fields: ["name", "slug"] },
    },
    sort: { publishedAt: "desc" },
  };

  const categoryQuery = {
    filters: { parent: { id: { $null: true } } },
    populate: { children: { populate: "*" } },
    sort: "name:asc",
  };

  try {
    const [articleRes, categoryRes] = await Promise.all([
      fetchApi<any>("articles", articleQuery),
      fetchApi<any>("categories", categoryQuery),
    ]);

    const articles = (articleRes.data || []).map((a: any) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      coverImage: a.coverImage,
      category: a.category,
      author: a.author,
      isFeatured: a.isFeatured,
    }));

    const categories = (categoryRes.data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      children: Array.isArray(c.children) ? c.children : [],
    }));

    return { articles, categories };
  } catch (error) {
    console.error("Homepage data error:", error);
    return { articles: [], categories: [] };
  }
}

export default async function Home() {
  const { articles, categories } = await getHomepageData();

  const featuredArticles = articles.filter((a: any) => a.isFeatured); // ← FIXED
  const latestArticles = articles.filter((a: any) => !a.isFeatured);
  const heroArticles = featuredArticles.length > 0 ? featuredArticles : articles.slice(0, 5);

  return (
    <main className="overflow-x-hidden min-h-screen bg-background">
      {/* HERO — NOW ON MOBILE TOO */}
      <section className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg burners:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-12">
          <aside className="col-span-12 lg:col-span-4 hidden lg:block lg:sticky lg:top-24 h-fit">
            {categories.length > 0 ? (
              <CategoryAccordion categories={categories} />
            ) : (
              <div className="rounded-2xl border border-border/50 bg-background-secondary/50 p-5 backdrop-blur-sm text-center">
                <p className="text-sm text-text-secondary">No categories</p>
              </div>
            )}
          </aside>

          <div className="col-span-12 lg:col-span-8">
            {heroArticles.length > 0 ? (
              <HeroSlider articles={heroArticles} />
            ) : (
              <div className="relative w-full h-[50vh] rounded-2xl bg-muted/50 flex items-center justify-center border">
                <p className="text-text-secondary">No articles available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="py-12 bg-background-secondary/30">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">Find Your Edge</h2>
          <p className="mt-3 text-base text-text-secondary">
            Explore AI tools, reviews, and breaking news.
          </p>
          <div className="mt-6 max-w-xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* LATEST ARTICLES */}
      <section className="container mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="flex items-baseline justify-between border-b border-border pb-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">Latest Articles</h2>
        </div>
        {latestArticles.length > 0 ? (
          <ArticleCarousel articles={latestArticles} />
        ) : articles.length > 0 ? (
          <ArticleCarousel articles={articles} />
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold">No articles found</h3>
            <p className="mt-2 text-text-secondary text-sm">Publish some in Strapi!</p>
          </div>
        )}
      </section>

      {/* DYNAMIC CATEGORY SECTIONS */}
      {categories.length > 0 &&
        categories.map((category) => {
          const descendantIds = collectDescendantIds(category);
          const categoryArticles = articles.filter(
            (article: any) => article.category && descendantIds.includes(article.category.id)
          );

          if (categoryArticles.length === 0) return null;

          return (
            <section key={category.id} className="container mx-auto max-w-7xl px-4 py-8 lg:py-12">
              <div className="flex items-baseline justify-between border-b border-border pb-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                  Latest in {category.name}
                </h2>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-sm font-medium text-accent hover:underline transition-colors"
                >
                  View All
                </Link>
              </div>
              <ArticleCarousel articles={categoryArticles} />
            </section>
          );
        })}

      {/* PARTNER RIBBON */}
      <section className="py-12 bg-background-secondary/30">
        <div className="container mx-auto max-w-7xl px-4">
          <PartnerRibbon />
        </div>
      </section>
    </main>
  );
}