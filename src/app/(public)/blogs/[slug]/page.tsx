import type { Metadata } from "next";
import { BlogReaderClient } from "@/features/blogs/components/BlogReaderClient";
import { LandingFooter } from "@/features/landing-page/components/LandingFooter";
import { LandingHeader } from "@/features/landing-page/components/LandingHeader";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: BlogPostPageProps): Promise<Metadata> => {
  const { slug } = await params;

  // We can't guarantee the API is running at build time for static export,
  // so we return default dynamic metadata based on the slug.
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${title} | KapuLetu Journal`,
    description:
      "Read the latest insights and updates from the KapuLetu team on group finance management in Kenya.",
  };
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <BlogReaderClient slug={slug} />
      </main>
      <LandingFooter />
    </div>
  );
}
