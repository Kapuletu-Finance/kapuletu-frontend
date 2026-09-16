"use client";

import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUnblockWhatsAppNumberMutation } from "@/features/admin/services/mutations";
import { useAdminWhatsAppBlocklistQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const AdminBlocklistTab: React.FC = () => {
  const [page, _setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useAdminWhatsAppBlocklistQuery({ page, limit: 50 });
  const { mutate: unblock, isPending: isUnblocking } = useUnblockWhatsAppNumberMutation();

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-border p-8 text-center">
        <IconLibrary name="alert" className="size-8 text-destructive/80" />
        <h3 className="text-lg font-medium">Failed to load blocklist</h3>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border">
        <div className="grid grid-cols-4 gap-4 p-4 font-semibold text-muted-foreground border-b border-border">
          <div>Phone Number</div>
          <div>Attempts / Status</div>
          <div>Last Attempt</div>
          <div className="text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading blocklist...</div>
        ) : !data?.items || data.items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No numbers in the blocklist.</div>
        ) : (
          data.items.map((item) => (
            <div
              key={item.phone_number}
              className="grid grid-cols-4 gap-4 p-4 items-center border-b border-border last:border-0 hover:bg-muted/30"
            >
              <div className="font-medium text-foreground">{item.phone_number}</div>
              <div>
                <div className="text-sm">{item.attempt_count} attempts</div>
                <div
                  className={`text-xs font-medium ${item.is_blocked ? "text-destructive" : "text-amber-500"}`}
                >
                  {item.is_blocked ? "Blocked" : "Warning"}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.last_attempt_at
                  ? format(new Date(item.last_attempt_at), "MMM d, yyyy h:mm a")
                  : "-"}
              </div>
              <div className="text-right flex justify-end gap-2">
                <Button
                  size="sm"
                  onClick={() => unblock(item.phone_number)}
                  disabled={isUnblocking}
                >
                  <IconLibrary name="check-circle" className="mr-2 size-4" />
                  Unblock
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
