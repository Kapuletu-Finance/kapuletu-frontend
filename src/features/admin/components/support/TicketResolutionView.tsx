"use client";

import { CheckCircle, Send, ShieldAlert } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminReplyTicketMutation,
  useAdminUpdateTicketMutation,
} from "../../services/mutations";
import { useAdminTicketDetailQuery } from "../../services/queries";

interface Props {
  ticketId: string;
  onResolved: () => void;
}

export const TicketResolutionView: React.FC<Props> = ({ ticketId, onResolved }) => {
  const { data: ticket, isLoading } = useAdminTicketDetailQuery(ticketId);
  const { mutateAsync: reply, isPending: isReplying } = useAdminReplyTicketMutation();
  const { mutateAsync: updateTicket, isPending: isUpdating } = useAdminUpdateTicketMutation();

  const [replyText, setReplyText] = useState("");
  const [internalNote, setInternalNote] = useState("");

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
      {/* Left Pane: Thread */}
      <Card className="lg:col-span-2 flex flex-col h-full border-r shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
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
          <div className="text-sm text-muted-foreground flex gap-4 mt-2">
            <span>
              From: <span className="font-medium text-foreground">{ticket.user_name}</span>
            </span>
            <span>Category: {ticket.category}</span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {ticket.messages.map(
            (msg: {
              message_id: string;
              sender_id: string;
              message: string;
              created_at: string;
            }) => {
              const isAdmin = msg.sender_id !== ticket.user_id;
              return (
                <div
                  key={msg.message_id}
                  className={`flex gap-3 ${isAdmin ? "justify-end" : "justify-start"}`}
                >
                  {!isAdmin && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{ticket.user_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${isAdmin ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    <div className="text-xs opacity-70 mb-2 flex justify-between">
                      <span>{isAdmin ? "Kapuletu Support" : ticket.user_name}</span>
                      <span className="ml-4">
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
            },
          )}
        </CardContent>

        <CardFooter className="border-t p-4 flex gap-3">
          <Textarea
            placeholder="Type your response to the user... (This will send an email)"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 min-h-[80px]"
          />
          <Button
            onClick={handleReply}
            disabled={isReplying || !replyText.trim()}
            className="mt-auto"
          >
            <Send className="w-4 h-4 mr-2" />
            Reply
          </Button>
        </CardFooter>
      </Card>

      {/* Right Pane: Context & Actions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ticket Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">SLA Deadline</div>
              <div className="font-semibold text-red-600 flex items-center gap-2 mt-1">
                <ShieldAlert className="w-4 h-4" />
                {ticket.sla_deadline ? new Date(ticket.sla_deadline).toLocaleString() : "N/A"}
              </div>
            </div>

            <Tabs defaultValue="actions">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="actions" className="space-y-4 mt-4">
                {!ticket.assigned_admin_id && ticket.status !== "closed" && (
                  <Button
                    variant="default"
                    className="w-full justify-start bg-primary text-primary-foreground"
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
                  Close & Terminate Session
                </Button>
              </TabsContent>
              <TabsContent value="notes" className="space-y-4 mt-4">
                <Textarea
                  placeholder="Internal notes visible only to admins..."
                  defaultValue={ticket.internal_notes || ""}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="min-h-[150px]"
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
