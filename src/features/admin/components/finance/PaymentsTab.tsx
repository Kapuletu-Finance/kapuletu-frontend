"use client";
import { format } from "date-fns";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminFinancePaymentsQuery } from "@/features/admin/services/queries";
import { formatKes } from "@/lib/utils";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Undo2 } from "lucide-react";
import { useProcessRefundMutation } from "@/features/admin/services/mutations";

export const PaymentsTab: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAdminFinancePaymentsQuery(page);
  const refundMutation = useProcessRefundMutation();

  if (error) {
    return <div className="text-destructive">Failed to load payments.</div>;
  }

  const handleRefund = (paymentId: string) => {
    if (confirm("Are you sure you want to process a refund for this transaction?")) {
      refundMutation.mutate({ paymentId, reason: "Admin requested refund" });
    }
  };

  const getStatusVariant = (
    status: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "success":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getMethodBadge = (method: string, type?: string) => {
    if (type === "refund") {
      return (
        <Badge variant="outline" className="border-red-600 text-red-600 bg-red-50">
          Refund
        </Badge>
      );
    }
    if (!method) return null;
    const m = method.toLowerCase();
    if (m.includes("mpesa"))
      return (
        <Badge variant="outline" className="border-green-600 text-green-600 bg-green-50">
          M-PESA
        </Badge>
      );
    if (m.includes("card"))
      return (
        <Badge variant="outline" className="border-blue-600 text-blue-600 bg-blue-50">
          Card
        </Badge>
      );
    if (m.includes("override"))
      return (
        <Badge variant="outline" className="border-purple-600 text-purple-600 bg-purple-50">
          Override
        </Badge>
      );
    return <Badge variant="outline">{method}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                <TableRow key={`skeleton-payment-${i}`}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((payment) => (
                <TableRow key={payment.payment_id}>
                  <TableCell className="whitespace-nowrap">
                    {payment.created_at
                      ? format(new Date(payment.created_at), "MMM d, yyyy HH:mm")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{payment.user_name}</TableCell>
                  <TableCell>{payment.plan_name}</TableCell>
                  <TableCell className={`font-medium ${payment.amount < 0 ? 'text-destructive' : ''}`}>
                    {formatKes(payment.amount)}
                  </TableCell>
                  <TableCell>{getMethodBadge(payment.method, (payment as any).transaction_type)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-muted">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleRefund(payment.payment_id)}
                          disabled={payment.status !== "success" || payment.amount <= 0 || refundMutation.isPending}
                          className="text-destructive focus:text-destructive"
                        >
                          <Undo2 className="mr-2 h-4 w-4" />
                          Process Refund
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {data && data.total > data.limit && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {page} of {Math.ceil(data.total / data.limit)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(data.total / data.limit)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
