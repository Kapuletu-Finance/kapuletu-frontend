import { format } from "date-fns";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BillingHistoryOut } from "@/features/auth/types";
import { useExportReceiptPdfMutation } from "@/features/finance/services/mutations";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface Props {
  history: BillingHistoryOut[];
}

export const BillingHistoryTable: React.FC<Props> = ({ history }) => {
  const exportPdf = useExportReceiptPdfMutation();

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Billing History</CardTitle>
        <CardDescription>View your past subscription payments and invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-background rounded-lg border border-border">
            <IconLibrary name="report" className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p>No billing history available.</p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((invoice) => (
                  <TableRow key={invoice.payment_id}>
                    <TableCell className="font-medium">
                      {format(new Date(invoice.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {invoice.currency} {invoice.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {invoice.payment_method || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {invoice.status === "success" ? (
                        <Badge
                          variant="default"
                          className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none border-0"
                        >
                          Paid
                        </Badge>
                      ) : invoice.status === "failed" ? (
                        <Badge
                          variant="destructive"
                          className="bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none border-0"
                        >
                          Failed
                        </Badge>
                      ) : (
                        <Badge variant="outline">{invoice.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.status === "success" && (
                        <button
                          type="button"
                          onClick={() => exportPdf.mutate(invoice.payment_id)}
                          disabled={exportPdf.isPending}
                          className="p-2 hover:bg-muted rounded-full transition-colors inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
                          title="Download Receipt"
                        >
                          {exportPdf.isPending ? (
                            <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <IconLibrary name="download" className="w-4 h-4" />
                          )}
                        </button>
                      )}
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
