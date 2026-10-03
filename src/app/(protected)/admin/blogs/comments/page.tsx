import type { Metadata } from "next";
import { AdminBlogCommentsClient } from "@/features/blogs/components/AdminBlogCommentsClient";

export const metadata: Metadata = {
  title: "Moderate Comments | KapuLetu Admin",
};

export default function AdminBlogCommentsPage() {
  return <AdminBlogCommentsClient />;
}
