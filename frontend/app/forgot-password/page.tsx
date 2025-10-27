// FILE: frontend/app/forgot-password/page.tsx
// (This is a new file. Use this full code.)

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("If an account with that email exists, a reset link has been sent.");
      } else {
        throw new Error(data.error?.message || "An error occurred.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-background-secondary/50 p-8 shadow-2xl backdrop-blur-lg md:p-12"
      >
        {status === "success" ? (
          // --- SUCCESS MESSAGE ---
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-green-500">
              Check Your Email
            </h2>
            <p className="mt-4 text-text-secondary">{message}</p>
            <Link
              href="/login"
              className="mt-8 inline-block w-full rounded-md bg-text-accent px-4 py-3 text-base font-medium text-white transition-colors hover:bg-opacity-90"
            >
              Back to Log In
            </Link>
          </div>
        ) : (
          // --- DEFAULT FORM ---
          <>
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-text-primary">
                Forgot Your Password?
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                No problem. Enter your email below and we'll send you a link to reset it.
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md space-y-4">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full appearance-none rounded-lg border border-border bg-background-primary px-4 py-3 text-text-primary placeholder-text-secondary focus:z-10 focus:border-text-accent focus:outline-none focus:ring-text-accent sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <AnimatePresence>
                {message && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`mt-2 text-center text-sm ${
                      status === "error" ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-lg border border-transparent bg-text-accent px-4 py-3 text-base font-medium text-white shadow-md transition-all hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-text-accent focus:ring-offset-2 focus:ring-offset-background-primary disabled:opacity-50"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
            <p className="mt-6 text-center text-text-secondary">
              Remembered it?{" "}
              <Link href="/login" className="font-medium text-text-accent hover:underline">
                Sign in here
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </main>
  );
}