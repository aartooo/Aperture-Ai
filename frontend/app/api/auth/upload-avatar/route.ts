// FILE: frontend/app/api/auth/upload-avatar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function POST(request: NextRequest) {
  try {
    const jwt = cookies().get("strapiJwt")?.value;

    if (!jwt) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { message: "File and user ID are required" },
        { status: 400 }
      );
    }

    // Step 1: Upload file to Strapi
    const uploadFormData = new FormData();
    uploadFormData.append("files", file);

    const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: uploadFormData,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error("Upload error:", errorText);
      throw new Error("Failed to upload image to Strapi");
    }

    const uploadedFiles = await uploadRes.json();
    
    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new Error("No file uploaded");
    }

    const uploadedFile = uploadedFiles[0];

    // Step 2: Link avatar to user
    const updateRes = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        avatar: uploadedFile.id,
      }),
    });

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      console.error("Update user error:", errorText);
      throw new Error("Failed to update user avatar");
    }

    // Step 3: Fetch updated user data with avatar populated
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
      message: "Avatar updated successfully",
      user,
    });

  } catch (error: any) {
    console.error("Upload avatar API error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}