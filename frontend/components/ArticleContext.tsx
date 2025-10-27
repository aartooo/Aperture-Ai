// FILE: frontend/components/ArticleContext.tsx
import { Article as ArticleType, StrapiBlock } from "../lib/types";
import Link from "next/link";
import { ShareButtons } from "./ShareButtons";
import { StrapiImage } from "./StrapiImage";

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

export async function ArticleContext({ article }: { article: ArticleType | null }) {
  if (!article) return null;

  const author = article.author;
  const authorName = author?.name || "Project Apature Team";
  const authorBio = author?.bio ? blocksToText(author.bio) : "Expert in AI analysis.";
  const authorAvatarUrl = author?.avatar?.url;
  const authorSlug = author?.slug;

  return (
    <aside className="w-full">
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-background-secondary/50 p-4 backdrop-blur-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-primary">
            About the Author
          </h3>
          {authorSlug ? (
            <Link href={`/authors/${authorSlug}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="h-12 w-12 flex-shrink-0 rounded-full bg-border overflow-hidden">
                {authorAvatarUrl && (
                  <StrapiImage
                    src={authorAvatarUrl}
                    alt={authorName}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <span className="font-semibold text-text-primary hover:text-text-accent transition-colors">
                  {authorName}
                </span>
                <p className="text-xs text-text-secondary line-clamp-2">{authorBio}</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 flex-shrink-0 rounded-full bg-border overflow-hidden">
                {authorAvatarUrl && (
                  <StrapiImage
                    src={authorAvatarUrl}
                    alt={authorName}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <span className="font-semibold text-text-primary">{authorName}</span>
                <p className="text-xs text-text-secondary line-clamp-2">{authorBio}</p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-background-secondary/50 p-4 backdrop-blur-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-primary">
            Share This Article
          </h3>
          <ShareButtons title={article.title} slug={article.slug} />
        </div>

        <div className="rounded-lg border border-border bg-background-secondary/50 p-4 text-center">
          <span className="text-xs text-text-secondary">Advertisement</span>
          <div className="mt-2 h-64 w-full bg-border"></div>
        </div>
      </div>
    </aside>
  );
}