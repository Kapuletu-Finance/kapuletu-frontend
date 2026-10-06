import type { Metadata } from "next";
import { AdminBlogDashboardClient } from "@/features/blogs/components/AdminBlogDashboardClient";

export const metadata: Metadata = {
  description: "Manage specific blog post details, metrics, and comments.",
  title: "Blog Details | Admin",
};

interface Props {
  params: {
    id: string;
  };
}

export default async function AdminBlogDetailsPage(props: Props) {
  const params = await props.params;
  return <AdminBlogDashboardClient blogId={params.id} />;
}
