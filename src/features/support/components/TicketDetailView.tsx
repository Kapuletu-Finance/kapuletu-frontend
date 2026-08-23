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
import type { TicketMessage } from "../types";

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
    // Ignore if audio fails
  }
};

const requestBrowserNotification = (title: string, body: string) => {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((perm) => {
      if (perm === "granted") new Notification(title, { body, icon: "/favicon.ico" });
    });
  }
};

export const TicketDetailView: React.FC<Props> = ({ ticketId }) => {
  const { data: ticket, isLoading } = useTicketDetailQuery(ticketId);
  const { mutateAsync: reply, isPending } = useReplyTicketMutation();
  const [replyText, setReplyText] = useState("");

  const previousAdminId = useRef<string | null>(null);
  const previousMessageCount = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ticket) {
      const count = ticket.messages.length;

      // Admin just joined
      if (!previousAdminId.current && ticket.assigned_admin_id) {
        playChime();
        toast.info("Our support team has joined your session.", {
          icon: <ShieldAlert className="text-primary w-4 h-4" />,
        });
        requestBrowserNotification(
          "Kapuletu Support",
          "A support team member has joined your session.",
        );
      }
      previousAdminId.current = ticket.assigned_admin_id || null;

      // New message arrived from support
      if (previousMessageCount.current > 0 && count > previousMessageCount.current) {
        const lastMsg = ticket.messages[count - 1];
        const isFromSupport = lastMsg.sender_id !== ticket.user_id;
        if (isFromSupport) {
          playChime();
          requestBrowserNotification(
            "New reply from Support",
            `${lastMsg.sender_name || "Support Team"}: ${lastMsg.message.slice(0, 80)}`,
          );
        }
      }
      previousMessageCount.current = count;

      // Auto-scroll
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket]);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await reply({ ticketId, payload: { message: replyText } });
      setReplyText("");
      toast.success("Message sent!");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || "Failed to send message");
    }
  };

  if (isLoading || !ticket) {
    return <Skeleton className="w-full h-full rounded-lg" />;
  }

  const isWaiting = ticket.status === "open" && !ticket.assigned_admin_id;

  return (
    <Card className="flex flex-col h-full border-0 shadow-none bg-transparent lg:border lg:shadow-sm lg:bg-card">
      <CardHeader className="border-b bg-muted/20 shrink-0">
        <CardTitle className="text-xl mb-2">{ticket.subject}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <Badge variant="outline">{ticket.status.toUpperCase()}</Badge>
          <Badge variant="secondary">{ticket.category}</Badge>
          <Badge variant={ticket.priority === "urgent" ? "destructive" : "outline"}>
            {ticket.priority.toUpperCase()}
          </Badge>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 ml-1" />
            {new Date(ticket.created_at).toLocaleString()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 relative">
        {isWaiting && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-2 flex items-start gap-4">
            <Loader2 className="w-5 h-5 text-primary animate-spin mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-primary">Waiting for Our Support Team</h4>
              <p className="text-sm text-primary/80 mt-1">
                Your ticket is in the queue. Our support team will be with you shortly.
                {ticket.priority === "urgent" && " Your urgent request has been prioritized."}
              </p>
            </div>
          </div>
        )}

        {ticket.messages.map((msg: TicketMessage) => {
          const isUser = msg.sender_id === ticket.user_id;
          const senderLabel = isUser ? "You" : `${msg.sender_name || "Support Team"} (Support)`;
          const initials = isUser
            ? "ME"
            : (msg.sender_name || "ST")
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase();

          return (
            <div
              key={msg.message_id}
              className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <Avatar className="w-8 h-8 shrink-0 mt-1">
                <AvatarFallback
                  className={
                    isUser
                      ? "bg-primary text-primary-foreground text-xs"
                      : "bg-muted-foreground/20 text-foreground text-xs"
                  }
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[72%] space-y-1 flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                <div
                  className={`text-xs font-medium text-muted-foreground ${isUser ? "text-right" : "text-left"}`}
                >
                  {senderLabel}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted text-foreground rounded-tl-none"
                  }`}
                >
                  {msg.message}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="border-t p-4 flex flex-col gap-2 shrink-0">
        {ticket.status === "closed" ? (
          <div className="w-full p-4 text-center rounded-xl bg-muted text-muted-foreground flex flex-col items-center gap-2">
            <Info className="w-6 h-6 opacity-50" />
            <p className="font-medium">This session has been closed.</p>
            <p className="text-sm opacity-75">
              If you need further assistance, please open a new ticket.
            </p>
          </div>
        ) : (
          <div className="flex gap-3 w-full">
            <Textarea
              placeholder={
                isWaiting ? "Add more details while you wait..." : "Type your message here..."
              }
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 min-h-[60px] resize-none"
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
