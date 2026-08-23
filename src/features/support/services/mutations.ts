import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Ticket, TicketCreatePayload, TicketMessage, TicketReplyPayload } from "../types";

export const useCreateTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TicketCreatePayload): Promise<Ticket> => {
      const response = await apiClient.post("/support/tickets", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets-count"] });
    },
  });
};

export const useReplyTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      payload,
    }: {
      ticketId: string;
      payload: TicketReplyPayload;
    }): Promise<TicketMessage> => {
      const response = await apiClient.post(`/support/tickets/${ticketId}/reply`, payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets", variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets-count"] });
    },
  });
};
