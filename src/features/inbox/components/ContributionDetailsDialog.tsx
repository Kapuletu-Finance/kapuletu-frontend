"use client";

import type * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CampaignSelect } from "@/features/contributions/components/CampaignSelect";
import { GroupSelect } from "@/features/contributions/components/GroupSelect";
import { useSplitTransactionMutation } from "@/features/inbox/services/mutations";
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

  const [isSplitting, setIsSplitting] = useState(false);
  const [splits, setSplits] = useState<
    { id: number; name: string; amount: number; isSender: boolean }[]
  >([]);
  const splitMutation = useSplitTransactionMutation();

  // Reset state when item changes
  useEffect(() => {
    if (item && open) {
      setSplits([
        {
          id: Date.now(),
          name: item.sender_name || "Unknown",
          amount: item.amount || 0,
          isSender: true,
        },
      ]);
      setIsSplitting(false);
      setSelectedGroupId("");
      setSelectedCampaignId("");
      setNotes("");
    }
  }, [item, open]);

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

  // Dynamic Sender Calculation
  const totalOtherAllocations = splits
    .filter((s) => !s.isSender)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const calculatedSenderAmount = Math.max(0, (item.amount || 0) - totalOtherAllocations);

  const handleAddSplit = () => {
    setSplits([...splits, { id: Date.now(), name: "", amount: 0, isSender: false }]);
  };

  const handleUpdateSplit = (id: number, field: "name" | "amount", value: string | number) => {
    setSplits(
      splits.map((s) => {
        if (s.id === id) {
          return { ...s, [field]: value };
        }
        return s;
      }),
    );
  };

  const handleRemoveSplit = (id: number) => {
    setSplits(splits.filter((s) => s.id !== id));
  };

  const isValidSplit =
    totalOtherAllocations + calculatedSenderAmount === (item.amount || 0) &&
    splits.every((s) => s.isSender || (s.name.trim() !== "" && s.amount > 0));

  const handleSubmit = () => {
    if (isSplitting) {
      const finalAllocations = splits
        .map((s) => {
          if (s.isSender) return { name: s.name, amount: calculatedSenderAmount };
          return { name: s.name, amount: s.amount };
        })
        .filter((s) => s.amount > 0);

      splitMutation.mutate(
        {
          id: item.pending_id,
          data: {
            group_id: selectedGroupId,
            campaign_id: selectedCampaignId,
            allocations: finalAllocations,
          },
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    } else {
      onApprove(item.pending_id, selectedGroupId, selectedCampaignId, notes);
      onOpenChange(false);
    }
  };

  const handleReject = () => {
    onReject(item.pending_id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-6 bg-card border-none sm:rounded-2xl max-h-[90vh] overflow-y-auto">
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
              <GroupSelect value={selectedGroupId} onChange={setSelectedGroupId} />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-foreground">
                Select Campaign <span className="text-destructive">*</span>
              </Label>
              <CampaignSelect
                groupId={selectedGroupId}
                value={selectedCampaignId}
                onChange={setSelectedCampaignId}
                disabled={!selectedGroupId}
              />
            </div>

            {/* Split Toggle */}
            <div className="flex items-center justify-between mt-2">
              <Label className="text-sm font-medium text-foreground">
                Split this contribution?
              </Label>
              <Button
                variant={isSplitting ? "default" : "outline"}
                size="sm"
                onClick={() => setIsSplitting(!isSplitting)}
                className="text-xs"
              >
                {isSplitting ? "Cancel Split" : "Split Contribution"}
              </Button>
            </div>

            {isSplitting && (
              <div className="flex flex-col gap-4 p-4 border border-border rounded-xl bg-muted/30">
                <div className="flex flex-col gap-3">
                  <span className="text-xs text-muted-foreground">
                    Tip: If a sender is paying entirely on behalf of others, allocate the full
                    amount to the other contributors. The sender's allocation will dynamically drop
                    to 0 Ksh.
                  </span>
                  {splits.map((s) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Name"
                          value={s.name}
                          readOnly={s.isSender}
                          onChange={(e) => handleUpdateSplit(s.id, "name", e.target.value)}
                          className={cn(
                            "h-9 text-sm",
                            s.isSender && "bg-muted text-muted-foreground",
                          )}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={s.isSender ? calculatedSenderAmount : s.amount || ""}
                          readOnly={s.isSender}
                          onChange={(e) =>
                            handleUpdateSplit(s.id, "amount", parseFloat(e.target.value) || 0)
                          }
                          className={cn("h-9 text-sm", s.isSender && "bg-muted font-semibold")}
                        />
                      </div>
                      <div className="w-12 flex justify-center">
                        {!s.isSender && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveSplit(s.id)}
                          >
                            <IconLibrary name="close" className="w-4 h-4" />
                          </Button>
                        )}
                        {s.isSender && (
                          <span className="text-xs text-muted-foreground font-medium">Sender</span>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddSplit}
                    className="w-fit gap-2 mt-1 text-xs"
                  >
                    <IconLibrary name="add" className="w-3 h-3" />
                    Add Person
                  </Button>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
                  <span className="text-sm font-medium">Remaining:</span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      totalOtherAllocations > (item.amount || 0) && "text-destructive",
                    )}
                  >
                    {Math.max(0, (item.amount || 0) - totalOtherAllocations).toLocaleString()} Ksh
                  </span>
                </div>
              </div>
            )}

            {!isSplitting && (
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-foreground font-medium">Notes</Label>
                <Textarea
                  placeholder="E.g. Confirmed the amount and purpose."
                  className="resize-none h-24 bg-background border-border text-sm"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11"
              onClick={handleSubmit}
              disabled={
                !selectedGroupId ||
                !selectedCampaignId ||
                splitMutation.isPending ||
                (isSplitting && !isValidSplit)
              }
            >
              {splitMutation.isPending ? (
                "Approving..."
              ) : (
                <>
                  <IconLibrary name="check" className="w-5 h-5" />
                  {isSplitting ? "Approve Split" : "Approve"}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive/10 gap-2 h-11"
              onClick={handleReject}
              disabled={splitMutation.isPending}
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
