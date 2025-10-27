    "use client";
    
    import React, { useEffect, useState, useMemo } from "react";
    import { motion, AnimatePresence } from "framer-motion";
    import Link from "next/link";
    import { StrapiImage as StrapiImageComponent } from "./StrapiImage";
    
    // --- NEW INTERFACES (matching the plugin) ---
    
    interface CommentAuthor {
      id: number;
      name: string;
      avatar: {
        url: string;
      } | null;
    }
    
    interface Comment {
      id: number;
      content: string;
      createdAt: string;
      author: CommentAuthor | null;
      children: Comment[]; // For nested replies
      blocked: boolean;
      blockedThread: boolean;
      reports: any[];
    }
    
    interface CommentSectionProps {
      articleId: number; // The ID of the article (e.g., 23)
      slug: string; // The article slug (e.g., "latest-news-in-ai")
      isAuthenticated: boolean;
    }
    
    // This is the UID of your Article collection type from Strapi
    const ARTICLE_COLLECTION_UID = "api::article.article";
    
    // --- Comment Card Component (Recursive) ---
    function CommentCard({
      comment,
      onReplyClick,
      onReportClick,
    }: {
      comment: Comment;
      onReplyClick: (comment: Comment) => void;
      onReportClick: (commentId: number) => void;
    }) {
      // Render nothing if comment is blocked
      if (comment.blocked || comment.blockedThread) {
        return (
          <div className="rounded-lg border border-border bg-background-secondary p-4 text-sm italic text-text-secondary">
            This comment has been removed by a moderator.
          </div>
        );
      }
    
      const authorAvatarUrl = comment.author?.avatar?.url;
      const authorUsername = comment.author?.name || "Anonymous";
    
      return (
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-border">
              {authorAvatarUrl && (
                <StrapiImageComponent
                  src={authorAvatarUrl}
                  alt={authorUsername}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline space-x-2">
              <span className="font-semibold text-text-primary">
                {authorUsername}
              </span>
              <span className="text-xs text-text-secondary">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="prose prose-sm dark:prose-invert mt-1 max-w-none text-text-secondary">
              <p>{comment.content}</p>
            </div>
            <div className="mt-2 flex items-center space-x-4">
              <button
                onClick={() => onReplyClick(comment)}
                className="text-xs font-medium text-text-accent hover:underline"
              >
                Reply
              </button>
              <button
                onClick={() => onReportClick(comment.id)}
                className="text-xs font-medium text-text-secondary hover:text-red-500 hover:underline"
              >
                Report
              </button>
            </div>
    
            {/* --- Recursive Rendering for Nested Replies --- */}
            {comment.children && comment.children.length > 0 && (
              <div className="mt-4 space-y-4 border-l-2 border-border pl-4">
                {comment.children.map((reply) => (
                  <CommentCard
                    key={reply.id}
                    comment={reply}
                    onReplyClick={onReplyClick}
                    onReportClick={onReportClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // --- Main Comment Form ---
    function CommentForm({
      onSubmit,
      onCancel,
      isSubmitting,
      parentId = null,
    }: {
      onSubmit: (content: string, parentId: number | null) => void;
      onCancel?: () => void;
      isSubmitting: boolean;
      parentId?: number | null;
    }) {
      const [content, setContent] = useState("");
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSubmit(content, parentId);
        setContent("");
      };
    
      return (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-border bg-background-secondary p-4"
        >
          <p className="mb-2 text-sm font-medium text-text-primary">
            {parentId ? "Write a reply" : "Write a comment"}
          </p>
          <textarea
            rows={3}
            className="w-full rounded-md border-border bg-background-primary p-2 text-text-primary focus:border-text-accent focus:outline-none focus:ring-text-accent"
            placeholder="What are your thoughts?"
            onChange={(e) => setContent(e.target.value)}
            value={content}
            required
          />
          <div className="mt-3 flex items-center justify-end space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-border"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="rounded-md bg-text-accent px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      );
    }
    
    // --- Main Comment Section Component ---
    export function CommentSection({
      articleId,
      slug,
      isAuthenticated,
    }: CommentSectionProps) {
      const [comments, setComments] = useState<Comment[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState("");
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
      const [reportSuccess, setReportSuccess] = useState("");
    
      // This "relation" string is how the plugin finds comments for your article
      const articleRelation = `${ARTICLE_COLLECTION_UID}:${articleId}`;
    
      // Memoize the top-level comments for rendering
      const topLevelComments = useMemo(() => {
        // The plugin provides a flat list, but 'children' are populated
        // We only need to filter out the ones that are replies
        return comments.filter(
          (c) => !comments.some((p) => p.children.some((child) => child.id === c.id))
        );
      }, [comments]);
    
      // Fetch comments on component load
      useEffect(() => {
        async function fetchComments() {
          try {
            setLoading(true);
            setError("");
            const res = await fetch(`/api/comments/${articleRelation}`);
    
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || "Failed to fetch comments.");
            }
    
            const commentData = await res.json();
            setComments(commentData.data || []);
          } catch (err: any) {
            console.error("[CommentSection] Error fetching comments:", err);
            setError("Failed to load comments.");
          } finally {
            setLoading(false);
          }
        }
        fetchComments();
      }, [articleRelation]);
    
      // Generic function to handle both new comments and replies
      const handleSubmitComment = async (content: string, parentId: number | null) => {
        setIsSubmitting(true);
        setError("");
    
        const isReply = parentId !== null;
        const url = isReply ? "/api/comments/reply" : "/api/comments/create";
    
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content,
              relation: articleRelation,
              parentId: parentId, // This is null for new comments, or an ID for replies
            }),
          });
    
          const newCommentData = await response.json();
    
          if (!response.ok) {
            throw new Error(newCommentData.message || "Failed to post comment.");
          }
    
          const newComment: Comment = newCommentData.data;
          
          // Add the new comment to the state immediately
          if (isReply) {
            setComments((prevComments) =>
              prevComments.map((c) =>
                c.id === parentId ? { ...c, children: [...c.children, newComment] } : c
              )
            );
            setReplyingTo(null); // Close the reply form
          } else {
            setComments([newComment, ...comments]);
          }
    
        } catch (err: any) {
          console.error("[CommentSection] Error posting comment:", err);
          setError(err.message || "Failed to post comment.");
        } finally {
          setIsSubmitting(false);
        }
      };
    
      // Handle report click
      const handleReportClick = async (commentId: number) => {
        // Use a simple prompt. You can replace this with a modal.
        const reason = prompt("Please provide a reason for reporting this comment:");
        if (!reason || !reason.trim()) {
          return;
        }
    
        try {
          setError(""); // Clear old errors
          setReportSuccess(""); // Clear old success messages
    
          const response = await fetch("/api/comments/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ commentId, reason }),
          });
    
          const data = await response.json();
          if (!response.ok) throw new Error(data.message);
    
          setReportSuccess("Comment reported. A moderator will review it.");
          setTimeout(() => setReportSuccess(""), 3000); // Clear message after 3s
        } catch (err: any) {
          console.error("[CommentSection] Error reporting comment:", err);
          setError(err.message || "Failed to report comment.");
        }
      };
    
      return (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-6 text-2xl font-bold text-text-primary">
            Comments ({comments.length})
          </h2>
    
          {/* --- Main Comment Form --- */}
          {isAuthenticated ? (
            <AnimatePresence mode="wait">
              {replyingTo ? (
                <motion.div
                  key="reply-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <CommentForm
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmitComment}
                    parentId={replyingTo.id}
                    onCancel={() => setReplyingTo(null)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="main-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <CommentForm
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmitComment}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="mb-6 rounded-lg border border-border bg-background-secondary p-6 text-center">
              <p className="text-text-secondary">
                You must be logged in to post a comment.
              </p>
              <Link
                href={`/login?redirect=/articles/${encodeURIComponent(slug)}`}
                className="mt-4 inline-block rounded-md bg-text-accent px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-opacity-90"
              >
                Log In or Sign Up
              </Link>
            </div>
          )}
    
          {/* --- Global Error/Success Messages --- */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-center text-sm text-red-500"
              >
                {error}
              </motion.p>
            )}
            {reportSuccess && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-center text-sm text-green-500"
              >
                {reportSuccess}
              </motion.p>
            )}
          </AnimatePresence>
    
          {/* --- Comment List --- */}
          <div className="mt-8 space-y-6">
            {loading && <p className="text-text-secondary">Loading comments...</p>}
    
            {!loading && !error && comments.length === 0 && (
              <p className="text-text-secondary">Be the first to leave a comment.</p>
            )}
    
            <AnimatePresence>
              {!loading &&
                !error &&
                topLevelComments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CommentCard
                      comment={comment}
                      onReplyClick={setReplyingTo}
                      onReportClick={handleReportClick}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </section>
      );
    }
    

