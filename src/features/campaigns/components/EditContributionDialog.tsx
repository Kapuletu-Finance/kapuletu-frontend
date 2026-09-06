"use client";

import type * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEditApprovedTransaction } from "@/features/campaigns/services/mutations";
import { CampaignSelect } from "@/features/contributions/components/CampaignSelect";
import { GroupSelect } from "@/features/contributions/components/GroupSelect";
import IconLibrary from "@/features/shared/components/IconLibrary";
import type { TransactionOut } from "@/features/shared/types";
import { getAvatarColor } from "@/lib/colors";
import { cn, getInitials } from "@/lib/utils";

export interface EditContributionDialogProps {
  item: TransactionOut | null;
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignIdContext?: string;
}

export const EditContributionDialog: React.FC<EditContributionDialogProps> = ({
  item,
  groupId,
  open,
  onOpenChange,
  campaignIdContext,
}) => {
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState<number | "">("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const editMutation = useEditApprovedTransaction(campaignIdContext);

  useEffect(() => {
    if (item) {
      setEditName(item.name || "");
      setEditAmount(item.amount || "");
      setSelectedGroupId(groupId || "");
      setSelectedCampaignId(item.campaign_id || campaignIdContext || "");
      setNotes("");
    }
  }, [item, campaignIdContext, groupId]);

  if (!item) return null;

  const initials = getInitials(item.name || "?");
  const avatarColor = getAvatarColor(item.name || "?");

  const handleSave = () => {
    editMutation.mutate(
      {
        transactionId: item.transaction_id,
        data: {
          amount: editAmount === "" ? undefined : Number(editAmount),
          sender_name: editName,
          group_id: selectedGroupId,
          campaign_id: selectedCampaignId,
          notes: notes,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-6 bg-card border-none sm:rounded-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <IconLibrary name="edit" className="w-5 h-5 text-primary" />
            Edit Contribution
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Correcting a finalized transaction will gracefully supersede the original record to
            preserve ledger integrity.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0",
                avatarColor,
              )}
            >
              {initials}
            </div>
            <div className="flex flex-col flex-1 truncate">
              <span className="font-semibold text-base text-foreground truncate">
                {item.transaction_code || "Unknown Code"}
              </span>
              <span className="text-sm text-muted-foreground truncate">
                {new Date(item.date).toLocaleDateString()} • {item.payment_method}
              </span>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Contributor Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. John Doe"
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Amount (Ksh)</Label>
              <Input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 5000"
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Group</Label>
              <GroupSelect
                value={selectedGroupId}
                onChange={(id) => {
                  setSelectedGroupId(id);
                  setSelectedCampaignId(""); // Reset campaign when group changes
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Campaign</Label>
              <CampaignSelect
                groupId={selectedGroupId}
                value={selectedCampaignId}
                onChange={(id) => setSelectedCampaignId(id)}
                disabled={!selectedGroupId}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Reason for Edit (Optional)</Label>
              <Textarea
                placeholder="e.g. Corrected name spelling and re-allocated to correct campaign."
                className="resize-none h-20 text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11"
              onClick={handleSave}
              disabled={editMutation.isPending || !editAmount || !selectedCampaignId}
            >
              {editMutation.isPending ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <>
                  <IconLibrary name="check" className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 h-11"
              onClick={() => onOpenChange(false)}
              disabled={editMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditContributionDialog;
