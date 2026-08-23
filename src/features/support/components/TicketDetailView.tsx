"use client";

import { Clock, Info, Loader2, Send, ShieldAlert } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
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

const playChime = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (_e) {
    // Ignore if audio fails or is blocked by browser policies
  }
};

export const TicketDetailView: React.FC<Props> = ({ ticketId }) => {
  const { data: ticket, isLoading } = useTicketDetailQuery(ticketId);
  const { mutateAsync: reply, isPending } = useReplyTicketMutation();
  const [replyText, setReplyText] = useState("");

  const previousAdminId = useRef<string | null>(null);

  useEffect(() => {
    if (ticket) {
      if (!previousAdminId.current && ticket.assigned_admin_id) {
        // Admin just joined!
        playChime();
        toast.info("An admin has joined the session to assist you.", {
          icon: <ShieldAlert className="text-primary w-4 h-4" />,
        });
      }
      previousAdminId.current = ticket.assigned_admin_id || null;
    }
  }, [ticket]);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await reply({ ticketId, payload: { message: replyText } });
      setReplyText("");
      toast.success("Reply sent!");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || "Failed to send reply");
    }
  };

  if (isLoading || !ticket) {
    return <Skeleton className="w-full h-full rounded-lg" />;
  }

  const isWaiting = ticket.status === "open" && !ticket.assigned_admin_id;

  return (
    <Card className="flex flex-col h-full border-0 shadow-none bg-transparent lg:border lg:shadow-sm lg:bg-card">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">{ticket.subject}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{ticket.status.toUpperCase()}</Badge>
              <Badge variant="secondary">{ticket.category}</Badge>
              <Badge variant={ticket.priority === "urgent" ? "destructive" : "outline"}>
                {ticket.priority.toUpperCase()}
              </Badge>
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

      <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 relative">
        {isWaiting && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex items-start gap-4">
            <Loader2 className="w-5 h-5 text-primary animate-spin mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-primary">Waiting for Support Team</h4>
              <p className="text-sm text-primary/80 mt-1">
                Your ticket is in the queue. An admin will be with you shortly.
                {ticket.priority === "urgent" && " Your urgent request has been prioritized."}
              </p>
            </div>
          </div>
        )}

        {ticket.messages.map((msg) => {
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

      <CardFooter className="border-t p-4 flex flex-col gap-2">
        {ticket.status === "closed" ? (
          <div className="w-full p-4 text-center rounded-lg bg-muted text-muted-foreground flex flex-col items-center">
            <Info className="w-6 h-6 mb-2 opacity-50" />
            <p>This session has been closed by the admin.</p>
            <p className="text-sm opacity-75">
              If you need further assistance, please open a new ticket.
            </p>
          </div>
        ) : (
          <div className="flex gap-4 w-full">
            <Textarea
              placeholder={
                isWaiting ? "Add more details while you wait..." : "Type your reply here..."
              }
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
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
