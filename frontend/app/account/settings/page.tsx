// FILE: frontend/app/account/settings/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { StrapiImage } from "../../../components/StrapiImage";
import { motion, AnimatePresence } from "framer-motion";

// Define the image type structure
interface ImageData {
  id: number;
  url: string;
  alternativeText?: string | null;
  width: number;
  height: number;
}

// User profile interface
interface UserProfile {
  id: number;
  username: string;
  email: string;
  bio?: string;
  avatar?: ImageData | null;
}

function SettingsContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const router = useRouter();

  // Check authentication and fetch user data
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();

        if (!res.ok || !data.authenticated) {
          console.log("Not authenticated, redirecting to login");
          setIsRedirecting(true);
          setLoading(false);
          router.push("/login?redirect=/account/settings");
          return;
        }

        setProfile(data.user);
        setUsername(data.user.username);
        setBio(data.user.bio || "");
        setLoading(false);

      } catch (err) {
        console.error("Failed to check auth", err);
        setError("Failed to load your profile.");
        setLoading(false);
        setIsRedirecting(true);
        router.push("/login?redirect=/account/settings");
      }
    }

    checkAuth();
  }, [router]);

  // Handle text details update
  const handleDetailsUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!profile) return;
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.id,
          username: username,
          bio: bio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfile(data.user);
      setSuccess("Profile updated successfully!");

    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!avatarFile || !profile) return;
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", avatarFile);
      formData.append("userId", profile.id.toString());

      const res = await fetch("/api/auth/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to upload avatar");
      }

      setProfile(data.user);
      setAvatarFile(null);
      setSuccess("Avatar updated successfully!");

    } catch (err: any) {
      setError(err.message || "Failed to upload avatar.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-border border-t-text-accent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="text-center text-text-secondary py-20">
        <div className="inline-flex items-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-border border-t-text-accent animate-spin"></div>
          <span>Redirecting to login...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const comingSoonFeatures = [
    {
      icon: "🔔",
      title: "Smart Notifications",
      description: "Get personalized alerts for topics you care about"
    },
    {
      icon: "🎨",
      title: "Custom Themes",
      description: "Personalize your reading experience with custom color schemes"
    },
    {
      icon: "📊",
      title: "Reading Analytics",
      description: "Track your reading habits and discover insights"
    },
    {
      icon: "⭐",
      title: "Saved Articles",
      description: "Build your personal library of favorite content"
    },
    {
      icon: "🔐",
      title: "Privacy Controls",
      description: "Advanced settings to control your data and visibility"
    },
    {
      icon: "🌐",
      title: "Social Connect",
      description: "Follow writers and connect with like-minded readers"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-3"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
          Account Settings
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Manage your profile and preferences
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-3xl border border-border bg-gradient-to-br from-background-secondary/80 to-background-secondary/40 p-8 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-text-accent/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              Your Profile
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Update your photo and personal details
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-text-accent/10 text-text-accent text-sm font-medium">
            Active
          </div>
        </div>

        {/* Avatar Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-6 p-6 rounded-2xl bg-background-primary/30 border border-border/50">
          <div className="relative">
            <div className="h-24 w-24 flex-shrink-0 rounded-2xl bg-gradient-to-br from-text-accent/20 to-text-accent/5 overflow-hidden border-2 border-text-accent/20 shadow-lg">
              {profile.avatar?.url ? (
                <StrapiImage
                  src={profile.avatar.url}
                  alt="Profile avatar"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-text-accent text-3xl font-bold">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-background-secondary"></div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-text-accent/10 file:px-5 file:py-2.5 file:text-sm file:font-semibold file:text-text-accent hover:file:bg-text-accent/20 transition-all file:cursor-pointer cursor-pointer"
              />
            </div>
            <button
              onClick={handleAvatarUpload}
              disabled={!avatarFile || loading}
              className="rounded-xl bg-text-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-text-accent/20 transition-all hover:bg-opacity-90 hover:shadow-xl hover:shadow-text-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Upload Avatar"}
            </button>
          </div>
        </div>
        
        {/* Details Form */}
        <form onSubmit={handleDetailsUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-text-primary mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-xl border border-border bg-background-primary/50 px-4 py-3.5 text-text-primary placeholder-text-secondary/50 focus:border-text-accent focus:outline-none focus:ring-2 focus:ring-text-accent/20 transition-all"
                placeholder="Your username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={profile.email}
                  disabled
                  className="block w-full rounded-xl border border-border bg-background-primary/30 px-4 py-3.5 text-text-secondary/70"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-background-secondary text-xs text-text-secondary">
                  Verified
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-text-primary mb-2">
              Bio
            </label>
            <textarea
              rows={4}
              name="bio"
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself... This will appear on your comments"
              className="block w-full rounded-xl border border-border bg-background-primary/50 px-4 py-3.5 text-text-primary placeholder-text-secondary/50 focus:border-text-accent focus:outline-none focus:ring-2 focus:ring-text-accent/20 transition-all resize-none"
            />
            <p className="mt-2 text-xs text-text-secondary">
              {bio.length} / 500 characters
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 px-4 py-2 rounded-lg"
                >
                  <span>⚠️</span>
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 px-4 py-2 rounded-lg"
                >
                  <span>✓</span>
                  {success}
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              type="submit"
              disabled={loading}
              className="sm:ml-auto rounded-xl bg-text-accent px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-text-accent/20 transition-all hover:bg-opacity-90 hover:shadow-xl hover:shadow-text-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Security Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-3xl border border-border bg-gradient-to-br from-background-secondary/80 to-background-secondary/40 p-8 md:p-10 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-text-accent/10 flex items-center justify-center text-xl">
                🔐
              </div>
              <h2 className="text-2xl font-bold text-text-primary">
                Security
              </h2>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Manage your password and account security settings
            </p>
            <button
              onClick={() => router.push('/forgot-password')}
              className="rounded-xl bg-background-primary px-6 py-3 text-sm font-semibold text-text-primary border border-border transition-all hover:bg-border hover:shadow-lg"
            >
              Change Password
            </button>
          </div>
        </div>
      </motion.div>

      {/* Coming Soon Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-3xl border border-border bg-gradient-to-br from-background-secondary/80 to-background-secondary/40 p-8 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        {/* Animated background gradient */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-text-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-text-accent/10 text-text-accent text-sm font-semibold mb-4"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-text-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-text-accent"></span>
              </span>
              Coming Soon
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Beautiful Features on the Way
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              We're crafting amazing new features to enhance your experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoonFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl border border-border bg-background-primary/50 p-6 backdrop-blur-sm transition-all hover:border-text-accent/50 hover:shadow-xl hover:shadow-text-accent/10"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-text-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-10 text-center"
          >
            <p className="text-sm text-text-secondary mb-4">
              Want to stay updated on new features?
            </p>
            <button className="rounded-xl bg-gradient-to-r from-text-accent to-blue-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-text-accent/20 transition-all hover:shadow-xl hover:shadow-text-accent/30 hover:scale-105">
              Notify Me When Ready
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-12">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 rounded-full border-4 border-border border-t-text-accent animate-spin"></div>
        </div>
      }>
        <SettingsContent />
      </Suspense>
    </main>
  );
}