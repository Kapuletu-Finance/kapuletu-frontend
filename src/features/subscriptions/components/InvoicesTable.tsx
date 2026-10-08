import { format } from "date-fns";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDownloadInvoicePdfMutation } from "@/features/finance/services/mutations";
import { useMyInvoicesQuery } from "@/features/finance/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { formatKes } from "@/lib/utils";

const day = (iso: string | null) => (iso ? format(new Date(iso), "d MMM yyyy") : "—");

export const InvoicesTable: React.FC = () => {
  const { data: invoices, isLoading } = useMyInvoicesQuery();
  const download = useDownloadInvoicePdfMutation();

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Invoices</CardTitle>
        <CardDescription>
          One per plan period you bought. Download any as an official PDF.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : !invoices?.length ? (
          <p className="text-center py-8 text-sm text-muted-foreground bg-background rounded-lg border border-border">
            No invoices yet. One is created when you pay for a plan.
          </p>
        ) : (
          <div className="border border-border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Plan period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.invoice_id}>
                    <TableCell>
                      <span className="font-mono text-xs">{inv.number}</span>
                      <span className="block text-xs text-muted-foreground">
                        {inv.lines.find((l) => l.description)?.description}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {inv.period_start
                        ? `${day(inv.period_start)} – ${day(inv.period_end)}`
                        : `Issued ${day(inv.issued_at)}`}
                    </TableCell>
                    <TableCell>
                      {inv.status === "paid" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0 shadow-none">
                          Paid {day(inv.paid_at)}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Awaiting payment</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatKes(inv.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() =>
                          download.mutate({ invoiceId: inv.invoice_id, number: inv.number })
                        }
                        disabled={download.isPending}
                        className="p-2 hover:bg-muted rounded-full transition-colors inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
                        aria-label={`Download invoice ${inv.number}`}
                      >
                        <IconLibrary name="download" className="w-4 h-4" />
                      </button>
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
