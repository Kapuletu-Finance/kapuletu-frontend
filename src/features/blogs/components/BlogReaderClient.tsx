"use client";

import { format } from "date-fns";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import type React from "react";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublicBlogBySlugQuery } from "../services/queries";

interface Props {
  slug: string;
}

export const BlogReaderClient: React.FC<Props> = ({ slug }) => {
  const { data: post, isLoading, error } = useGetPublicBlogBySlugQuery(slug);

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

  return (
    <article className="w-full">
      {/* Hero Image Section */}
      {post.cover_image_url && (
        <div className="w-full h-[40vh] md:h-[60vh] relative overflow-hidden bg-muted">
          {/* biome-ignore lint/a11y/useAltText: this is decorative */}
          <img
            src={
              post.cover_image_url.startsWith("http")
                ? post.cover_image_url
                : `/api${post.cover_image_url}`
            }
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

        <div className="bg-background rounded-3xl p-6 sm:p-10 shadow-xl border mb-12">
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
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground leading-[1.15] tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground pb-8 border-b">
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
        </div>
      </div>
    </article>
  );
};
