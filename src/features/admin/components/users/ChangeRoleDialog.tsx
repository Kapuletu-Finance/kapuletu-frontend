"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpgradeUserRoleMutation } from "@/features/admin/services/mutations";

interface ChangeRoleDialogProps {
  userId: string;
  currentRole: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangeRoleDialog: React.FC<ChangeRoleDialogProps> = ({
  userId,
  currentRole,
  isOpen,
  onOpenChange,
}) => {
  const [role, setRole] = useState(currentRole);
  const [confirmText, setConfirmText] = useState("");
  const upgradeRole = useUpgradeUserRoleMutation();

  useEffect(() => {
    if (isOpen) {
      setRole(currentRole);
    }
  }, [isOpen, currentRole]);

  const handleConfirm = () => {
    upgradeRole.mutate(
      { userId, role },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Modify the access level for this user. Warning: Granting admin privileges allows full
            access to the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Select value={role} onValueChange={(val) => setRole(val || currentRole)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="treasurer">Treasurer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>

          {(role === "admin" || role === "super_admin") && role !== currentRole && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-2">
                Warning: You are granting elevated access. Type CONFIRM below to proceed.
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="CONFIRM"
                className="h-8 text-sm border-amber-500/50 focus-visible:ring-amber-500"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              upgradeRole.isPending ||
              role === currentRole ||
              ((role === "admin" || role === "super_admin") && confirmText !== "CONFIRM")
            }
          >
            {upgradeRole.isPending ? "Applying..." : "Change Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
