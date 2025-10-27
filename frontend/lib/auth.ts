// FILE: frontend/lib/auth.ts
// (Create this new file)

import { cookies } from "next/headers";
import { User } from "./types"; // Adjust path if your types.ts is elsewhere

/**
 * A server-side helper to get the currently logged-in user.
 * Reads the 'strapiJwt' cookie and validates it via our API route.
 */
export async function getFullUser(): Promise<User | null> {
  const token = cookies().get("strapiJwt")?.value;

  if (!token) {
    return null;
  }

  try {
    // We fetch from our own API route, which securely validates the cookie
    // This MUST be an absolute URL for server-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/auth/session`, {
      headers: {
        Cookie: `strapiJwt=${token}`,
      },
      cache: "no-store", // Don't cache session data
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    // Our /api/auth/session route returns { authenticated: boolean, user: User }
    if (data.authenticated && data.user) {
      return data.user;
    }

    return null;
  } catch (error) {
    console.error("[getFullUser] Error:", error);
    return null;
  }
}