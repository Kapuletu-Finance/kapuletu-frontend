"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateUserStatusMutation } from "@/features/admin/services/mutations";

interface SuspendUserDialogProps {
  userId: string;
  isActive: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SuspendUserDialog: React.FC<SuspendUserDialogProps> = ({
  userId,
  isActive,
  isOpen,
  onOpenChange,
}) => {
  const [reason, setReason] = useState("");
  const updateStatus = useUpdateUserStatusMutation();

  const handleConfirm = () => {
    updateStatus.mutate(
      { userId, status: isActive ? "suspended" : "active", reason },
      {
        onSuccess: () => {
          onOpenChange(false);
          setReason("");
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isActive ? "Suspend User" : "Reactivate User"}</DialogTitle>
          <DialogDescription>
            {isActive
              ? "Are you sure you want to suspend this user? They will no longer be able to log in or manage their groups."
              : "Are you sure you want to reactivate this user? They will regain access to their account."}
          </DialogDescription>
        </DialogHeader>

        {isActive && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason for Suspension (Required)
              </label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Violation of terms, non-payment, etc."
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={isActive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={updateStatus.isPending || (isActive && !reason.trim())}
          >
            {updateStatus.isPending ? "Applying..." : isActive ? "Suspend User" : "Reactivate User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
