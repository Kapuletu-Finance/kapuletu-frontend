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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={upgradeRole.isPending || role === currentRole}>
            {upgradeRole.isPending ? "Applying..." : "Change Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
