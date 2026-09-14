"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminOverviewResponse } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface RecentPaymentsProps {
  data?: AdminOverviewResponse["recent_payments"];
  isLoading: boolean;
}

export const RecentPayments: React.FC<RecentPaymentsProps> = ({ data, isLoading }) => {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short" });

  const STATUS_COLORS: Record<string, string> = {
    success: "bg-primary/10 text-primary border-primary/20",
    failed: "bg-destructive/10 text-destructive border-destructive/20",
    pending: "bg-burnt-amber/10 text-burnt-amber border-burnt-amber/20",
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Recent Payments</CardTitle>
        <Link
          href="/admin/finance"
          className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
        >
          View all <IconLibrary name="arrow-right" className="size-3" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="space-y-2 mt-2">
            {["s1", "s2", "s3", "s4", "s5"].map((k) => (
              <Skeleton key={k} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border mt-2">
            <span className="text-sm text-muted-foreground">No recent payments</span>
          </div>
        ) : (
          <div className="rounded-md border border-border mt-2 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs font-semibold">User</TableHead>
                  <TableHead className="text-xs font-semibold">Amount</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((payment) => (
                  <TableRow key={payment.payment_id}>
                    <TableCell>
                      <p className="text-xs font-medium text-foreground truncate max-w-[100px]">
                        {payment.user_name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                        {payment.plan_name}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs font-medium">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {payment.method}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase ${
                          STATUS_COLORS[payment.status] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground text-right whitespace-nowrap">
                      {formatDate(payment.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
