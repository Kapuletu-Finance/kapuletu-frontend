import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { groupsQueryKey } from "@/features/groups/services/queries";
import { GROUPS_URLS } from "@/features/groups/urls";
import type { GroupCreate, GroupOut, GroupUpdate } from "@/features/shared/types";
import { apiClient } from "@/lib/api-client";

export const useCreateGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GroupCreate) => {
      const response = await apiClient.post<GroupOut>(GROUPS_URLS.BASE_GROUPS, data);
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create group.");
    },
    onSuccess: () => {
      toast.success("Group created successfully!");
      queryClient.invalidateQueries({ queryKey: groupsQueryKey });
    },
  });
};

export const useUpdateGroupMutation = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GroupUpdate) => {
      const response = await apiClient.patch<GroupOut>(GROUPS_URLS.groupDetail(groupId), data);
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update group.");
    },
    onSuccess: () => {
      toast.success("Group updated successfully!");
      queryClient.invalidateQueries({ queryKey: groupsQueryKey });
    },
  });
};

export const useArchiveGroupMutation = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete<GroupOut>(GROUPS_URLS.groupDetail(groupId));
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to archive group.");
    },
    onSuccess: () => {
      toast.success("Group archived successfully!");
      queryClient.invalidateQueries({ queryKey: groupsQueryKey });
    },
  });
};
