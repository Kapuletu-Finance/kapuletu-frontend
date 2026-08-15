"use client";

import type * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CampaignSelect } from "@/features/contributions/components/CampaignSelect";
import { GroupSelect } from "@/features/contributions/components/GroupSelect";

export interface BulkApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onConfirm: (
    groupId: string,
    campaignId?: string,
    groupSlug?: string,
    campaignSlug?: string,
  ) => void;
}

export const BulkApproveDialog: React.FC<BulkApproveDialogProps> = ({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedGroupSlug, setSelectedGroupSlug] = useState<string>("");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedCampaignSlug, setSelectedCampaignSlug] = useState<string>("");

  const handleApprove = () => {
    onConfirm(
      selectedGroupId,
      selectedCampaignId || undefined,
      selectedGroupSlug,
      selectedCampaignSlug,
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-6 bg-card border-none sm:rounded-2xl">
        <DialogHeader className="mb-2 text-center items-center justify-center">
          <DialogTitle className="text-xl font-semibold mt-2">
            {selectedCount === 1 ? "Approve Contribution" : "Bulk Approve Contributions"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            You are about to add{" "}
            {selectedCount === 1 ? "this contribution" : `${selectedCount} contributions`} to your
            records
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-2">
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
              <Label className="text-sm text-foreground">Select Campaign (Optional)</Label>
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
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <Button
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary/5 h-11"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-11"
              onClick={handleApprove}
              disabled={!selectedGroupId}
            >
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkApproveDialog;
