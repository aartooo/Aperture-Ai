// FILE: frontend/app/api/auth/update-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function PUT(request: NextRequest) {
  try {
    const jwt = cookies().get("strapiJwt")?.value;

    if (!jwt) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, username, bio } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Update user in Strapi
    const updateRes = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        username,
        bio,
      }),
    });

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      console.error("Update user error:", errorText);
      throw new Error("Failed to update profile");
    }

    // Fetch updated user data with avatar populated
    const userRes = await fetch(`${STRAPI_URL}/api/users/me?populate=avatar`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!userRes.ok) {
      throw new Error("Failed to fetch updated user");
    }

    const strapiUser = await userRes.json();

    // Transform to match User type expected by settings page
    const user = {
      id: strapiUser.id,
      username: strapiUser.username,
      email: strapiUser.email,
      bio: strapiUser.bio || null,
      avatar: strapiUser.avatar
        ? {
            id: strapiUser.avatar.id,
            url: strapiUser.avatar.url,
            alternativeText: strapiUser.avatar.alternativeText || null,
            width: strapiUser.avatar.width,
            height: strapiUser.avatar.height,
          }
        : null,
    };

    return NextResponse.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error: any) {
    console.error("Update profile API error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}