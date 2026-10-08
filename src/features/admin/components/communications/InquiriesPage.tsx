import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import type React from "react";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { apiClient as api } from "@/lib/api-client";

type ContactMessage = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  topic: string;
  message: string;
  status: string;
  created_at: string;
};

const InquiryList: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["admin", "contact-messages"],
    queryFn: async () => {
      const res = await api.get("/admin/contact-messages");
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.patch(`/admin/contact-messages/${id}/status`, null, {
        params: { status },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contact-messages"] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading inquiries...
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-border border-dashed">
        <IconLibrary name="inbox" className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No contact messages yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row gap-4 justify-between items-start"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h4 className="font-semibold">
                {msg.first_name} {msg.last_name}
              </h4>
              <span className="text-sm text-muted-foreground">({msg.email})</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${msg.status === "unread" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" : msg.status === "read" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"}`}
              >
                {msg.status}
              </span>
            </div>
            <p className="text-sm font-medium text-primary">Topic: {msg.topic}</p>
            <p className="text-sm bg-muted/50 p-3 rounded-lg border border-border mt-2 whitespace-pre-wrap">
              {msg.message}
            </p>
            <p className="text-xs text-muted-foreground pt-1">
              Received on {format(new Date(msg.created_at), "MMM d, yyyy h:mm a")}
            </p>
          </div>
          <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
            {msg.status === "unread" && (
              <button
                onClick={() => updateStatusMutation.mutate({ id: msg.id, status: "read" })}
                className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded w-full"
              >
                Mark as Read
              </button>
            )}
            {msg.status !== "resolved" && (
              <button
                onClick={() => updateStatusMutation.mutate({ id: msg.id, status: "resolved" })}
                className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded w-full"
              >
                Mark Resolved
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export const InquiriesPage: React.FC = () => (
  <PageLayout
    title="Inquiries"
    subtitle="Messages sent from the contact form on the public website."
  >
    <InquiryList />
  </PageLayout>
);
