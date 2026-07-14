import type { Metadata } from "next";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { blogPosts } from "@/features/blog/data/posts";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { LandingHeader } from "@/features/landing/components/LandingHeader";

export const metadata: Metadata = {
  description:
    "News, guides, and insights from the KapuLetu team about group finance management in Kenya.",
  title: "Blog | KapuLetu",
};

const BlogsPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-8">
              <span className="text-sm font-bold uppercase tracking-wider text-primary">
                Blog & News
              </span>
              <div className="h-1 w-12 bg-primary mt-2" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
              Updates from <span className="text-primary">KapuLetu</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-12">
              News, guides, and insights about group finance management, treasury best practices,
              and what we are building at KapuLetu.
            </p>
            <div className="grid gap-6">
              {blogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
};

export default BlogsPage;
