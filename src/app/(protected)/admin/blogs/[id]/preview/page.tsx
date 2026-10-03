import React from "react";
import { AdminBlogPreviewClient } from "@/features/blogs/components/AdminBlogPreviewClient";

export default async function AdminBlogPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminBlogPreviewClient blogId={id} />;
}
