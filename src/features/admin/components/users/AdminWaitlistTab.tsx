"use client";

import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useApproveWaitlistMutation } from "@/features/admin/services/mutations";
import { useAdminWaitlistQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const AdminWaitlistTab: React.FC = () => {
  const { data: waitlist, isLoading, isError, refetch } = useAdminWaitlistQuery();
  const { mutate: approve, isPending: isApproving } = useApproveWaitlistMutation();

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-border p-8 text-center">
        <IconLibrary name="alert" className="size-8 text-destructive/80" />
        <h3 className="text-lg font-medium">Failed to load waitlist</h3>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border">
        <div className="grid grid-cols-[40px_repeat(5,minmax(0,1fr))] gap-4 p-4 font-semibold text-muted-foreground border-b border-border">
          <div className="text-center">#</div>
          <div className="col-span-2">Name & Email</div>
          <div>Phone</div>
          <div>Joined</div>
          <div className="text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading waitlist...</div>
        ) : !waitlist?.users || waitlist.users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No users on the waitlist.</div>
        ) : (
          waitlist.users.map((user, index) => (
            <div
              key={user.user_id}
              className="grid grid-cols-[40px_repeat(5,minmax(0,1fr))] gap-4 p-4 items-center border-b border-border last:border-0 hover:bg-muted/30"
            >
              <div className="text-center font-medium text-muted-foreground">{index + 1}</div>
              <div className="col-span-2">
                <Link href={`/admin/users/${user.user_id}`} className="hover:underline">
                  <div className="font-medium text-foreground text-refined-blue">
                    {user.full_name}
                  </div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </Link>
              </div>
              <div className="text-sm">{user.phone}</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(user.created_at), "MMM d, yyyy")}
              </div>
              <div className="text-right flex justify-end gap-2">
                <Button size="sm" onClick={() => approve(user.user_id)} disabled={isApproving}>
                  <IconLibrary name="check-circle" className="mr-2 size-4" />
                  Approve
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
