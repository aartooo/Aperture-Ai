// FILE: frontend/app/layout.tsx
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import SmoothScroller from "./SmoothScroller";
import { ScrollToTopButton } from "../components/ScrollToTopButton";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { fetchApi } from "../lib/api";
import { StrapiApiResponse, FlatCategory, User } from "../lib/types";
import { cookies } from "next/headers";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "Project Apature",
  description: "Deeply researched AI tools and tech news.",
};

async function getNavCategories() {
  const query = {
    filters: {
      parent: { id: { $null: true } },
    },
    populate: {
      children: { populate: "*" },
    },
    sort: "name:asc",
  };

  try {
    const res =
      await fetchApi<StrapiApiResponse<FlatCategory>>("categories", query);

    return res.data;
  } catch (error) {
    console.error("[getNavCategories] Error:", error);
    return [];
  }
}

async function getFullUser(): Promise<User | null> {
  const token = cookies().get("strapiJwt")?.value;

  if (!token) {
    return null;
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/auth/session`, {
      headers: {
        Cookie: `strapiJwt=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch user session:", res.status);
      return null;
    }

    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error("[getFullUser] Error:", error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getFullUser();
  const categories = await getNavCategories();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body
        className={`${lexend.variable} font-sans bg-background-primary text-text-primary overflow-x-hidden`}
      >
        <Providers>
          <Header user={user} categories={categories} />
          <SmoothScroller>{children}</SmoothScroller>
          <ScrollToTopButton />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}