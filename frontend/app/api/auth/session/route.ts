// FILE: frontend/app/api/auth/session/route.ts
// This API route checks if user is authenticated and returns user data
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function GET(request: NextRequest) {
  try {
    // Read the httpOnly cookie server-side (secure!)
    const jwt = cookies().get("strapiJwt")?.value;

    if (!jwt) {
      return NextResponse.json(
        { authenticated: false, message: "No session found" },
        { status: 401 }
      );
    }

    // Verify the JWT by fetching user data from Strapi
    const strapiRes = await fetch(`${STRAPI_URL}/api/users/me?populate=avatar`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!strapiRes.ok) {
      // JWT is invalid or expired
      return NextResponse.json(
        { authenticated: false, message: "Invalid session" },
        { status: 401 }
      );
    }

    const user = await strapiRes.json();

    // Return user data with BOTH formats for compatibility
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio || "",
        // For Header component (expects string)
        avatarUrl: user.avatar?.url || null,
        // For Settings page (expects object)
        avatar: user.avatar ? {
          id: user.avatar.id,
          url: user.avatar.url,
          alternativeText: user.avatar.alternativeText || null,
          width: user.avatar.width,
          height: user.avatar.height,
        } : null,
      },
    });

  } catch (error: any) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { authenticated: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}