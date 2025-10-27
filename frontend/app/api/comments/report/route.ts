    // This route reports an existing comment
    // POST /api/comments/report
    
    import { NextRequest, NextResponse } from "next/server";
    import { cookies } from "next/headers";
    
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    
    export async function POST(request: NextRequest) {
      // Get token if it exists, but don't block unauthenticated users
      const token = cookies().get("strapiJwt")?.value;
      
      const { commentId, reason } = await request.json();
    
      if (!commentId || !reason) {
        return NextResponse.json(
          { message: "Comment ID and reason are required" },
          { status: 400 }
        );
      }
    
      try {
        // We call the plugin's 'report' endpoint
        const strapiRes = await fetch(
          `${STRAPI_URL}/api/comments-reports/report/${commentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // If the user is logged in, pass their token
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({ content: reason }),
            cache: "no-store",
          }
        );
    
        if (!strapiRes.ok) {
           const strapiData = await strapiRes.json();
          console.error("[POST /api/comments/report] Strapi error:", strapiData);
          throw new Error(strapiData.error?.message || "Failed to report comment");
        }
    
        return NextResponse.json({ message: "Comment reported successfully" });
    
      } catch (error: any) {
        console.error("[POST /api/comments/report] Error:", error);
        return NextResponse.json(
          { message: error.message || "An internal server error occurred." },
          { status: 500 }
        );
      }
    }
    

