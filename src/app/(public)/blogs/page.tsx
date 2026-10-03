import type { Metadata } from "next";
import { BlogsPageClient } from "@/features/blogs/components/BlogsPageClient";
import { LandingFooter } from "@/features/landing-page/components/LandingFooter";
import { LandingHeader } from "@/features/landing-page/components/LandingHeader";

export const metadata: Metadata = {
  description:
    "News, guides, and insights from the KapuLetu team about group finance management in Kenya.",
  title: "Blog | KapuLetu",
};

export default function BlogsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <section className="w-full bg-gradient-to-b from-muted/50 to-background border-b pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-foreground">
              KapuLetu <span className="text-primary">Journal</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, updates, and stories about building the financial operating system for
              community groups in Kenya.
            </p>
          </div>
        </section>
        <BlogsPageClient />
      </main>
      <LandingFooter />
    </div>
  );
}
