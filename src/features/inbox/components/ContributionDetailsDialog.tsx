"use client";

import type * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CampaignSelect } from "@/features/contributions/components/CampaignSelect";
import { GroupSelect } from "@/features/contributions/components/GroupSelect";
import IconLibrary from "@/features/shared/components/IconLibrary";
import type { PendingInboxOut } from "@/features/shared/types";
import { getAvatarColor } from "@/lib/colors";
import { cn } from "@/lib/utils";

export interface ContributionDetailsDialogProps {
  item: PendingInboxOut | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (
    id: string,
    groupId: string,
    campaignId: string,
    notes: string,
    groupSlug?: string,
    campaignSlug?: string,
  ) => void;
  onSplit: (
    id: string,
    groupId: string,
    campaignId: string | undefined,
    allocations: { name: string; amount: number }[],
    notes: string,
    groupSlug?: string,
    campaignSlug?: string,
  ) => void;
  onReject: (id: string) => void;
}

export const ContributionDetailsDialog: React.FC<ContributionDetailsDialogProps> = ({
  item,
  open,
  onOpenChange,
  onApprove,
  onSplit,
  onReject,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedGroupSlug, setSelectedGroupSlug] = useState<string>("");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedCampaignSlug, setSelectedCampaignSlug] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [otherAllocations, setOtherAllocations] = useState<
    { id: string; name: string; amount: number | "" }[]
  >([]);

  if (!item) return null;

  const isSplitting = otherAllocations.length > 0;
  const totalOtherAllocated = otherAllocations.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
  const senderAmount = (item.amount || 0) - totalOtherAllocated;
  const isOverAllocated = senderAmount < 0;

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
    if (isSplitting) {
      if (isOverAllocated) return;

      const finalAllocations: { name: string; amount: number }[] = [];
      if (senderAmount > 0) {
        finalAllocations.push({ name: item.sender_name || "Unknown", amount: senderAmount });
      }
      otherAllocations.forEach((a) => {
        if (Number(a.amount) > 0) {
          finalAllocations.push({ name: a.name || "Unknown", amount: Number(a.amount) });
        }
      });

      if (finalAllocations.length === 0) return;

      onSplit(
        item.pending_id,
        selectedGroupId,
        selectedCampaignId || undefined,
        finalAllocations,
        notes,
        selectedGroupSlug,
        selectedCampaignSlug,
      );
    } else {
      onApprove(
        item.pending_id,
        selectedGroupId,
        selectedCampaignId,
        notes,
        selectedGroupSlug,
        selectedCampaignSlug,
      );
    }
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
              <GroupSelect
                value={selectedGroupId}
                onChange={(id, slug) => {
                  setSelectedGroupId(id);
                  if (slug) setSelectedGroupSlug(slug);
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-foreground">
                Select Campaign <span className="text-destructive">*</span>
              </Label>
              <CampaignSelect
                groupId={selectedGroupId}
                value={selectedCampaignId}
                onChange={(id, slug) => {
                  setSelectedCampaignId(id);
                  if (slug) setSelectedCampaignSlug(slug);
                }}
                disabled={!selectedGroupId}
              />
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconLibrary name="split" className="w-5 h-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      Split contribution
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      Allocate a payment to multiple contributors
                    </span>
                  </div>
                </div>
              </div>

              {isSplitting && (
                <div className="flex flex-col pt-2 gap-2">
                  <div className="text-xs text-muted-foreground italic mb-1">
                    Tip: If the sender's allocation falls to 0, they will be omitted from the split.
                  </div>

                  <div className="flex flex-col bg-card">
                    <div className="grid grid-cols-[1fr_80px_40px] items-center gap-2 px-2 pb-2 text-sm text-muted-foreground border-b border-border">
                      <span>Name</span>
                      <span>Amount</span>
                      <span></span>
                    </div>

                    {/* Sender Row */}
                    <div
                      className={cn(
                        "grid grid-cols-[1fr_80px_40px] items-center gap-2 py-2 px-2 border-b border-border transition-opacity",
                        senderAmount <= 0 && "opacity-40 grayscale",
                      )}
                    >
                      <div className="flex flex-col justify-center">
                        <span className="text-sm font-medium text-foreground">
                          {item.sender_name || "Unknown"}
                        </span>
                        <span className="text-[10px] text-primary font-bold tracking-wider uppercase">
                          Sender
                        </span>
                      </div>
                      <div className="text-sm font-medium text-foreground text-left px-2">
                        {Math.max(0, senderAmount).toLocaleString()}
                      </div>
                      <div></div>
                    </div>

                    {/* Other Allocations */}
                    {otherAllocations.map((alloc, idx) => (
                      <div
                        key={alloc.id}
                        className="grid grid-cols-[1fr_80px_40px] items-center gap-2 py-1 px-1 border-b border-border last:border-0"
                      >
                        <Input
                          type="text"
                          placeholder="John Doe"
                          value={alloc.name}
                          onChange={(e) => {
                            const newAlloc = [...otherAllocations];
                            newAlloc[idx].name = e.target.value;
                            setOtherAllocations(newAlloc);
                          }}
                          className="h-9 px-2 text-sm border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-foreground font-medium"
                        />
                        <Input
                          type="number"
                          placeholder="500"
                          value={alloc.amount}
                          onChange={(e) => {
                            const newAlloc = [...otherAllocations];
                            newAlloc[idx].amount = e.target.value ? Number(e.target.value) : "";
                            setOtherAllocations(newAlloc);
                          }}
                          className="h-9 px-2 text-sm border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-foreground font-medium"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 justify-self-center"
                          onClick={() =>
                            setOtherAllocations(otherAllocations.filter((a) => a.id !== alloc.id))
                          }
                        >
                          <IconLibrary name="trash" className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {isOverAllocated && (
                    <div className="text-xs text-destructive mt-1 font-medium px-1 flex items-center gap-1">
                      <IconLibrary name="close" className="w-3.5 h-3.5" />
                      Warning: Total splits exceed the original amount by {-senderAmount}.
                    </div>
                  )}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-1 border-dashed bg-transparent text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:border-emerald-900/50 dark:hover:bg-emerald-950/30 transition-colors"
                onClick={() =>
                  setOtherAllocations([
                    ...otherAllocations,
                    { id: Date.now().toString(), name: "", amount: "" },
                  ])
                }
              >
                <IconLibrary name="add" className="w-4 h-4 mr-2" />
                {isSplitting ? "Add another contributor" : "Split this contribution"}
              </Button>
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
              disabled={!selectedGroupId || (isSplitting && isOverAllocated)}
            >
              <IconLibrary name="check" className="w-5 h-5" />
              Approve {isSplitting ? "Split" : ""}
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
