// FILE: frontend/app/api/logout/route.ts
// (This is a new file. Use this full code.)

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("Logout API called");

    // Clear the cookie by setting its MaxAge to 0 or a past date
    cookies().set("strapiJwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ message: "Logout successful" });

  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred during logout." },
      { status: 500 }
    );
  }
}