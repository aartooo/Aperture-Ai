// FILE: app/categories/[slug]/page.tsx
import { fetchApi } from "../../../lib/api";
import { ArticleGrid } from "../../../components/ArticleGrid";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface CategoryPageParams {
  slug: string;
}

// --- Collect all descendant IDs (Strapi v5: flat children array) ---
function collectDescendantIds(category: any): number[] {
  const ids = [category.id];

  const children = Array.isArray(category.children) ? category.children : [];

  children.forEach((child: any) => {
    ids.push(...collectDescendantIds(child));
  });

  return ids;
}

// --- Fetch category with deep children ---
async function getCategoryWithDescendants(slug: string) {
  const query = {
    filters: { slug: { $eq: slug } },
    populate: "children.children.children",
  };

  try {
    const res = await fetchApi<any>("categories", query);
    return res?.data?.[0] || null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

// --- Fetch articles by category IDs ---
async function getArticlesByCategoryIds(ids: number[]) {
  if (ids.length === 0) return[];

  const query = {
    filters: { category: { id: { $in: ids } } },
    populate: {
      coverImage: { fields: ["url", "alternativeText", "width", "height", "formats"] },
      category: { fields: ["name", "slug"] },
      author: { fields: ["name", "slug"] },
    },
    sort: "publishedAt:desc",
  };

  try {
    const res = await fetchApi<any>("articles", query);
    return res.data || [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

// --- Static Params ---
export async function generateStaticParams() {
  try {
    const res = await fetchApi<{ data: { slug: string }[] }>("categories", {
      fields: ["slug"],
    });
    return (res.data || []).map((cat) => ({ slug: cat.slug }));
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}

// --- Metadata ---
export async function generateMetadata({ params }: { params: CategoryPageParams }): Promise<Metadata> {
  const category = await getCategoryWithDescendants(params.slug);
  if (!category?.name) return { title: "Not Found" };

  const name = category.name || "Category";
  const siteName = "Project Apature";
  const desc = category.description || `Articles in ${name}`;

  return {
    title: `${name} | ${siteName}`,
    description: desc,
  };
}

// --- Page ---
export default async function CategoryPage({ params }: { params: CategoryPageParams }) {
  const category = await getCategoryWithDescendants(params.slug);
  if (!category?.name) notFound(); // ← Fixed

  const { name, description } = category; // ← Fixed: no .attributes
  const allIds = collectDescendantIds(category);
  const articlesRaw = await getArticlesByCategoryIds(allIds);

  const articles = articlesRaw.map((a: any) => ({
    id: a.id,
    ...a,
  }));

  return (
    <main className="container mx-auto max-w-5xl px-4 py-12">
      <header className="mb-12 border-b pb-8">
        <p className="text-sm font-semibold uppercase text-text-accent">Category</p>
        <h1 className="mt-2 text-4xl font-bold">{name}</h1>
        {description && <p className="mt-4 text-lg text-text-secondary">{description}</p>}
      </header>

      {articles.length > 0 ? (
        <ArticleGrid articles={articles} />
      ) : (
        <p className="text-center py-12 text-text-secondary">
          No articles in "{name}" or its subcategories yet.
        </p>
      )}
    </main>
  );
}