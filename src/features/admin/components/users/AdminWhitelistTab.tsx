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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAddWhitelistMutation,
  useRemoveWhitelistMutation,
} from "@/features/admin/services/mutations";
import { useAdminWhitelistQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const AdminWhitelistTab: React.FC = () => {
  const { data: whitelist, isLoading, isError, refetch } = useAdminWhitelistQuery();
  const { mutate: addTester, isPending: isAdding } = useAddWhitelistMutation();
  const { mutate: removeTester, isPending: isRemoving } = useRemoveWhitelistMutation();

  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAdd = () => {
    if (phone && description) {
      addTester(
        { phone_number: phone, description, name, email },
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button />}>
            <IconLibrary name="add" className="mr-2 size-4" /> Add Tester
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Beta Tester</DialogTitle>
              <DialogDescription>
                Add a new tester to the whitelist. Their phone number or email will allow them to
                bypass sign-up restrictions.
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
                <Label htmlFor="tester-email">Email (Optional)</Label>
                <Input
                  id="tester-email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tester-phone">Phone Number *</Label>
                <Input
                  id="tester-phone"
                  placeholder="+254700000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tester-desc">Description *</Label>
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
              <Button onClick={handleAdd} disabled={isAdding || !phone || !description}>
                {isAdding ? "Adding..." : "Save Tester"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-border">
        <div className="grid grid-cols-4 gap-4 p-4 font-semibold text-muted-foreground border-b border-border bg-muted/20">
          <div>Identifier</div>
          <div className="col-span-2">Details</div>
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
              className="grid grid-cols-4 gap-4 p-4 items-center border-b border-border last:border-0 hover:bg-muted/30"
            >
              <div className="font-medium text-foreground">
                {tester.identifier}
                <span className="ml-2 text-xs text-muted-foreground uppercase">
                  ({tester.identifier_type})
                </span>
              </div>
              <div className="col-span-2 flex flex-col justify-center">
                <span className="text-sm font-medium text-foreground">
                  {tester.name || "Unnamed"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tester.description || "No description provided"}
                </span>
              </div>
              <div className="text-right">
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
    </div>
  );
};
