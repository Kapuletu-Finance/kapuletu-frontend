"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSendInviteMutation } from "@/features/admin/services/mutations";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const InvitesPanel: React.FC = () => {
  const [emails, setEmails] = useState("");
  const [message, setMessage] = useState("Welcome to the exclusive Kapuletu private beta!");
  const inviteMutation = useSendInviteMutation();

  const handleSendInvites = async () => {
    if (!emails.trim()) {
      toast.error("Please enter at least one email address.");
      return;
    }

    // Parse emails by comma or newline
    const emailArray = emails
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
    if (emailArray.length === 0) {
      toast.error("No valid emails found.");
      return;
    }

    try {
      await inviteMutation.mutateAsync({
        emails: emailArray,
        message: message,
      });
      setEmails("");
    } catch (err) {
      // Error is handled in the mutation
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight">VIP Invites & Testers</h3>
          <p className="text-sm text-muted-foreground">
            Bulk send highly professional onboarding invites to testers.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="border border-border rounded-xl bg-card p-6 shadow-sm flex flex-col gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tester Emails (Comma-separated or newline)</Label>
              <Textarea
                placeholder="test1@example.com, test2@example.com&#10;test3@example.com"
                className="min-h-[120px] font-mono text-sm"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Custom Greeting Message</Label>
              <Textarea
                placeholder="Write a warm, professional message..."
                className="min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This message will be injected directly into the branded HTML invite template, along
                with their secure onboarding link.
              </p>
            </div>
          </div>

          <Button
            onClick={handleSendInvites}
            disabled={inviteMutation.isPending}
            className="w-full font-semibold"
          >
            {inviteMutation.isPending ? "Dispatching Invites..." : "Dispatch Invites"}
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold mb-3 text-primary">
              <IconLibrary name="info" className="h-5 w-5" />
              <span>Invite Workflow</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2.5">
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Paste up to 50 emails at a time.
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />A unique,
                secure single-use token will be generated for each email.
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Once a tester registers using their link, their status will update to ACCEPTED.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Invite Ledger Placeholder */}
      <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm flex flex-col mt-4">
        <div className="p-4 border-b border-border bg-muted/30 font-semibold text-sm flex items-center justify-between">
          <span>Invite Ledger</span>
        </div>
        <div className="p-6 text-center text-muted-foreground">
          Real-time tracking of sent invites will appear here.
        </div>
      </div>
    </div>
  );
};
