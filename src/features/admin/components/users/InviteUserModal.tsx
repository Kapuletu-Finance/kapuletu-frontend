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
import { useSendInviteMutation } from "@/features/admin/services/mutations";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface InviteUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onOpenChange }) => {
  const [email, setEmail] = useState("");
  const { mutate: sendInvite, isPending } = useSendInviteMutation();

  const handleSend = () => {
    if (!email) return;
    sendInvite(
      { email },
      {
        onSuccess: () => {
          setEmail("");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite a User</DialogTitle>
          <DialogDescription>
            Send a professionally branded invitation to a user. This allows them to bypass closed
            signups.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. jdoe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isPending || !email}>
            {isPending && <IconLibrary name="loading" className="mr-2 size-4" />}
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
