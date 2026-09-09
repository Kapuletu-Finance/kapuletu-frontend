"use client";

import { format } from "date-fns";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminBroadcastsQuery } from "@/features/admin/services/queries";

export const BroadcastHistory: React.FC = () => {
  const { data: broadcasts, isLoading } = useAdminBroadcastsQuery();

  if (isLoading) {
    return <div className="p-4 text-center">Loading broadcast history...</div>;
  }

  if (!broadcasts || broadcasts.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg border shadow-sm text-center">
        <p className="text-muted-foreground">No broadcasts sent yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Broadcast History</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {broadcasts.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(b.created_at), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="font-medium">{b.title}</TableCell>
                <TableCell className="capitalize">{b.target_audience.replace("_", " ")}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {b.channels.map((c) => (
                      <Badge key={c} variant="outline" className="text-xs capitalize">
                        {c.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{b.recipients_count}</TableCell>
                <TableCell>
                  <Badge variant={b.status === "sent" ? "default" : "secondary"}>{b.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
