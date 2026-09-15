import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCommunicationLogsQuery } from "@/features/admin/services/queries";

export const CommunicationLogs = () => {
  const { data, isLoading, isError } = useCommunicationLogsQuery(1, 50);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
      case "SENT":
        return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
      case "FAILED":
        return <Badge variant="destructive">{status}</Badge>;
      case "QUEUED":
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32 border border-border rounded-xl bg-card">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center h-32 border border-border rounded-xl bg-card text-destructive">
        Failed to load communication logs.
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm flex flex-col">
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No communication logs found.
                </TableCell>
              </TableRow>
            ) : (
              data.logs.map((log) => (
                <TableRow key={log.log_id}>
                  <TableCell className="font-medium">{log.channel}</TableCell>
                  <TableCell>{log.destination}</TableCell>
                  <TableCell>{log.subject || "No Subject"}</TableCell>
                  <TableCell>
                    {getStatusBadge(log.status)}
                    {log.error_message && (
                      <div
                        className="text-xs text-destructive mt-1 max-w-[200px] truncate"
                        title={log.error_message}
                      >
                        {log.error_message}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(log.created_at), "PPp")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
