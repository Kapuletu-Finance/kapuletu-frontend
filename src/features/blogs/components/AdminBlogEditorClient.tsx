"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LayoutTemplate, MessageSquare, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/features/shared/components/ImageUploader";
import {
  useCreateAdminBlogMutation,
  useUpdateAdminBlogMutation,
  useUploadImageMutation,
} from "../services/mutations";
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
  cover_image_url: z.string().optional().nullable().or(z.literal("")),
  category: z
    .enum([
      "News",
      "Events",
      "Educational",
      "Updates",
      "Product",
      "Guide",
      "Team",
      "Community",
      "Press Release",
      "Announcement",
    ])
    .optional()
    .nullable(),
  author_name: z.string().max(255).optional().nullable(),
  author_role: z.string().max(255).optional().nullable(),
  tags: z.array(z.string()).optional(),
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
  const uploadImageMutation = useUploadImageMutation();

  const currentBlog = isEditMode ? blogs?.find((b) => b.id === blogId) : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image_url: "",
      category: null,
      author_name: "KapuLetu Team",
      author_role: "Editorial",
      tags: [],
      is_published: false,
    },
  });

  const [showPreview, setShowPreview] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  useEffect(() => {
    if (currentBlog) {
      form.reset({
        title: currentBlog.title,
        slug: currentBlog.slug,
        excerpt: currentBlog.excerpt || "",
        content: currentBlog.content,
        cover_image_url: currentBlog.cover_image_url || "",
        category: (currentBlog.category as z.infer<typeof formSchema>["category"]) || null,
        author_name: currentBlog.author_name || "",
        author_role: currentBlog.author_role || "",
        tags: currentBlog.tags || [],
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

  // Autosave watch logic
  useEffect(() => {
    if (!isEditMode || !blogId) return;
    const subscription = form.watch((value, { name, type }) => {
      // Trigger autosave when field values change
      if (type === "change") {
        setAutosaveStatus("saving");
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isEditMode, blogId]);

  // Autosave execution logic
  useEffect(() => {
    if (autosaveStatus !== "saving" || !isEditMode || !blogId) return;

    const handler = setTimeout(async () => {
      try {
        const currentValues = form.getValues();
        await updateMutation.mutateAsync({
          id: blogId,
          data: currentValues as BlogPostUpdate,
        });
        setAutosaveStatus("saved");
        setLastSavedTime(new Date());
      } catch (error) {
        setAutosaveStatus("idle");
      }
    }, 3000);

    return () => clearTimeout(handler);
  }, [autosaveStatus, form, blogId, isEditMode, updateMutation]);

  const handleSaveDraft = async () => {
    form.setValue("is_published", false);
    await form.handleSubmit(onSubmit)();
  };

  const handlePublish = async () => {
    form.setValue("is_published", true);
    await form.handleSubmit(onSubmit)();
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

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {currentBlog && (
            <Badge variant={currentBlog.is_published ? "default" : "secondary"}>
              {currentBlog.is_published ? "Published" : "Draft"}
            </Badge>
          )}
          {autosaveStatus === "saving" && (
            <span className="text-xs text-muted-foreground">Autosaving...</span>
          )}
          {autosaveStatus === "saved" && lastSavedTime && (
            <span className="text-xs text-muted-foreground">
              Saved {lastSavedTime.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border bg-muted/50 p-1 rounded-md">
            <Button
              type="button"
              variant={!showPreview ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowPreview(false)}
              className="h-8"
            >
              Edit
            </Button>
            <Button
              type="button"
              variant={showPreview ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowPreview(true)}
              className="h-8"
            >
              Preview
            </Button>
          </div>
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
                        <div className="flex items-center justify-between">
                          <FormLabel>Main Content (Markdown Supported)</FormLabel>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Insert Image:</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="text-xs w-48"
                              disabled={uploadImageMutation.isPending}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                uploadImageMutation.mutate(file, {
                                  onSuccess: (data) => {
                                    const markdownImage = `\n![Image](${data.url})\n`;
                                    field.onChange((field.value || "") + markdownImage);
                                    e.target.value = "";
                                  },
                                });
                              }}
                            />
                          </div>
                        </div>
                        {showPreview ? (
                          <div className="min-h-[400px] prose prose-sm sm:prose lg:prose-lg max-w-none border rounded-md p-4 bg-muted/20">
                            <ReactMarkdown
                              components={{
                                img: ({ node, ...props }) => {
                                  const rawSrc = typeof props.src === "string" ? props.src : "";
                                  const src = rawSrc.startsWith("http") ? rawSrc : `/api${rawSrc}`;
                                  return (
                                    <img
                                      {...props}
                                      src={src}
                                      alt={props.alt || "Preview image"}
                                      className="rounded-xl mx-auto w-full max-h-[500px] object-cover"
                                    />
                                  );
                                },
                              }}
                            >
                              {field.value || "Nothing to preview yet..."}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <FormControl>
                            <Textarea
                              placeholder="Write your article here. You can use markdown for formatting..."
                              className="min-h-[400px] font-mono text-sm"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                        )}
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
                        <FormLabel>Cover Image</FormLabel>
                        <FormControl>
                          <ImageUploader
                            currentImageUrl={field.value}
                            onFileSelect={(file) => {
                              uploadImageMutation.mutate(file, {
                                onSuccess: (data) => {
                                  field.onChange(data.url);
                                },
                              });
                            }}
                            onClear={() => field.onChange("")}
                            isLoading={uploadImageMutation.isPending}
                            shape="square"
                            className="aspect-video w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="News">📰 News</SelectItem>
                            <SelectItem value="Events">📅 Events</SelectItem>
                            <SelectItem value="Educational">🎓 Educational</SelectItem>
                            <SelectItem value="Updates">🔔 Updates</SelectItem>
                            <SelectItem value="Product">🚀 Product</SelectItem>
                            <SelectItem value="Guide">📖 Guide</SelectItem>
                            <SelectItem value="Team">👥 Team</SelectItem>
                            <SelectItem value="Community">🌍 Community</SelectItem>
                            <SelectItem value="Press Release">📢 Press Release</SelectItem>
                            <SelectItem value="Announcement">📣 Announcement</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (comma separated)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="finance, chama, savings"
                            value={field.value?.join(", ") || ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  .split(",")
                                  .map((t) => t.trim())
                                  .filter(Boolean),
                              )
                            }
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

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleSaveDraft}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  onClick={handlePublish}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Publish"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
