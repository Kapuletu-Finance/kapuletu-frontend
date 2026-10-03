import type { Metadata } from "next";
import { AdminBlogsPageClient } from "@/features/blogs/components/AdminBlogsPageClient";

export const metadata: Metadata = {
  title: "Blog Management | KapuLetu Admin",
};

export default function AdminBlogsPage() {
  return <AdminBlogsPageClient />;
}
