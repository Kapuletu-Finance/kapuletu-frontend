"use client";

import { format } from "date-fns";
import { Edit2, Eye, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeleteAdminBlogMutation } from "../services/mutations";
import { useGetAdminBlogsQuery } from "../services/queries";

export const AdminBlogsPageClient: React.FC = () => {
  const router = useRouter();
  const { data: blogs, isLoading } = useGetAdminBlogsQuery();
  const deleteMutation = useDeleteAdminBlogMutation();
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const filteredBlogs = blogs?.filter((blog) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "published") return blog.is_published;
    if (statusFilter === "draft") return !blog.is_published;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Blog post deleted successfully");
      } catch (_error) {
        toast.error("Failed to delete blog post");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and publish content for the KapuLetu public blog.
          </p>
        </div>
        <Button onClick={() => router.push("/admin/blogs/new")} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create New Post
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>All Blog Posts</CardTitle>
            <CardDescription>View and manage all your blog posts.</CardDescription>
          </div>
          <Tabs
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as any)}
            className="w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !blogs || blogs.length === 0 ? (
            <div className="text-center py-12 border rounded-lg border-dashed">
              <p className="text-muted-foreground mb-4">No blog posts found.</p>
              <Button onClick={() => router.push("/admin/blogs/new")} variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Write your first post
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(filteredBlogs) ? (
                    filteredBlogs.length > 0 ? (
                      filteredBlogs.map((blog) => (
                        <TableRow key={blog.id}>
                          <TableCell className="font-medium">
                            {blog.title}
                            <div className="text-xs text-muted-foreground mt-1">/{blog.slug}</div>
                          </TableCell>
                          <TableCell>{blog.category || "Uncategorized"}</TableCell>
                          <TableCell>
                            {blog.is_published ? (
                              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Draft</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(blog.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/admin/blogs/${blog.id}/preview`)}
                                title="View post preview"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/admin/blogs/${blog.id}/edit`)}
                                title="Edit post"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(blog.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                title="Delete post"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No {statusFilter === "all" ? "" : statusFilter} blog posts found.
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Could not load blogs or API is currently unavailable.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
