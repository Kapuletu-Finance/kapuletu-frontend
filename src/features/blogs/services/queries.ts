import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { BlogComment, BlogPost } from "./types";

const getPublicBlogs = async (): Promise<BlogPost[]> => {
  const { data } = await apiClient.get("/blogs/public");
  return data;
};

const getPublicBlogBySlug = async (slug: string): Promise<BlogPost> => {
  const { data } = await apiClient.get(`/blogs/public/${slug}`);
  return data;
};

const getPublicBlogComments = async (postId: string): Promise<BlogComment[]> => {
  const { data } = await apiClient.get(`/blogs/public/${postId}/comments`);
  return data;
};

const getAdminBlogs = async (): Promise<BlogPost[]> => {
  const { data } = await apiClient.get("/blogs/admin");
  return data;
};

const getAdminComments = async (statusFilter?: string): Promise<BlogComment[]> => {
  const url = statusFilter
    ? `/blogs/admin/comments?status_filter=${statusFilter}`
    : "/blogs/admin/comments";
  const { data } = await apiClient.get(url);
  return data;
};

// Hooks
export const useGetPublicBlogsQuery = () => {
  return useQuery({
    queryKey: ["public_blogs"],
    queryFn: getPublicBlogs,
  });
};

export const useGetPublicBlogBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: ["public_blog", slug],
    queryFn: () => getPublicBlogBySlug(slug),
    enabled: !!slug,
  });
};

export const useGetPublicBlogCommentsQuery = (postId: string) => {
  return useQuery({
    queryKey: ["public_blog_comments", postId],
    queryFn: () => getPublicBlogComments(postId),
    enabled: !!postId,
  });
};

export const useGetAdminBlogsQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["admin_blogs"],
    queryFn: getAdminBlogs,
    enabled: options?.enabled ?? true,
  });
};

export const useGetAdminCommentsQuery = (
  statusFilter?: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["admin_blog_comments", statusFilter],
    queryFn: () => getAdminComments(statusFilter),
    enabled: options?.enabled,
  });
};
