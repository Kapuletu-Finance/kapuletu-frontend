"use client";

import { format } from "date-fns";
import { ArrowLeft, Calendar, Edit, ExternalLink, Eye, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAdminBlogsQuery } from "../services/queries";
import { AdminBlogCommentsClient } from "./AdminBlogCommentsClient";

interface Props {
  blogId: string;
}

export const AdminBlogDashboardClient: React.FC<Props> = ({ blogId }) => {
  const router = useRouter();
  const { data: blogs, isLoading } = useGetAdminBlogsQuery();

  const blog = blogs?.find((b) => b.id === blogId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full text-center">
        <h2 className="text-2xl font-bold">Blog post not found</h2>
        <Button variant="link" onClick={() => router.push("/admin/blogs")}>
          Back to Blogs
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/blogs")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 line-clamp-1">{blog.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant={blog.is_published ? "default" : "secondary"}>
                {blog.is_published ? "Published" : "Draft"}
              </Badge>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Created {format(new Date(blog.created_at), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" onClick={() => window.open(`/blogs/${blog.slug}`, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View Public Page
          </Button>
          <Button onClick={() => router.push(`/admin/blogs/${blog.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Content
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full mt-4">
        <TabsList className="mb-6 grid w-full sm:w-[400px] grid-cols-2">
          <TabsTrigger value="overview">Overview & Metrics</TabsTrigger>
          <TabsTrigger value="comments">Comments Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 outline-none space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{blog.views_count}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Likes</CardTitle>
                <ThumbsUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">{blog.likes_count}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Dislikes
                </CardTitle>
                <ThumbsDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-600">{blog.dislikes_count}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Article Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-semibold text-muted-foreground mb-1">Slug</dt>
                  <dd className="font-mono bg-muted px-2 py-1 rounded-md text-xs w-fit">
                    /{blog.slug}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted-foreground mb-1">Author</dt>
                  <dd>
                    {blog.author_name || "KapuLetu Team"}{" "}
                    {blog.author_role && `(${blog.author_role})`}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted-foreground mb-1">Category</dt>
                  <dd>{blog.category || "None"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted-foreground mb-1">Tags</dt>
                  <dd className="flex flex-wrap gap-1">
                    {blog.tags && blog.tags.length > 0
                      ? blog.tags.map((tag) => (
                          <Badge variant="outline" key={tag}>
                            #{tag}
                          </Badge>
                        ))
                      : "None"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="comments"
          className="mt-0 outline-none bg-card border rounded-xl shadow-sm"
        >
          <AdminBlogCommentsClient embeddedPostId={blog.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
