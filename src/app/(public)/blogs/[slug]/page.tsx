import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { BlogContent } from "@/features/landing-page/components/BlogContent";
import { LandingFooter } from "@/features/landing-page/components/LandingFooter";
import { LandingHeader } from "@/features/landing-page/components/LandingHeader";
import { blogPosts, getPostBySlug } from "@/features/landing-page/data/posts";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = () => blogPosts.map((post) => ({ slug: post.slug }));

export const generateMetadata = async ({ params }: BlogPostPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found | KapuLetu" };
  return {
    description: post.excerpt,
    title: `${post.title} | KapuLetu`,
  };
};

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <article className="w-full py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <IconLibrary name="arrow-left" className="h-4 w-4" />
              Back to Blog
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <IconLibrary name="calendar" className="h-3 w-3" />
                {new Date(post.date).toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
              <IconLibrary name="member" className="h-4 w-4" />
              <span>{post.author}</span>
              <span className="text-border">·</span>
              <span>{post.authorRole}</span>
            </div>

            <BlogContent content={post.content} paragraphs={paragraphs} />
          </div>
        </article>
      </main>
      <LandingFooter />
    </div>
  );
};

export default BlogPostPage;
