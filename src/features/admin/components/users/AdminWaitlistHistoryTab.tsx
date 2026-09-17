"use client";

import { useWaitlistHistoryQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const AdminWaitlistHistoryTab: React.FC = () => {
  const { data: history, isLoading, isError, refetch } = useWaitlistHistoryQuery();

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading history...</div>;
  }

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-border p-8 text-center">
        <IconLibrary name="alert" className="size-8 text-destructive/80" />
        <h3 className="text-lg font-medium">Failed to load history</h3>
        <button onClick={() => refetch()} className="border px-4 py-2 rounded-md">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {history?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No recent activity.</div>
        ) : (
          <div className="divide-y divide-border">
            {history?.map((log) => (
              <div key={log.id} className="p-4 flex gap-4 hover:bg-muted/30 transition-colors">
                <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <IconLibrary name="clock" className="size-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">{log.actor}</span>{" "}
                    <span className="text-muted-foreground">{log.action.toLowerCase()}</span>
                  </p>

                  {log.details && (
                    <div className="mt-2 text-xs bg-muted/30 p-2 rounded-md border border-border inline-block text-muted-foreground">
                      {log.details.email
                        ? `Target: ${log.details.email}`
                        : JSON.stringify(log.details)}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground/70">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
