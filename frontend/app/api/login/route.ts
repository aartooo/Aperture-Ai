// FILE: frontend/app/api/login/route.ts
// (This is the full code for this file with cookie setting)

import { NextRequest, NextResponse } from "next/server";
// Import 'cookies' from 'next/headers' for App Router
import { cookies } from "next/headers";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
// We also need the secret for signing potential future cookies, though not strictly needed for just setting Strapi's JWT
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

export async function POST(request: NextRequest) {
  const { identifier, password } = await request.json();

  if (!identifier || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    // 1. Call Strapi's login endpoint
    const strapiRes = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const strapiData = await strapiRes.json();

    // 2. Handle Strapi errors
    if (!strapiRes.ok || strapiData.error) {
      console.error("Strapi Login Error:", strapiData.error);
      const errorMessage = strapiData.error?.message || "Invalid credentials";
      return NextResponse.json({ message: errorMessage }, { status: 401 });
    }

    // 3. Login successful - Strapi returns user and JWT
    const { user, jwt } = strapiData;

    if (!user || !jwt) {
      throw new Error("Strapi response missing user or JWT.");
    }

    console.log("Login API successful for user:", user.email);

    // Prepare response data
    const responseData = {
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };

    // --- SETTING THE COOKIE ---
    // Create the response object first
    const response = NextResponse.json(responseData);

    // Use the 'cookies().set' method from 'next/headers'
    cookies().set("strapiJwt", jwt, {
      httpOnly: true, // Crucial for security: prevents JS access
      secure: process.env.NODE_ENV === "production", // Use secure cookies in prod
      maxAge: 60 * 60 * 24 * 30, // Expires in 30 days (in seconds)
      path: "/", // Cookie available site-wide
      sameSite: "lax", // Good balance of security and usability
    });
    // --- END SETTING THE COOKIE ---

    // Return the response (which now has the Set-Cookie header implicitly added)
    return response;

  } catch (error: any) {
    console.error("Login API Route Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}