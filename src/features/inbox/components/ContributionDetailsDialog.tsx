"use client";

import type * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCampaignsQuery } from "@/features/campaigns/services/queries";
import { useGroupsQuery } from "@/features/groups/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import type { PendingInboxOut } from "@/features/shared/types";
import { getAvatarColor } from "@/lib/colors";
import { cn } from "@/lib/utils";

export interface ContributionDetailsDialogProps {
  item: PendingInboxOut | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string, groupId: string, campaignId: string, notes: string) => void;
  onReject: (id: string) => void;
}

export const ContributionDetailsDialog: React.FC<ContributionDetailsDialogProps> = ({
  item,
  open,
  onOpenChange,
  onApprove,
  onReject,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const { data: groupsData } = useGroupsQuery({ limit: 100 });
  const groups = groupsData?.items ?? [];

  const { data: campaignsData } = useCampaignsQuery(selectedGroupId, { limit: 100 });
  const campaigns = campaignsData?.items ?? [];

  if (!item) return null;

  const initials = (item.sender_name || "?").substring(0, 2).toUpperCase();
  const avatarColor = getAvatarColor(item.sender_name || "?");

  const isMpesa = item.inbox_code !== null;
  const paymentMethod = isMpesa ? "M-pesa" : "Cash";
  const amount = item.amount ? `Ksh. ${item.amount.toLocaleString()}` : "Unknown";

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(item.created_at));

  const handleApprove = () => {
    onApprove(item.pending_id, selectedGroupId, selectedCampaignId, notes);
    onOpenChange(false);
  };

  const handleReject = () => {
    onReject(item.pending_id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-6 bg-card border-none sm:rounded-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">Contribution Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg",
                  avatarColor,
                )}
              >
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-base text-foreground">
                  {item.sender_name || "Unknown"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.sender_phone || "No phone number"}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <IconLibrary name="edit" className="w-5 h-5" />
            </Button>
          </div>

          {/* Details List */}
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">{amount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Purpose</span>
              <span className="font-medium">{item.purpose || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Payment method</span>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  isMpesa
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
                )}
              >
                {paymentMethod}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Transaction code</span>
              <span className="font-medium">{item.inbox_code || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Received on</span>
              <span className="font-medium">{formattedDate}</span>
            </div>
          </div>

          <div className="w-full h-px bg-border my-1" />

          {/* Form Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-foreground">
                Select Group <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedGroupId}
                onValueChange={(val) => setSelectedGroupId(val || "")}
              >
                <SelectTrigger className="w-full bg-background border-border">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-foreground">
                Select Campaign <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedCampaignId}
                onValueChange={(val) => setSelectedCampaignId(val || "")}
                disabled={!selectedGroupId}
              >
                <SelectTrigger className="w-full bg-background border-border">
                  <SelectValue placeholder="Select a campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-foreground font-medium">Notes</Label>
              <Textarea
                placeholder="E.g. Confirmed the amount and purpose."
                className="resize-none h-24 bg-background border-border text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11"
              onClick={handleApprove}
            >
              <IconLibrary name="check" className="w-5 h-5" />
              Approve
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive/10 gap-2 h-11"
              onClick={handleReject}
            >
              <IconLibrary name="close" className="w-5 h-5" />
              Reject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContributionDetailsDialog;
