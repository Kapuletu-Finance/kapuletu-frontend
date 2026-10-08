"use client";

import { format } from "date-fns";
import { FileText } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirmReportMutation } from "@/features/hr/services/mutations";
import { useEmployeeReportsQuery } from "@/features/hr/services/queries";
import type { EmployeeReport } from "@/features/hr/types";
import { formatTimeOfDay, parseDateParam } from "@/features/hr/utils";

const STATUS_VARIANT: Record<EmployeeReport["status"], "default" | "destructive" | "secondary"> = {
  confirmed: "default",
  pending_review: "secondary",
  rejected: "destructive",
};

/** End-of-shift summaries the employee submitted, with confirm / reject for pending ones. */
export const EmployeeWorkReports: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: reports, isLoading } = useEmployeeReportsQuery(userId);
  const review = useConfirmReportMutation();
  const submitted = (reports ?? []).filter((r) => r.clock_in_time);

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (submitted.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-md border border-dashed py-10 text-center text-sm text-muted-foreground">
        <FileText className="mb-3 h-8 w-8 opacity-50" />
        No daily reports submitted yet.
      </div>
    );
  }

  return (
    <div className="max-h-[32rem] space-y-3 overflow-y-auto pr-1">
      {submitted.map((report) => (
        <div
          key={report.id}
          className="flex flex-col items-start justify-between gap-3 rounded-lg border p-4 md:flex-row md:items-center"
        >
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {format(parseDateParam(report.report_date), "EEE d MMM yyyy")}
              </span>
              <Badge variant={STATUS_VARIANT[report.status]}>
                {report.status.replace("_", " ").toUpperCase()}
              </Badge>
              {report.is_late && <Badge variant="outline">Late</Badge>}
            </div>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {report.work_summary || "Shift in progress — no summary yet."}
            </p>
            <p className="text-xs text-muted-foreground">
              In {formatTimeOfDay(report.clock_in_time)} · Out{" "}
              {formatTimeOfDay(report.clock_out_time)}
              {report.admin_notes ? ` · Note: ${report.admin_notes}` : ""}
            </p>
          </div>
          {report.status === "pending_review" && report.clock_out_time && (
            <div className="flex shrink-0 gap-2">
              <Button
                size="sm"
                disabled={review.isPending}
                onClick={() => review.mutate({ reportId: report.id, status: "confirmed" })}
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={review.isPending}
                onClick={() => review.mutate({ reportId: report.id, status: "rejected" })}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
