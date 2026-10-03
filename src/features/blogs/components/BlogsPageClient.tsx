"use client";

import { format } from "date-fns";
import { ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublicBlogsQuery } from "../services/queries";

export const BlogsPageClient: React.FC = () => {
  const { data: blogs, isLoading } = useGetPublicBlogsQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl space-y-12">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
        <h2 className="text-3xl font-bold mb-4">No articles yet</h2>
        <p className="text-muted-foreground text-lg">
          We are currently working on some exciting content. Check back soon!
        </p>
      </div>
    );
  }

  const [featuredPost, ...otherPosts] = blogs;

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl space-y-16">
      {/* Featured Post */}
      <section>
        <div className="mb-8">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Featured Article
          </span>
          <div className="h-1 w-12 bg-primary mt-2" />
        </div>

        <Link href={`/blogs/${featuredPost.slug}`} className="group block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-card rounded-3xl border shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="aspect-[4/3] lg:aspect-auto lg:h-full w-full relative overflow-hidden bg-muted">
              {featuredPost.cover_image_url ? (
                // biome-ignore lint/a11y/useAltText: this is decorative
                <img
                  src={featuredPost.cover_image_url}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary/40 font-bold text-4xl">KapuLetu</span>
                </div>
              )}
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center">
              {featuredPost.category && (
                <Badge variant="outline" className="w-fit mb-4 text-xs font-semibold">
                  {featuredPost.category}
                </Badge>
              )}
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mb-6">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {featuredPost.author_name || "KapuLetu Team"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(featuredPost.created_at), "MMM d, yyyy")}
                </div>
              </div>

              <div className="flex items-center text-primary font-semibold group-hover:underline">
                Read Article <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Grid of Other Posts */}
      {otherPosts.length > 0 && (
        <section>
          <div className="mb-8">
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Latest Articles
            </span>
            <div className="h-1 w-12 bg-muted-foreground mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link
                href={`/blogs/${post.slug}`}
                key={post.id}
                className="group flex flex-col bg-card rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all h-full"
              >
                <div className="aspect-[16/9] w-full relative overflow-hidden bg-muted shrink-0">
                  {post.cover_image_url ? (
                    // biome-ignore lint/a11y/useAltText: this is decorative
                    <img
                      src={post.cover_image_url}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary/40 font-bold text-xl">KapuLetu</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  {post.category && (
                    <Badge variant="secondary" className="w-fit mb-3 text-xs">
                      {post.category}
                    </Badge>
                  )}
                  <h3 className="text-xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t">
                    <span className="font-medium">{post.author_name || "KapuLetu"}</span>
                    <span>{format(new Date(post.created_at), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
