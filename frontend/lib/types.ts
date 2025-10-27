// FILE: frontend/lib/types.ts
// (Updated to include FlatCategory for header and preserve existing types)

// --- GENERIC STRAPI WRAPPERS ---

/**
 * A generic wrapper for a single Strapi data entry.
 * Used when expecting standard Strapi response with attributes.
 */
export interface StrapiData<T> {
  id: number;
  attributes: T;
}

/**
 * A generic wrapper for a Strapi API response for collections.
 * 'data' is always an array for collection endpoints.
 */
export interface StrapiApiResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// --- MEDIA & BLOCKS ---

/**
 * Represents the attributes of a single image format (e.g., thumbnail)
 */
export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  url: string;
}

/**
 * Represents the 'attributes' of a Strapi Image (Media Library item)
 */
export interface StrapiImage {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a child node in Strapi's Rich Text (Blocks) editor
 */
export interface StrapiBlockChild {
  type: string;
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

/**
 * Represents a block in Strapi's Rich Text (Blocks) editor
 */
export interface StrapiBlock {
  type: "paragraph" | "heading" | "list" | "quote" | "image" | "embed";
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: StrapiBlockChild[];
  format?: "ordered" | "unordered";
  image?: StrapiData<StrapiImage> | null;
  embed?: any;
}

// --- COLLECTION TYPE ATTRIBUTES ---

/**
 * The 'attributes' of an AuthorProfile
 */
export interface AuthorProfile {
  name: string;
  slug: string;
  bio: StrapiBlock[] | null;
  avatar: StrapiData<StrapiImage> | null;
  articles: { data: StrapiData<Article>[] } | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// ... (after Tag or Category)

/**
 * The 'attributes' of a Partner
 */
export interface Partner {
  name: string;
  url: string;
  logo: StrapiImage; // Use the flat StrapiImage type
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

/**
 * The flat structure of a Category as returned by the API (due to transformer plugin)
 */
export interface FlatCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  children: FlatCategory[] | null;
  articles?: any[]; // Optional, as not always populated
}

/**
 * The 'attributes' of a Category (for standard Strapi responses)
 */
export interface Category {
  name: string;
  slug: string;
  description: string | null;
  children: { data: StrapiData<Category>[] } | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

/**
 * The 'attributes' of a Tag
 */
export interface Tag {
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

/**
 * The 'attributes' of an Article
 */
export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  body: StrapiBlock[] | null;
  coverImage: StrapiData<StrapiImage> | null;
  publishedAt: string | null;
  isAffiliate: boolean;
  isSponsored: boolean;
  author: StrapiData<AuthorProfile> | null;
  category: StrapiData<Category> | FlatCategory | null; // Support both structures
  tags: { data: StrapiData<Tag>[] } | null;
  reviewDetails: ReviewDetails | null;
  contentBlocks: ContentBlock[] | null;
  seo: SeoComponent | null;
  createdAt: string;
  updatedAt: string;
}

// --- COMPONENT & DYNAMIC ZONE TYPES ---

/**
 * The 'Seo' component
 */
export interface SeoComponent {
  id: number;
  metaTitle: string;
  metaDescription: string;
  canonicalURL?: string | null;
  metaImage: StrapiData<StrapiImage> | null;
}

/**
 * The 'ReviewDetails' component
 */
export interface ReviewDetails {
  id: number;
  productName: string;
  rating: number;
  pros: StrapiBlock[] | null;
  cons: StrapiBlock[] | null;
  verdict: StrapiBlock[] | null;
}

/**
 * A component within the 'contentBlocks' Dynamic Zone
 */
export type ContentBlock =
  | {
      id: number;
      __component: "article-images.image-block";
      image: StrapiData<StrapiImage> | null;
    }
  | {
      id: number;
      __component: "article-images.video-embed-block";
      embedCode: string | null;
    };

    export interface User {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null; // <--
}