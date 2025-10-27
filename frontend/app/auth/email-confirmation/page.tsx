// FILE: frontend/app/auth/email-confirmation/page.tsx
// (This is the full, corrected code)

"use client";

// We no longer need useEffect, useState, or useSearchParams
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense } from "react"; // Keep Suspense for good practice

// This component now *only* displays the success message.
// The verification was handled by Strapi *before* the user landed here.
function EmailConfirmationContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-full max-w-md space-y-8 rounded-2xl border border-green-500 bg-background-secondary/50 p-8 shadow-2xl backdrop-blur-lg md:p-12"
    >
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-green-500">
          Success!
        </h2>
        <p className="mt-4 text-text-secondary">
          Your email has been successfully verified. You can now log in to
          your account.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-block w-full rounded-md bg-text-accent px-4 py-3 text-base font-medium text-white transition-colors hover:bg-opacity-90"
        >
          Back to Log In
        </Link>
      </div>
    </motion.div>
  );
}

// We still wrap in Suspense as a best practice for pages
// that might use searchParams in the future, but it's not
// strictly necessary for this new logic.
export default function EmailConfirmationPage() {
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-text-primary">Loading...</div>}>
        <EmailConfirmationContent />
      </Suspense>
    </main>
  );
}