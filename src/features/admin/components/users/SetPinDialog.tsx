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
import { useSetAdminPinMutation } from "@/features/admin/services/mutations";

interface SetPinDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SetPinDialog: React.FC<SetPinDialogProps> = ({ isOpen, onOpenChange }) => {
  const [pin, setPin] = useState("");
  const setPinMutation = useSetAdminPinMutation();

  const handleConfirm = () => {
    if (!pin || pin.length < 4) return;
    setPinMutation.mutate(
      { pin },
      {
        onSuccess: () => {
          onOpenChange(false);
          setPin("");
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Security PIN</DialogTitle>
          <DialogDescription>
            Update the secure access PIN for the Admin Dashboard. Only Super Admins can perform this
            action.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="pin" className="text-sm font-medium">
              New PIN
            </label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter new PIN"
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground">Must be at least 4 characters long.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={setPinMutation.isPending || pin.length < 4}>
            {setPinMutation.isPending ? "Updating..." : "Update PIN"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
