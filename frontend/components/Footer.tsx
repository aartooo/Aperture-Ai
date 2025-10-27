// FILE: frontend/components/Footer.tsx
// (This is a new file. Use this full code.)

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-background-secondary">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* Column 1: Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-text-accent"></div>
            <span className="text-xl font-bold text-text-primary">
              Project Apature
            </span>
          </Link>
          <p className="mt-3 text-sm text-text-secondary">
            In-depth analysis of AI tools and the future of technology.
          </p>
          <p className="mt-4 text-xs text-text-secondary/70">
            &copy; {currentYear} Project Apature. All rights reserved.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/" className="text-sm text-text-secondary hover:text-text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/categories/reviews" className="text-sm text-text-secondary hover:text-text-primary">
                Reviews
              </Link>
            </li>
            <li>
              <Link href="/categories/news" className="text-sm text-text-secondary hover:text-text-primary">
                News
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal & About */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
            Company
          </h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/about" className="text-sm text-text-secondary hover:text-text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-sm text-text-secondary hover:text-text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-text-secondary hover:text-text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}