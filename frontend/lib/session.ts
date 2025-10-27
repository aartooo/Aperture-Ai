// FILE: frontend/lib/session.ts
// (This is a new file. Use this full code.)

import { cookies } from "next/headers"; // Import cookies from next/headers

// Helper function to get the session from the server-side cookies
// This file is server-only because it uses next/headers
export function getSession() {
  const jwt = cookies().get("strapiJwt")?.value;

  if (!jwt) {
    // If no JWT cookie exists, user is not logged in
    return null;
  }

  // Basic check: If the cookie exists, we consider the user logged in for now.
  // LATER: We should decode/verify the JWT here to get user info and check expiration.
  return {
    jwt: jwt,
  };
}