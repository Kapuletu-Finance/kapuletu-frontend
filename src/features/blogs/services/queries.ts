import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { BlogPost } from "./types";

const getPublicBlogs = async (): Promise<BlogPost[]> => {
  const { data } = await apiClient.get("/blogs/public");
  return data;
};

const getPublicBlogBySlug = async (slug: string): Promise<BlogPost> => {
  const { data } = await apiClient.get(`/blogs/public/${slug}`);
  return data;
};

const getAdminBlogs = async (): Promise<BlogPost[]> => {
  const { data } = await apiClient.get("/blogs/admin");
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

export const useGetAdminBlogsQuery = () => {
  return useQuery({
    queryKey: ["admin_blogs"],
    queryFn: getAdminBlogs,
  });
};
