"use client";

import { CheckCircle, Send, ShieldAlert, User as UserIcon } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminReplyTicketMutation,
  useAdminUpdateTicketMutation,
} from "../../services/mutations";
import { useAdminTicketDetailQuery } from "../../services/queries";

interface TicketMessage {
  message_id: string;
  sender_id: string;
  sender_name?: string;
  message: string;
  is_internal?: boolean;
  created_at: string;
}

interface Props {
  ticketId: string;
  onResolved: () => void;
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
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (_e) {
    // Ignore audio failures
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

export const TicketResolutionView: React.FC<Props> = ({ ticketId, onResolved }) => {
  const { data: ticket, isLoading } = useAdminTicketDetailQuery(ticketId);
  const { mutateAsync: reply, isPending: isReplying } = useAdminReplyTicketMutation();
  const { mutateAsync: updateTicket, isPending: isUpdating } = useAdminUpdateTicketMutation();

  const [replyText, setReplyText] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const previousMessageCount = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ticket?.messages) {
      const count = ticket.messages.length;
      if (previousMessageCount.current > 0 && count > previousMessageCount.current) {
        const lastMsg = ticket.messages[count - 1] as TicketMessage;
        const isFromUser = lastMsg.sender_id === ticket.user_id;
        if (isFromUser) {
          playChime();
          requestBrowserNotification(
            `New reply: ${ticket.subject}`,
            `${lastMsg.sender_name || ticket.user_name}: ${lastMsg.message.slice(0, 80)}`,
          );
          toast.info(`New message from ${ticket.user_name}`, { icon: "💬" });
        }
      }
      previousMessageCount.current = count;
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket]);

  if (isLoading || !ticket) return <Skeleton className="w-full h-[600px]" />;

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await reply({ ticketId, payload: { message: replyText } });
      setReplyText("");
    } catch (_e) {
      // toast handled in mutation
    }
  };

  const handleResolve = async () => {
    try {
      await updateTicket({ ticketId, payload: { status: "resolved" } });
      onResolved();
    } catch (_e) {
      // toast handled in mutation
    }
  };

  const handleSaveNote = async () => {
    if (!internalNote.trim()) return;
    try {
      await updateTicket({ ticketId, payload: { internal_notes: internalNote } });
      toast.success("Internal note saved");
    } catch (_e) {
      // toast handled in mutation
    }
  };

  const handleClaim = async () => {
    try {
      await updateTicket({ ticketId, payload: { status: "in_progress" } });
    } catch (_e) {
      // toast handled in mutation
    }
  };

  const handleTerminate = async () => {
    try {
      await updateTicket({ ticketId, payload: { status: "closed" } });
      onResolved();
    } catch (_e) {
      // toast handled in mutation
    }
  };

  const kycColor = ticket.user_kyc === "Verified" ? "text-green-600" : "text-orange-500";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
      {/* Left Pane: Chat Thread */}
      <Card className="lg:col-span-2 flex flex-col h-full shadow-sm">
        <CardHeader className="bg-muted/30 border-b shrink-0">
          <CardTitle className="text-xl flex items-center justify-between">
            <span>{ticket.subject}</span>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className={
                  ticket.priority === "urgent" || ticket.priority === "high"
                    ? "border-red-500 text-red-500 animate-pulse"
                    : ""
                }
              >
                {ticket.priority.toUpperCase()}
              </Badge>
              <Badge variant="secondary">{ticket.status.toUpperCase()}</Badge>
            </div>
          </CardTitle>
          <div className="text-sm text-muted-foreground flex gap-4 mt-1">
            <span>
              From: <span className="font-medium text-foreground">{ticket.user_name}</span>
            </span>
            <span>Category: {ticket.category}</span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {(ticket.messages as TicketMessage[]).map((msg) => {
            const isAdmin = msg.sender_id !== ticket.user_id;
            const senderLabel = isAdmin
              ? `${msg.sender_name || "Support Team"} (Support)`
              : msg.sender_name || ticket.user_name;
            const initials = senderLabel
              .split(" ")
              .slice(0, 2)
              .map((w: string) => w[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={msg.message_id}
                className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="w-8 h-8 shrink-0 mt-1">
                  <AvatarFallback
                    className={
                      isAdmin
                        ? "bg-primary text-primary-foreground text-xs"
                        : "bg-muted-foreground/20 text-foreground text-xs"
                    }
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[72%] space-y-1 ${isAdmin ? "items-end" : "items-start"} flex flex-col`}
                >
                  <div
                    className={`text-xs font-medium text-muted-foreground ${isAdmin ? "text-right" : "text-left"}`}
                  >
                    {senderLabel}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                      isAdmin
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

        <CardFooter className="border-t p-4 flex gap-3 shrink-0">
          <Textarea
            placeholder="Type your response... (This will send an email to the treasurer)"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 min-h-[70px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleReply();
              }
            }}
          />
          <Button
            onClick={handleReply}
            disabled={isReplying || !replyText.trim()}
            className="mt-auto gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
        </CardFooter>
      </Card>

      {/* Right Pane: Context & Actions */}
      <div className="space-y-4 overflow-y-auto">
        {/* Identity Verification */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-primary" />
              Identity Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{ticket.user_name}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium truncate max-w-[150px]">{ticket.user_email || "—"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{ticket.user_phone || "—"}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">KYC Status</span>
              <span className={`font-semibold ${kycColor}`}>{ticket.user_kyc || "Pending"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Context & Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Session Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground uppercase font-bold mb-1">
                SLA Deadline
              </div>
              <div className="font-semibold text-red-600 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                {ticket.sla_deadline ? new Date(ticket.sla_deadline).toLocaleString() : "N/A"}
              </div>
            </div>

            <Tabs defaultValue="actions">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="actions" className="space-y-3 mt-3">
                {!ticket.assigned_admin_id && ticket.status !== "closed" && (
                  <Button
                    variant="default"
                    className="w-full justify-start"
                    onClick={handleClaim}
                    disabled={isUpdating}
                  >
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    Claim Session
                  </Button>
                )}
                <Button
                  variant="secondary"
                  className="w-full justify-start text-green-600"
                  onClick={handleResolve}
                  disabled={isUpdating || ticket.status === "closed"}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Resolved
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleTerminate}
                  disabled={isUpdating || ticket.status === "closed"}
                >
                  Close & Terminate
                </Button>
              </TabsContent>
              <TabsContent value="notes" className="space-y-3 mt-3">
                <Textarea
                  placeholder="Internal notes (admin-only)..."
                  defaultValue={ticket.internal_notes || ""}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSaveNote}
                  disabled={isUpdating}
                >
                  Save Note
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
