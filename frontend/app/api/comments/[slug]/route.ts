    // This route fetches comments for a specific article
    // e.g., GET /api/comments/api::article.article:23
    
    import { NextRequest, NextResponse } from "next/server";
    
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    
    export async function GET(
      request: NextRequest,
      { params }: { params: { slug: string } }
    ) {
      // The 'slug' here will be the full relation string,
      // e.g., "api::article.article:23"
      const relationSlug = params.slug;
    
      if (!relationSlug) {
        return NextResponse.json(
          { message: "Article identifier is required" },
          { status: 400 }
        );
      }
    
      try {
        // We call the plugin's 'find' endpoint.
        // No token is needed because we set Public permissions to 'find'.
        const res = await fetch(
          `${STRAPI_URL}/api/comments/${relationSlug}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store", // Always fetch fresh comments
          }
        );
    
        const data = await res.json();
    
        if (!res.ok) {
          console.error("[GET /api/comments] Strapi error:", data);
          throw new Error(data.error?.message || "Failed to fetch comments from Strapi");
        }
    
        return NextResponse.json(data);
      } catch (err: any) {
        console.error(`[GET /api/comments] Error:`, err);
        return NextResponse.json(
          { message: "Failed to load comments." },
          { status: 500 }
        );
      }
    }
    

