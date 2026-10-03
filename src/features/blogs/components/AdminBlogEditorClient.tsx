"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LayoutTemplate, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAdminBlogMutation, useUpdateAdminBlogMutation } from "../services/mutations";
import { useGetAdminBlogsQuery } from "../services/queries";
import type { BlogPostUpdate } from "../services/types";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  slug: z
    .string()
    .min(3)
    .max(255)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  cover_image_url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  category: z.string().max(100).optional().nullable(),
  author_name: z.string().max(255).optional().nullable(),
  author_role: z.string().max(255).optional().nullable(),
  is_published: z.boolean().default(false),
});

interface Props {
  blogId?: string; // If provided, we are in edit mode
}

export const AdminBlogEditorClient: React.FC<Props> = ({ blogId }) => {
  const router = useRouter();
  const isEditMode = !!blogId;

  const { data: blogs } = useGetAdminBlogsQuery();
  const createMutation = useCreateAdminBlogMutation();
  const updateMutation = useUpdateAdminBlogMutation();

  const currentBlog = isEditMode ? blogs?.find((b) => b.id === blogId) : null;

  const form = useForm<z.infer<typeof formSchema>>({
    // biome-ignore lint/suspicious/noExplicitAny: Zod v4 resolver typing workaround (same as PlanEditor, BroadcastForm)
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image_url: "",
      category: "",
      author_name: "KapuLetu Team",
      author_role: "Editorial",
      is_published: false,
    },
  });

  useEffect(() => {
    if (currentBlog) {
      form.reset({
        title: currentBlog.title,
        slug: currentBlog.slug,
        excerpt: currentBlog.excerpt || "",
        content: currentBlog.content,
        cover_image_url: currentBlog.cover_image_url || "",
        category: currentBlog.category || "",
        author_name: currentBlog.author_name || "",
        author_role: currentBlog.author_role || "",
        is_published: currentBlog.is_published,
      });
    }
  }, [currentBlog, form]);

  const generateSlug = () => {
    const title = form.getValues("title");
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditMode && blogId) {
        await updateMutation.mutateAsync({
          id: blogId,
          data: values as BlogPostUpdate,
        });
        toast.success("Blog post updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Blog post created successfully");
        router.push("/admin/blogs");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to save blog post");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Write and publish content for the KapuLetu community.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter an engaging title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>URL Slug</FormLabel>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={generateSlug}
                          >
                            <LayoutTemplate className="h-3 w-3 mr-1" />
                            Auto-generate
                          </Button>
                        </div>
                        <FormControl>
                          <Input placeholder="my-awesome-post" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be the URL: kapuletu.co.ke/blogs/{field.value || "..."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief summary for the blog cards..."
                            className="resize-none h-20"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Content (Markdown Supported)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your article here. You can use markdown for formatting..."
                            className="min-h-[400px] font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Details Area */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="is_published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Publish Status</FormLabel>
                          <FormDescription>Make this post visible to the public.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cover_image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                        {field.value && (
                          <div className="mt-4 rounded-md overflow-hidden border aspect-video">
                            {/* biome-ignore lint/a11y/useAltText: this is a preview */}
                            <img src={field.value} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Product, Engineering, Guide"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="author_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="KapuLetu Team"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="author_role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author Role</FormLabel>
                          <FormControl>
                            <Input placeholder="Editorial" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditMode ? "Save Changes" : "Create Post"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
