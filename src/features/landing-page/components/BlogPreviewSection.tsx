"use client";

import { format } from "date-fns";
import { ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublicBlogsQuery } from "@/features/blogs/services/queries";

const BlogCardSkeleton = () => (
  <div className="flex flex-col bg-card rounded-2xl border overflow-hidden shadow-sm">
    <Skeleton className="aspect-[16/9] w-full" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-24 mt-4" />
    </div>
  </div>
);

export const BlogPreviewSection: React.FC = () => {
  const { data: blogs, isLoading } = useGetPublicBlogsQuery();

  // Only show up to 3 posts
  const previewPosts = blogs?.slice(0, 3);

  // Don't render section at all if no posts and not loading
  if (!isLoading && (!previewPosts || previewPosts.length === 0)) {
    return null;
  }

  return (
    <section className="w-full py-24 bg-muted/30 border-t">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              KapuLetu Journal
            </span>
            <div className="h-1 w-12 bg-primary mt-2 mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Insights &amp; Updates
            </h2>
            <p className="text-muted-foreground mt-2 text-lg max-w-xl">
              Tips, guides, and news from our team to help you manage group finances better.
            </p>
          </div>
          <Link href="/blogs">
            <Button variant="outline" className="gap-2 shrink-0">
              View all articles
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? [1, 2, 3].map((i) => <BlogCardSkeleton key={i} />)
            : previewPosts?.map((post) => (
                <Link
                  href={`/blogs/${post.slug}`}
                  key={post.id}
                  className="group flex flex-col bg-card rounded-2xl border shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Cover Image */}
                  <div className="aspect-[16/9] w-full relative overflow-hidden bg-muted shrink-0">
                    {post.cover_image_url ? (
                      // biome-ignore lint/a11y/useAltText: decorative blog thumbnail
                      <img
                        src={post.cover_image_url}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <span className="text-primary/30 font-black text-2xl tracking-tight">
                          KapuLetu
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {post.category && (
                      <Badge variant="secondary" className="w-fit mb-3 text-xs font-semibold">
                        {post.category}
                      </Badge>
                    )}

                    <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t font-medium">
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {post.author_name || "KapuLetu"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(post.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};
