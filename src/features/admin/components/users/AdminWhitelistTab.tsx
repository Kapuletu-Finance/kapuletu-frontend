"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import {
  useAddWhitelistMutation,
  useRemoveWhitelistMutation,
  useSendWhitelistInviteMutation,
} from "@/features/admin/services/mutations";
import { useAdminWhitelistQuery, type WhitelistItem } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const AdminWhitelistTab: React.FC = () => {
  const { data: whitelist, isLoading, isError, refetch } = useAdminWhitelistQuery();
  const { mutate: addTester, isPending: isAdding } = useAddWhitelistMutation();
  const { mutate: removeTester, isPending: isRemoving } = useRemoveWhitelistMutation();
  const { mutate: sendInvite, isPending: isSendingInvite } = useSendWhitelistInviteMutation();

  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTester, setSelectedTester] = useState<WhitelistItem | null>(null);

  const handleAdd = () => {
    if (phone && email) {
      addTester(
        { phone_number: phone, email, description, name },
        {
          onSuccess: () => {
            setPhone("");
            setDescription("");
            setName("");
            setEmail("");
            setIsDialogOpen(false);
          },
        },
      );
    }
  };

  const handleSendInvite = (testerId: string) => {
    sendInvite(testerId, {
      onSuccess: () => {
        setSelectedTester(null);
      },
    });
  };

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-border p-8 text-center">
        <IconLibrary name="alert" className="size-8 text-destructive/80" />
        <h3 className="text-lg font-medium">Failed to load whitelist</h3>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>
          <IconLibrary name="add" className="mr-2 size-4" /> Add Tester
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Beta Tester</DialogTitle>
              <DialogDescription>
                Add a new tester to the whitelist. Both phone number and email are required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tester-name">Full Name (Optional)</Label>
                <Input
                  id="tester-name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tester-phone">Phone Number (Primary) *</Label>
                <Input
                  id="tester-phone"
                  placeholder="+254700000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tester-email">Email (For Invitations) *</Label>
                <Input
                  id="tester-email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tester-desc">Description</Label>
                <Input
                  id="tester-desc"
                  placeholder="e.g. Early Beta Tester"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={isAdding || !phone || !email}>
                {isAdding ? "Adding..." : "Save Tester"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-border">
        <div className="grid grid-cols-6 gap-4 p-4 font-semibold text-muted-foreground border-b border-border bg-muted/20 text-sm">
          <div>Name</div>
          <div className="col-span-2">Contact Details</div>
          <div>Description</div>
          <div>Invite Status</div>
          <div className="text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading whitelist...</div>
        ) : whitelist?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No users on the whitelist.</div>
        ) : (
          whitelist?.map((tester) => (
            <div
              key={tester.id}
              className="grid grid-cols-6 gap-4 p-4 items-center border-b border-border last:border-0 hover:bg-muted/30 text-sm"
            >
              <div className="font-medium text-foreground">{tester.name || "Unnamed"}</div>
              <div className="col-span-2 flex flex-col justify-center">
                <span className="text-foreground">{tester.phone_number}</span>
                <span className="text-xs text-muted-foreground">{tester.email}</span>
              </div>
              <div className="text-muted-foreground">{tester.description || "—"}</div>
              <div>
                {tester.invite_sent ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                    <IconLibrary name="check" className="size-3" /> Sent
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                    Pending
                  </span>
                )}
              </div>
              <div className="text-right flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={tester.invite_sent}
                  onClick={() => setSelectedTester(tester)}
                >
                  <IconLibrary name="mail" className="mr-1.5 size-3.5" />
                  {tester.invite_sent ? "Invited" : "Invite"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeTester(tester.id)}
                  disabled={isRemoving}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invite Modal */}
      <Dialog open={!!selectedTester} onOpenChange={(open) => !open && setSelectedTester(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Send Invitation</DialogTitle>
            <DialogDescription>Send a one-time signup link to this beta tester.</DialogDescription>
          </DialogHeader>
          {selectedTester && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-border p-4 bg-muted/20">
                <div className="mb-1 text-sm font-medium">To:</div>
                <div className="text-sm text-muted-foreground">{selectedTester.email}</div>
                <div className="mt-2 mb-1 text-sm font-medium">Name:</div>
                <div className="text-sm text-muted-foreground">
                  {selectedTester.name || "Unnamed"}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Personal Message (optional)</Label>
                <div className="rounded-md border border-border p-3 text-sm text-muted-foreground bg-background">
                  Dear {selectedTester.name || "Tester"}, you have been selected as an early
                  KapuLetu Beta Tester. Click the link below to create your account...
                </div>
              </div>

              <div className="rounded-md bg-blue-500/10 p-3 text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                <IconLibrary name="info" className="mt-0.5 size-4 shrink-0" />
                <p>
                  A secure one-time signup link valid for 7 days will be included automatically.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTester(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedTester && handleSendInvite(selectedTester.id)}
              disabled={isSendingInvite}
            >
              {isSendingInvite ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
