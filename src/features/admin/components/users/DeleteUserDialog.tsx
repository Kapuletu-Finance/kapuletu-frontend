import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { useDeleteUserMutation } from "@/features/admin/services/mutations";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface DeleteUserDialogProps {
  userId: string;
  userEmail: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  userId,
  userEmail,
  isOpen,
  onOpenChange,
}) => {
  const router = useRouter();
  const deleteMutation = useDeleteUserMutation();
  const [confirmText, setConfirmText] = useState("");

  const isConfirmed = confirmText === "DELETE";

  const handleDelete = () => {
    if (!isConfirmed) return;
    deleteMutation.mutate(userId, {
      onSuccess: () => {
        onOpenChange(false);
        router.push("/admin/users");
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setConfirmText(""); // Reset on close
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-destructive">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <IconLibrary name="alert" className="mr-2 h-5 w-5" />
            Delete User Account
          </DialogTitle>
          <DialogDescription className="pt-3 pb-2 text-foreground">
            This action will attempt to permanently delete <strong>{userEmail}</strong>. If the user
            has processed financial transactions, they will be soft-deleted instead to preserve
            compliance history.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm font-medium mb-4">
          Warning: This action cannot be undone.
        </div>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="confirm-delete">
              Type <strong>DELETE</strong> to confirm
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="border-destructive focus-visible:ring-destructive"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmed || deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Permanently Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
