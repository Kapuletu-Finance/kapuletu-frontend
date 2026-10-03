import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { BlogPost, BlogPostCreate, BlogPostUpdate } from "./types";

const createAdminBlog = async (data: BlogPostCreate): Promise<BlogPost> => {
  const response = await apiClient.post("/blogs/admin", data);
  return response.data;
};

const updateAdminBlog = async ({
  id,
  data,
}: {
  id: string;
  data: BlogPostUpdate;
}): Promise<BlogPost> => {
  const response = await apiClient.put(`/blogs/admin/${id}`, data);
  return response.data;
};

const deleteAdminBlog = async (id: string): Promise<void> => {
  await apiClient.delete(`/blogs/admin/${id}`);
};

// Hooks
export const useCreateAdminBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_blogs"] });
      queryClient.invalidateQueries({ queryKey: ["public_blogs"] });
    },
  });
};

export const useUpdateAdminBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminBlog,
    onSuccess: (_, _variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin_blogs"] });
      queryClient.invalidateQueries({ queryKey: ["public_blogs"] });
      queryClient.invalidateQueries({ queryKey: ["public_blog"] });
    },
  });
};

export const useDeleteAdminBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_blogs"] });
      queryClient.invalidateQueries({ queryKey: ["public_blogs"] });
    },
  });
};

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: async (file: File): Promise<{ url: string; filename: string }> => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post("/upload/image", formData, {
        headers: { "Content-Type": undefined },
      });
      return response.data;
    },
  });
};
