// FILE: frontend/app/auth/reset-password/page.tsx
// (This is a new file. Use this full code.)

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetCode = searchParams.get("code");

  useEffect(() => {
    if (!resetCode) {
      setStatus("error");
      setMessage("Invalid reset link. No code provided.");
    }
  }, [resetCode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: resetCode,
          password,
          passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Your password has been successfully reset. You can now log in.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        throw new Error(data.error?.message || "Failed to reset password.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
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
            Password Reset!
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
              Reset Your Password
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Enter your new password below.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md space-y-4">
              <div>
                <label htmlFor="password" className="sr-only">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="relative block w-full appearance-none rounded-lg border border-border bg-background-primary px-4 py-3 text-text-primary placeholder-text-secondary focus:z-10 focus:border-text-accent focus:outline-none focus:ring-text-accent sm:text-sm"
                  placeholder="New Password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status === "loading" || !resetCode}
                />
              </div>
              <div>
                <label htmlFor="passwordConfirmation" className="sr-only">
                  Confirm New Password
                </label>
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="relative block w-full appearance-none rounded-lg border border-border bg-background-primary px-4 py-3 text-text-primary placeholder-text-secondary focus:z-10 focus:border-text-accent focus:outline-none focus:ring-text-accent sm:text-sm"
                  placeholder="Confirm New Password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  disabled={status === "loading" || !resetCode}
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
                disabled={status === "loading" || !resetCode}
              >
                {status === "loading" ? "Saving..." : "Save New Password"}
              </button>
            </div>
          </form>
        </>
      )}
    </motion.div>
  );
}

// We wrap the component in a <Suspense> boundary
export default function ResetPasswordPage() {
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-text-primary">Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}