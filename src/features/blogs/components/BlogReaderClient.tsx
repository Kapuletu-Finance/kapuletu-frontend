"use client";

import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, Share2, ThumbsDown, ThumbsUp, User } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInteractWithBlogMutation } from "../services/mutations";
import { useGetPublicBlogBySlugQuery } from "../services/queries";
import { BlogComments } from "./BlogComments";

interface Props {
  slug: string;
}

export const BlogReaderClient: React.FC<Props> = ({ slug }) => {
  const { data: post, isLoading, error } = useGetPublicBlogBySlugQuery(slug);
  const interactMutation = useInteractWithBlogMutation();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [localInteractions, setLocalInteractions] = useState<{ like?: boolean; dislike?: boolean }>(
    {},
  );
  const [optimisticLike, setOptimisticLike] = useState(false);
  const [optimisticDislike, setOptimisticDislike] = useState(false);

  useEffect(() => {
    if (post) {
      const stored = localStorage.getItem(`kapuletu_blog_interaction_${post.id}`);
      if (stored) {
        setLocalInteractions(JSON.parse(stored));
      }
    }
  }, [post]);

  // Trigger view interaction on mount
  useEffect(() => {
    if (post && !hasInteracted) {
      const timer = setTimeout(() => {
        interactMutation.mutate({ postId: post.id, action: "view" });
        setHasInteracted(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [post, hasInteracted, interactMutation]);

  const handleInteraction = (action: "like" | "dislike") => {
    if (!post) return;

    // Prevent multiple likes from the same browser
    if (localInteractions[action] || optimisticLike || optimisticDislike) {
      toast.info(`You have already ${action}d this post.`);
      return;
    }

    // Save to local storage
    const newInteractions = { ...localInteractions, [action]: true };
    setLocalInteractions(newInteractions);
    localStorage.setItem(`kapuletu_blog_interaction_${post.id}`, JSON.stringify(newInteractions));

    // Optimistic UI update
    if (action === "like") setOptimisticLike(true);
    if (action === "dislike") setOptimisticDislike(true);

    // Fire mutation to backend
    interactMutation.mutate({ postId: post.id, action });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 max-w-3xl py-12 space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full rounded-xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <p className="text-muted-foreground mb-8">
          The article you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/blogs"
          className="text-primary hover:underline font-medium flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </Link>
      </div>
    );
  }

  // Calculate reading time
  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="w-full relative">
      {/* Hero Image Section */}
      {post.cover_image_url && (
        <div className="w-full h-[40vh] md:h-[60vh] relative overflow-hidden bg-muted">
          <img
            src={
              post.cover_image_url.startsWith("http")
                ? post.cover_image_url
                : `/api${post.cover_image_url}`
            }
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}

      {/* Main Content Area */}
      <div className="container mx-auto px-4 max-w-6xl py-12 -mt-32 relative z-10">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 bg-background/60 backdrop-blur-md px-4 py-2 rounded-full border shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Journal
        </Link>

        <div className="bg-background rounded-2xl p-6 md:p-12 shadow-sm border border-border/50 mb-12">
          {/* Header Metadata */}
          <div className="flex flex-col gap-6 mb-10">
            {post.category && (
              <div>
                <Badge
                  variant="secondary"
                  className="px-3 py-1 font-medium bg-secondary/50 hover:bg-secondary/80 transition-colors"
                >
                  {post.category}
                </Badge>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-muted-foreground border-b pb-8">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                  {(post.author_name || "K").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">
                    {post.author_name || "KapuLetu Team"}
                  </span>
                  {post.author_role && <span className="text-xs">{post.author_role}</span>}
                </div>
              </div>

              <div className="h-8 w-px bg-border hidden sm:block" />

              <div className="flex items-center gap-4 flex-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 opacity-70" />
                  {format(new Date(post.created_at), "MMMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 opacity-70" />
                  {readTime} min read
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="rounded-full shrink-0 hover:bg-muted"
              >
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg md:prose-xl dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary max-w-none prose-img:rounded-2xl prose-img:border prose-img:shadow-sm">
            <ReactMarkdown
              components={{
                img: ({ node, ...props }) => {
                  const rawSrc = typeof props.src === "string" ? props.src : "";
                  const src = rawSrc.startsWith("http") ? rawSrc : `/api${rawSrc}`;
                  return (
                    <img
                      {...props}
                      src={src}
                      alt={props.alt || "Blog image"}
                      className="rounded-2xl mx-auto w-full max-h-[600px] object-cover my-12"
                    />
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Footer Metadata & Engagement */}
          <div className="mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2 items-center">
              {post.tags &&
                post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-sm px-3 py-1 bg-muted/30 text-muted-foreground font-medium"
                  >
                    #{tag}
                  </Badge>
                ))}
            </div>

            <div className="flex items-center bg-muted/30 border rounded-full p-1 shadow-sm shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-4 transition-colors ${
                  localInteractions.like || optimisticLike
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleInteraction("like")}
                disabled={localInteractions.like || optimisticLike}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                <span className="font-semibold">
                  {post.likes_count + (optimisticLike && !localInteractions.like ? 1 : 0)}
                </span>
              </Button>
              <div className="w-px h-4 bg-border mx-1" />
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full px-4 transition-colors ${
                  localInteractions.dislike || optimisticDislike
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleInteraction("dislike")}
                disabled={localInteractions.dislike || optimisticDislike}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                <span className="font-semibold">
                  {post.dislikes_count + (optimisticDislike && !localInteractions.dislike ? 1 : 0)}
                </span>
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-12 border-t">
            <BlogComments postId={post.id} />
          </div>
        </div>
      </div>
    </article>
  );
};
