import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const CommunicationLogs = () => {
  // In a real implementation, we would fetch this from an API endpoint
  // using React Query. For now, this is the UI scaffolding.
  const logs = [
    {
      id: "1",
      channel: "EMAIL",
      destination: "user@example.com",
      subject: "Welcome to Kapuletu",
      status: "DELIVERED",
      date: "2026-09-11 10:00 AM",
    },
    {
      id: "2",
      channel: "WHATSAPP",
      destination: "+254712345678",
      subject: "Maintenance Alert",
      status: "SENT",
      date: "2026-09-11 10:05 AM",
    },
    {
      id: "3",
      channel: "EMAIL",
      destination: "invalid@domain",
      subject: "Invite",
      status: "FAILED",
      date: "2026-09-11 10:10 AM",
    },
  ];

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

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Communication Logs</h2>
        <p className="text-muted-foreground">
          Track all outgoing emails, SMS, and WhatsApp messages.
        </p>
      </div>

      <div className="rounded-md border">
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
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.channel}</TableCell>
                <TableCell>{log.destination}</TableCell>
                <TableCell>{log.subject}</TableCell>
                <TableCell>{getStatusBadge(log.status)}</TableCell>
                <TableCell className="text-muted-foreground">{log.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
