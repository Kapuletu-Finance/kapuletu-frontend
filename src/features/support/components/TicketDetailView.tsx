"use client";

import { Clock, Send } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useReplyTicketMutation } from "../services/mutations";
import { useTicketDetailQuery } from "../services/queries";

interface Props {
  ticketId: string;
}

export const TicketDetailView: React.FC<Props> = ({ ticketId }) => {
  const { data: ticket, isLoading } = useTicketDetailQuery(ticketId);
  const { mutateAsync: reply, isPending } = useReplyTicketMutation();
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await reply({ ticketId, payload: { message: replyText } });
      setReplyText("");
      toast.success("Reply sent!");
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to send reply");
    }
  };

  if (isLoading || !ticket) {
    return <Skeleton className="w-full h-[500px] rounded-lg" />;
  }

  return (
    <Card className="flex flex-col h-[700px]">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">{ticket.subject}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{ticket.status}</Badge>
              <Badge variant="secondary">{ticket.category}</Badge>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 ml-2" />
                Created on {new Date(ticket.created_at).toLocaleString()}
              </span>
            </div>
          </div>
          {ticket.sla_deadline && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground uppercase font-bold mb-1">
                SLA Deadline
              </div>
              <div className="text-sm font-medium">
                {new Date(ticket.sla_deadline).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
        {ticket.messages.map((msg) => {
          // Simplistic logic to differentiate admin vs user messages.
          // In a real app, we'd check if sender_id === current_user_id.
          // For now we assume if it's not the user who created it, it's an admin.
          const isUser = msg.sender_id === ticket.user_id;

          return (
            <div
              key={msg.message_id}
              className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    K
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-lg p-4 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                <div className="text-xs opacity-70 mb-2 flex justify-between">
                  <span>{isUser ? "You" : "Kapuletu Support"}</span>
                  <span>
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
              </div>
            </div>
          );
        })}
      </CardContent>

      {ticket.status !== "closed" && (
        <CardFooter className="border-t p-4 flex gap-4">
          <Textarea
            placeholder="Type your reply here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleReply();
              }
            }}
          />
          <Button
            onClick={handleReply}
            disabled={isPending || !replyText.trim()}
            className="mt-auto gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
