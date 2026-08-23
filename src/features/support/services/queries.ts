import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Ticket, TicketDetail } from "../types";

export const useTicketsQuery = () => {
  return useQuery({
    queryKey: ["support-tickets"],
    queryFn: async (): Promise<Ticket[]> => {
      const response = await apiClient.get("/support/tickets");
      return response.data;
    },
  });
};

export const useTicketDetailQuery = (ticketId: string | null) => {
  return useQuery({
    queryKey: ["support-tickets", ticketId],
    queryFn: async (): Promise<TicketDetail> => {
      const response = await apiClient.get(`/support/tickets/${ticketId}`);
      return response.data;
    },
    enabled: !!ticketId,
    refetchInterval: 5000,
  });
};

/**
 * Returns the count of open/in-progress tickets for the current user.
 * Used to drive the Help Center badge in the sidebar.
 */
export const usePendingTicketsCountQuery = () => {
  return useQuery({
    queryKey: ["support-tickets-count"],
    queryFn: async (): Promise<number> => {
      const response = await apiClient.get<Ticket[]>("/support/tickets");
      const active = response.data.filter((t) => t.status === "open" || t.status === "in_progress");
      return active.length;
    },
    refetchInterval: 30000, // Poll every 30s — lightweight
  });
};
