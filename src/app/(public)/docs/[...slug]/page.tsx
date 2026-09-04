import Link from "next/link";
import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import IconLibrary from "@/features/shared/components/IconLibrary";

export default async function UnderConstructionPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;

  // Determine parent path to provide a useful back button
  const currentPath = resolvedParams.slug.join("/");
  const parentPath =
    resolvedParams.slug.length > 1
      ? "/docs/" + resolvedParams.slug.slice(0, -1).join("/")
      : "/docs";

  // Format the title nicely
  const topic = resolvedParams.slug[resolvedParams.slug.length - 1]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <DocsArticle
      title={topic}
      description="This guide is currently being written by the KapuLetu team."
    >
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <IconLibrary name="info" className="w-8 h-8 text-muted-foreground" />
        </div>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 justify-center">
          <IconLibrary name="triangle-alert" className="w-6 h-6 text-yellow-500" /> Content Coming
          Soon
        </h2>
        <p className="text-muted-foreground max-w-md mb-8">
          We're actively working on the detailed documentation for <strong>{topic}</strong>. Check
          back soon for step-by-step guides and best practices.
        </p>

        <Link
          href={parentPath}
          className="inline-flex items-center justify-center px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
        >
          <IconLibrary name="arrow-left" className="w-4 h-4 mr-2" />
          Go back to overview
        </Link>
      </div>

      <DocsCallout type="info" title="Need help now?">
        If you need immediate assistance with this topic, please{" "}
        <Link href="/contact" className="text-primary hover:underline">
          contact support
        </Link>{" "}
        or ask your question in our WhatsApp community group.
      </DocsCallout>
    </DocsArticle>
  );
}
