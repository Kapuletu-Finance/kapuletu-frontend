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
  });
};
