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
      <div className="container mx-auto px-4 max-w-3xl py-12 -mt-32 relative z-10">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary/80 hover:text-primary transition-colors mb-8 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Journal
        </Link>

        <div className="bg-background rounded-3xl p-6 sm:p-10 shadow-xl border mb-12 relative">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {post.category && (
              <Badge variant="secondary" className="px-3 py-1 text-xs">
                {post.category}
              </Badge>
            )}
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(new Date(post.created_at), "MMM d, yyyy")}
            </span>
            <span className="text-border">·</span>
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readTime} min read
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground leading-[1.15] tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between pb-8 border-b flex-wrap gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 font-medium">
                <User className="h-4 w-4" />
                {post.author_name || "KapuLetu Team"}
              </div>
              {post.author_role && (
                <>
                  <span className="text-border">·</span>
                  <span>{post.author_role}</span>
                </>
              )}
            </div>

            {/* Social Share */}
            <Button variant="outline" size="sm" onClick={handleShare} className="rounded-full">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>

          <div className="mt-8 prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary max-w-none prose-img:rounded-xl">
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
                      className="rounded-xl mx-auto w-full max-h-[500px] object-cover"
                    />
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags Section */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t flex flex-wrap gap-2 items-center">
              <span className="text-sm font-semibold mr-2">Tags:</span>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-muted/50">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Sticky Engagement Bar (Bottom on Mobile, Inflow on Desktop) */}
          <div className="mt-12 bg-muted/20 border rounded-full p-2 flex items-center justify-center gap-4 w-max mx-auto shadow-sm">
            <Button
              variant="ghost"
              className={`rounded-full transition-colors ${
                localInteractions.like || optimisticLike
                  ? "bg-green-100 text-green-700"
                  : "hover:bg-green-100 hover:text-green-700"
              }`}
              onClick={() => handleInteraction("like")}
              disabled={localInteractions.like || optimisticLike}
            >
              <ThumbsUp className="h-5 w-5 mr-2" />
              <span className="font-semibold">
                {post.likes_count + (optimisticLike && !localInteractions.like ? 1 : 0)}
              </span>
            </Button>
            <div className="w-px h-6 bg-border" />
            <Button
              variant="ghost"
              className={`rounded-full transition-colors ${
                localInteractions.dislike || optimisticDislike
                  ? "bg-red-100 text-red-700"
                  : "hover:bg-red-100 hover:text-red-700"
              }`}
              onClick={() => handleInteraction("dislike")}
              disabled={localInteractions.dislike || optimisticDislike}
            >
              <ThumbsDown className="h-5 w-5 mr-2" />
              <span className="font-semibold">
                {post.dislikes_count + (optimisticDislike && !localInteractions.dislike ? 1 : 0)}
              </span>
            </Button>
          </div>

          {/* Comments Section */}
          <BlogComments postId={post.id} />
        </div>
      </div>
    </article>
  );
};
