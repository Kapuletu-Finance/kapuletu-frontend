"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import IconLibrary from "@/features/shared/components/IconLibrary";

export interface BulkRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onConfirm: () => void;
}

export const BulkRejectDialog: React.FC<BulkRejectDialogProps> = ({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
}) => {
  const handleReject = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-6 bg-card border-none sm:rounded-2xl">
        <DialogHeader className="mb-2 text-center items-center justify-center">
          <DialogTitle className="text-xl font-semibold mt-2">
            {selectedCount === 1 ? "Reject Contribution" : "Bulk Reject Contributions"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            You are about to reject{" "}
            {selectedCount === 1 ? "this contribution" : `${selectedCount} contributions`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          {/* Warning Alert Box */}
          <div className="flex items-start gap-4 bg-destructive/10 border border-destructive/20 p-5 rounded-xl">
            <IconLibrary
              name="triangle-alert"
              className="w-6 h-6 text-destructive shrink-0 mt-0.5"
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-[15px] font-semibold text-foreground">
                Are you sure you want to reject{" "}
                {selectedCount === 1 ? "this transaction" : "these transactions"}?
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rejected contributions will not be added to your records.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <Button
              variant="outline"
              className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 h-11"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1 h-11" onClick={handleReject}>
              Reject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkRejectDialog;
