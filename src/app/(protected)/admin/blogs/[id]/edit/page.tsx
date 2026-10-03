"use client";

import { useParams } from "next/navigation";
import { AdminBlogEditorClient } from "@/features/blogs/components/AdminBlogEditorClient";

export default function EditAdminBlogPage() {
  const params = useParams();
  const id = params.id as string;
  return <AdminBlogEditorClient blogId={id} />;
}
