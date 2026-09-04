"use client";

import { AlertTriangle, ArrowLeft, Clock, Info, Loader2, Send, ShieldAlert } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useReplyTicketMutation } from "../services/mutations";
import { useTicketDetailQuery } from "../services/queries";
import type { TicketMessage } from "../types";
import { SupportRatingCard } from "./SupportRatingCard";

const IDLE_WARNING_MS = 10 * 60 * 1000; // 10 minutes — show warning banner
const AUTO_RESOLVE_MS = 20 * 60 * 1000; // 20 minutes — auto-resolve session

const parseSafeDate = (d?: string | null) => {
  if (!d) return new Date();
  const date = new Date(d.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

interface Props {
  ticketId: string;
  onBack?: () => void;
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
  try {
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          try {
            new Notification(title, { body, icon: "/favicon.ico" });
          } catch (_e) {}
        }
      });
    }
  } catch (_e) {
    // Mobile browsers often throw Illegal Constructor for new Notification()
    // requiring ServiceWorkerRegistration.showNotification() instead.
  }
};

export const TicketDetailView: React.FC<Props> = ({ ticketId, onBack }) => {
  const { data: ticket, isLoading } = useTicketDetailQuery(ticketId);
  const { mutateAsync: reply, isPending } = useReplyTicketMutation();
  const [replyText, setReplyText] = useState("");
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const [idleDismissed, setIdleDismissed] = useState(false);

  const previousAdminId = useRef<string | null>(null);
  const previousMessageCount = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idleWarningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoResolveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset inactivity timers whenever there's fresh activity
  const resetIdleTimers = useCallback(() => {
    if (idleWarningTimer.current) clearTimeout(idleWarningTimer.current);
    if (autoResolveTimer.current) clearTimeout(autoResolveTimer.current);
    setShowIdleWarning(false);

    idleWarningTimer.current = setTimeout(() => {
      setShowIdleWarning(true);
    }, IDLE_WARNING_MS);

    autoResolveTimer.current = setTimeout(() => {
      // Auto-resolve by sending a PATCH — the ticket polling will pick this up
      import("@/lib/api-client").then(({ apiClient }) => {
        apiClient.patch(`/support/tickets/${ticketId}`, { status: "resolved" }).catch(() => {
          /* fail silently — session may already be closed */
        });
      });
    }, AUTO_RESOLVE_MS);
  }, [ticketId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (idleWarningTimer.current) clearTimeout(idleWarningTimer.current);
      if (autoResolveTimer.current) clearTimeout(autoResolveTimer.current);
    };
  }, []);

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
        resetIdleTimers();
      }
      previousAdminId.current = ticket.assigned_admin_id || null;

      // New message from support
      if (previousMessageCount.current > 0 && count > previousMessageCount.current) {
        const lastMsg = ticket.messages[count - 1];
        const isFromSupport = lastMsg.sender_id !== ticket.user_id;
        if (isFromSupport) {
          playChime();
          requestBrowserNotification(
            "New reply from Support",
            `${lastMsg.sender_name || "Support Team"}: ${lastMsg.message.slice(0, 80)}`,
          );
          resetIdleTimers();
        }
      }
      previousMessageCount.current = count;

      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket, resetIdleTimers]);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await reply({ ticketId, payload: { message: replyText } });
      setReplyText("");
      toast.success("Message sent!");
      resetIdleTimers(); // User activity resets the clock
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || "Failed to send message");
    }
  };

  const handleStillHere = async () => {
    try {
      await reply({
        ticketId,
        payload: { message: "I'm still here and need further assistance." },
      });
      setIdleDismissed(true);
      setShowIdleWarning(false);
      resetIdleTimers();
      toast.success("Message sent — the support team has been notified.");
    } catch (_e) {
      /* fail silently */
    }
  };

  if (isLoading || !ticket) {
    return <Skeleton className="w-full h-full rounded-lg" />;
  }

  const isWaiting = ticket.status === "open" && !ticket.assigned_admin_id;
  const isResolved = ticket.status === "resolved" || ticket.status === "closed";
  const showRatingPrompt = isResolved && !ticket.has_rating;
  const isClosed = ticket.status === "closed";

  return (
    <div className="space-y-4">
      {/* Back navigation row */}
      {onBack && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-muted-foreground">Back to tickets</span>
        </div>
      )}

      <Card className="flex flex-col h-full border-0 shadow-none bg-transparent lg:border lg:shadow-sm lg:bg-card">
        <CardHeader className="border-b bg-muted/20 shrink-0">
          <CardTitle className="text-xl mb-2">{ticket.subject}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Badge variant="outline">{ticket.status.toUpperCase()}</Badge>
            <Badge variant="secondary">{ticket.category}</Badge>
            <Badge variant={ticket.priority === "urgent" ? "destructive" : "outline"}>
              {ticket.priority.toUpperCase()}
            </Badge>
            <span className="flex items-center gap-1" suppressHydrationWarning>
              <Clock className="w-3 h-3 ml-1" />
              {parseSafeDate(ticket.created_at).toLocaleString()}
            </span>
          </div>
        </CardHeader>

        <ScrollArea className="flex-1 w-full" orientation="vertical">
          <CardContent className="p-6 space-y-4 relative">
          {/* Waiting banner */}
          {isWaiting && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-2 flex items-start gap-4">
              <Loader2 className="w-5 h-5 text-primary animate-spin mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-primary">Waiting for Our Support Team</h4>
                <p className="text-sm text-primary/80 mt-1">
                  Your ticket is in the queue. Our support team will be with you shortly.
                  {ticket.priority === "urgent" && " Your urgent request has been prioritised."}
                </p>
              </div>
            </div>
          )}

          {/* Idle warning banner */}
          {showIdleWarning && !idleDismissed && !isResolved && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-amber-700 dark:text-amber-400">Still with us?</h4>
                <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-1">
                  Our support team hasn't heard from you in a while. If your issue has been fully
                  resolved, you're all set! If you still need help, let us know.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleStillHere}
                    className="border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
                  >
                    I Still Need Help
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIdleDismissed(true)}
                    className="text-muted-foreground"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
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
                  <span className="text-[10px] opacity-70 mt-1 block" suppressHydrationWarning>
                    {parseSafeDate(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </CardContent>
        </ScrollArea>

        {/* Rating prompt — inline, above footer, when resolved */}
        {showRatingPrompt && (
          <SupportRatingCard
            ticketId={ticketId}
            userName={ticket.messages[0]?.sender_name || "there"}
            subject={ticket.subject}
          />
        )}

        <CardFooter className="border-t p-4 flex flex-col gap-2 shrink-0">
          {isClosed ? (
            <div className="w-full p-4 text-center rounded-xl bg-muted text-muted-foreground flex flex-col items-center gap-2">
              <Info className="w-6 h-6 opacity-50" />
              <p className="font-medium">This session has been closed.</p>
              <p className="text-sm opacity-75">
                If you need further assistance, please open a new ticket.
              </p>
            </div>
          ) : isResolved ? (
            <div className="w-full p-4 text-center rounded-xl bg-muted text-muted-foreground flex flex-col items-center gap-2">
              <Info className="w-6 h-6 opacity-50" />
              <p className="font-medium">This session has been resolved.</p>
              <p className="text-sm opacity-75">
                Need more help?{" "}
                <span className="text-primary cursor-pointer">Open a new ticket.</span>
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
    </div>
  );
};
