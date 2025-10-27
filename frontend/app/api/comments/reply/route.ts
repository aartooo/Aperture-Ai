    // This route replies to an EXISTING comment (threaded)
    // POST /api/comments/reply
    
    import { NextRequest, NextResponse } from "next/server";
    import { cookies } from "next/headers";
    import { getFullUser } from "../../../../lib/auth";
    
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
    
      // We need the 'threadOf' (parentId) to make this a reply
      const { content, relation, parentId } = await request.json();
    
      if (!content || !relation || !parentId) {
        return NextResponse.json(
          { message: "Content, relation, and parentId are required" },
          { status: 400 }
        );
      }
    
      try {
        // We call the same 'create' endpoint, but add the 'threadOf' field
        const strapiRes = await fetch(
          `${STRAPI_URL}/api/comments/${relation}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              content: content,
              threadOf: parentId, // This makes it a reply
            }),
            cache: "no-store",
          }
        );
    
        const strapiData = await strapiRes.json();
    
        if (!strapiRes.ok) {
          console.error("[POST /api/comments/reply] Strapi error:", strapiData);
          throw new Error(strapiData.error?.message || "Failed to post reply");
        }
    
        // Return the newly created reply
        return NextResponse.json(strapiData);
    
      } catch (error: any) {
        console.error("[POST /api/comments/reply] Error:", error);
        return NextResponse.json(
          { message: error.message || "An internal server error occurred." },
          { status: 500 }
        );
      }
    }
    

