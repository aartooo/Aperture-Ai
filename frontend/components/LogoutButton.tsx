// FILE: frontend/components/LogoutButton.tsx
// (This is a new file. Use this full code.)

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (!res.ok) {
        throw new Error("Logout failed");
      }
      // Refresh the page to update the header via server-side session check
      router.refresh();
      // Optionally redirect to homepage after logout
      // router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-md border border-border px-4 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-background-secondary disabled:opacity-50"
    >
      {loading ? "Logging out..." : "Log Out"}
    </button>
  );
}