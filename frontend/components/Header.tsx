"use client";

import Link from "next/link";
import Image from "next/image"; // 1. IMPORT NEXT/IMAGE
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LogoutButton } from "./LogoutButton";
import { HamburgerIcon, CloseIcon, ChevronDownIcon, SearchIcon } from "./Icons";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FlatCategory, User } from "../lib/types"; // 2. IMPORT USER TYPE

// --- HELPER COMPONENT FOR THE AVATAR ---
// This handles showing the image or a fallback initial
function Avatar({ user }: { user: User | null }) {
  if (!user) return null;

  // Get Strapi URL from environment variables
  // Make sure NEXT_PUBLIC_STRAPI_URL is in your .env.local file!
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  if (user.avatarUrl) {
    // Check if the URL is already absolute (e.g., from a social provider)
    // or relative (from a Strapi upload)
    const imageUrl = user.avatarUrl.startsWith("http")
      ? user.avatarUrl
      : `${strapiUrl}${user.avatarUrl}`;

    return (
      <Image
        src={imageUrl}
        alt={user.username || "Profile picture"}
        width={32} // Set width
        height={32} // Set height
        className="h-8 w-8 rounded-full object-cover" // Keep your sizing
      />
    );
  }

  // Fallback: show first letter of username
  const initial = user.username ? user.username[0].toUpperCase() : "?";
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-border text-sm font-medium text-text-primary">
      {initial}
    </div>
  );
}
// --- END OF AVATAR COMPONENT ---

// Define types
type NavCategory = {
  id: number;
  name: string;
  slug: string;
  subcategories: NavCategory[];
};

type HeaderProps = {
  user: User | null; // 3. CHANGED FROM 'session' TO 'user'
  categories: FlatCategory[];
};

export function Header({ user, categories }: HeaderProps) {
  // 4. CHANGED FROM 'session' TO 'user'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState<number | null>(
    null
  );
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileSubMenu(null);
  }, [pathname]);

  // Map categories to simpler format
  const mappedCategories: NavCategory[] =
    categories.map((category) => ({
      id: category.id,
      name: category.name || "",
      slug: category.slug || "",
      subcategories:
        category.children?.map((sub) => ({
          id: sub.id,
          name: sub.name || "",
          slug: sub.slug || "",
          subcategories: [],
        })) || [],
    })) || [];

  // Helper function to get the correct login redirect URL
  const getLoginUrl = () => {
    // Don't redirect back to auth-related pages
    const authPages = [
      "/login",
      "/register",
      "/forgot-password",
      "/auth/reset-password",
      "/auth/email-confirmation",
    ];

    // If we're on an auth page, redirect to home after login
    if (authPages.some((page) => pathname.startsWith(page))) {
      return "/login";
    }

    // Otherwise, redirect back to current page after login
    return `/login?redirect=${pathname}`;
  };

  // Animation variants for the menus
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.2 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.2 },
    },
  };

  // Animation variants for mobile subcategories
  const subMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-border/50 bg-background-primary/80 backdrop-blur-lg transition-colors">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex flex-shrink-0 items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-text-accent"></div>
            <span className="text-xl font-bold text-text-primary">
              Project Apature
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {mappedCategories.map((category) =>
              category.subcategories.length > 0 ? (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(category.id)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button className="flex items-center gap-1 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
                    {category.name}
                    <motion.div
                      animate={{ rotate: openMenu === category.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDownIcon />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openMenu === category.id && (
                      <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 rounded-xl border border-border/50 bg-background-secondary/80 p-2 shadow-2xl backdrop-blur-lg"
                      >
                        <Link
                          href={`/categories/${category.slug}`}
                          className="block rounded-lg px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-background-primary"
                        >
                          All {category.name}
                        </Link>
                        <div className="my-1 h-px bg-border/50" />
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/categories/${sub.slug}`}
                            className="block rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-background-primary hover:text-text-primary"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                >
                  {category.name}
                </Link>
              )
            )}

            <div className="h-4 w-px bg-border" />
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:text-text-primary"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <ThemeSwitcher />

            {/* 5. DESKTOP AUTH SECTION - UPDATED */}
            {user ? (
              <>
                <Link
                  href="/account/settings"
                  className="transition-transform hover:scale-110"
                  aria-label="Account settings"
                >
                  <Avatar user={user} />
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link
                href={getLoginUrl()}
                className="rounded-md bg-text-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-opacity-90"
              >
                Log In
              </Link>
            )}
            {/* END OF UPDATE */}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:text-text-primary"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <ThemeSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-text-primary hover:bg-background-secondary"
              aria-label="Open main menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 z-20 w-full border-b border-border/50 bg-background-primary/80 p-4 shadow-lg backdrop-blur-lg lg:hidden"
          >
            <nav className="flex flex-col space-y-2">
              {mappedCategories.map((category) => (
                <div key={category.id}>
                  <div
                    className="flex items-center justify-between rounded-md px-3 py-2 text-base font-medium text-text-primary hover:bg-background-secondary cursor-pointer"
                    onClick={() =>
                      setOpenMobileSubMenu(
                        openMobileSubMenu === category.id ? null : category.id
                      )
                    }
                  >
                    <span>{category.name}</span>
                    {category.subcategories.length > 0 && (
                      <motion.div
                        animate={{
                          rotate: openMobileSubMenu === category.id ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDownIcon />
                      </motion.div>
                    )}
                  </div>
                  <AnimatePresence>
                    {category.subcategories.length > 0 &&
                      openMobileSubMenu === category.id && (
                        <motion.div
                          variants={subMenuVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="ml-4 mt-2 flex flex-col space-y-2 border-l border-border/50 pl-4"
                        >
                          <Link
                            href={`/categories/${category.slug}`}
                            className="block rounded-md px-3 py-2 text-sm font-semibold text-text-primary hover:bg-background-secondary"
                          >
                            All {category.name}
                          </Link>
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/categories/${sub.slug}`}
                              className="block rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-background-secondary hover:text-text-primary"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="border-t border-border/50 pt-4 mt-4">
                {/* 6. MOBILE AUTH SECTION - UPDATED */}
                {user ? (
                  <div className="flex items-center justify-between">
                    <Link
                      href="/account/settings"
                      className="flex items-center gap-3"
                    >
                      <Avatar user={user} />
                      <span className="text-base font-medium text-text-primary">
                        {user.username || "My Profile"}
                      </span>
                    </Link>
                    <LogoutButton />
                  </div>
                ) : (
                  <Link
                    href={getLoginUrl()}
                    className="flex w-full justify-center rounded-md bg-text-accent px-4 py-2 text-base font-medium text-white transition-colors hover:bg-opacity-90"
                  >
                    Log In
                  </Link>
                )}
                {/* END OF UPDATE */}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}