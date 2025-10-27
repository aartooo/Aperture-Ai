// FILE: frontend/app/api/register/route.ts
// (This is the full, corrected code)

import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function POST(request: NextRequest) {
  const { username, email, password } = await request.json();

  if (!username || !email || !password) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    // 1. Call Strapi's registration endpoint
    const strapiRes = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const strapiData = await strapiRes.json();

    // 2. Handle Strapi errors (e.g., email already taken)
    if (!strapiRes.ok || strapiData.error) {
      console.error("Strapi Registration Error:", strapiData.error);
      const errorMessage =
        strapiData.error?.message || "Registration failed. Please try again.";
      // Strapi often sends a 400 for validation errors
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    // --- THIS IS THE FIX ---
    // 3. Registration successful - Strapi returns user, but NO JWT.
    const { user } = strapiData; // We only expect the user object

    if (!user) {
      // This is our new, more accurate error check
      throw new Error("Strapi registration response missing user object.");
    }

    console.log("Registration API successful for user:", user.email);

    // Prepare response data
    const responseData = {
      message: "Registration successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };

    // 4. Just return the successful JSON response.
    // We DO NOT set a cookie here because email confirmation is required.
    return NextResponse.json(responseData, { status: 200 });
    // --- END OF FIX ---

  } catch (error: any) {
    console.error("Register API Route Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}