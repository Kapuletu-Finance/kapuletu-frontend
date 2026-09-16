"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const handleAdd = () => {
    if (phone && description) {
      addTester(
        { phone_number: phone, description },
        {
          onSuccess: () => {
            setPhone("");
            setDescription("");
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end bg-card p-4 rounded-xl border border-border">
        <div className="flex-1 space-y-2 w-full">
          <label htmlFor="whitelist-phone" className="text-sm font-medium">
            Phone Number
          </label>
          <Input
            id="whitelist-phone"
            placeholder="+254700000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex-1 space-y-2 w-full">
          <label htmlFor="whitelist-desc" className="text-sm font-medium">
            Description (e.g. Beta Tester)
          </label>
          <Input
            id="whitelist-desc"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button
          onClick={handleAdd}
          disabled={isAdding || !phone || !description}
          className="w-full sm:w-auto"
        >
          <IconLibrary name="add" className="mr-2 size-4" /> Add Tester
        </Button>
      </div>

      <div className="rounded-md border border-border">
        <div className="grid grid-cols-4 gap-4 p-4 font-semibold text-muted-foreground border-b border-border">
          <div>Phone Number</div>
          <div className="col-span-2">Description</div>
          <div className="text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading whitelist...</div>
        ) : whitelist?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No users on the whitelist.</div>
        ) : (
          whitelist?.map((tester) => (
            <div
              key={tester.phone_number}
              className="grid grid-cols-4 gap-4 p-4 items-center border-b border-border last:border-0 hover:bg-muted/30"
            >
              <div className="font-medium text-foreground">{tester.phone_number}</div>
              <div className="col-span-2 text-sm text-muted-foreground">{tester.description}</div>
              <div className="text-right">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeTester(tester.phone_number)}
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
