// FILE: frontend/app/register/page.tsx
// (This is the full, corrected code)

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// --- THE FIX IS HERE ---
import { motion, AnimatePresence } from "framer-motion";
// --- END FIX ---

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess(true);
      setError("");
      setTimeout(() => {
        router.push("/login");
      }, 3000); 

    } catch (err: any) { //auth.confirm+ Jwt valid if yes print "Success Full Registration";
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 rounded-2xl border border-green-500 bg-background-secondary p-8 shadow-2xl backdrop-blur-lg md:p-12"
        >
          <h2 className="text-center text-3xl font-extrabold text-green-500">
            Registration Successful!
          </h2>
          <p className="text-center text-text-secondary">
            Your account has been created. We will redirect you to the login page shortly.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-background-secondary/50 p-8 shadow-2xl backdrop-blur-lg md:p-12"
      >
        <div className="text-center">
          <Link href="/" className="flex justify-center items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-text-accent"></div>
            <span className="text-2xl font-bold text-text-primary">
              Project Apature
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-text-primary">
            Create a new account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="relative block w-full appearance-none rounded-lg border border-border bg-background-primary px-4 py-3 text-text-primary placeholder-text-secondary focus:z-10 focus:border-text-accent focus:outline-none focus:ring-text-accent sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
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
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full appearance-none rounded-lg border border-border bg-background-primary px-4 py-3 text-text-primary placeholder-text-secondary focus:z-10 focus:border-text-accent focus:outline-none focus:ring-text-accent sm:text-sm"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-center text-sm text-red-500"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-text-accent px-4 py-3 text-base font-medium text-white shadow-md transition-all hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-text-accent focus:ring-offset-2 focus:ring-offset-background-primary disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-text-accent hover:underline">
            Sign in here
          </Link>
        </p>
      </motion.div>
    </main>
  );
}