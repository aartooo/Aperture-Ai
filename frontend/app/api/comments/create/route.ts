    // This route creates a NEW top-level comment
    // POST /api/comments/create
    
    import { NextRequest, NextResponse } from "next/server";
    import { cookies } from "next/headers";
    import { getFullUser } from "../../../../lib/auth"; // Your existing auth helper
    
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    
    export async function POST(request: NextRequest) {
      const token = cookies().get("strapiJwt")?.value;
      const user = await getFullUser();
    
      if (!token || !user) {
        return NextResponse.json(
          { message: "Unauthorized. Please log in to comment." },
          { status: 401 }
        );
      }
    
      // The plugin expects 'content' and the 'relation' (slug)
      const { content, relation } = await request.json();
    
      if (!content || !relation) {
        return NextResponse.json(
          { message: "Content and relation are required" },
          { status: 400 }
        );
      }
    
      try {
        // We call the plugin's 'create' endpoint
        const strapiRes = await fetch(
          `${STRAPI_URL}/api/comments/${relation}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // We MUST use the user's token to post as them
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: content }),
            cache: "no-store",
          }
        );
    
        const strapiData = await strapiRes.json();
    
        if (!strapiRes.ok) {
          console.error("[POST /api/comments/create] Strapi error:", strapiData);
          throw new Error(strapiData.error?.message || "Failed to post comment");
        }
    
        // Return the newly created comment
        return NextResponse.json(strapiData);
    
      } catch (error: any) {
        console.error("[POST /api/comments/create] Error:", error);
        return NextResponse.json(
          { message: error.message || "An internal server error occurred." },
          { status: 500 }
        );
      }
    }
    

