"use client";

import { format } from "date-fns";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminBroadcastsQuery,
  useBroadcastRecipientsQuery,
} from "@/features/admin/services/queries";

export const BroadcastHistory: React.FC = () => {
  const { data: broadcasts, isLoading } = useAdminBroadcastsQuery();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const { data: recipients, isLoading: isLoadingRecipients } =
    useBroadcastRecipientsQuery(selectedCampaignId);

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

  const selectedCampaign = broadcasts.find((b) => b.id === selectedCampaignId);

  return (
    <div className="p-0">
      <div className="p-4 border-b border-border bg-muted/30 font-semibold text-sm flex items-center justify-between">
        <span>Broadcast History</span>
      </div>
      <div className="w-full">
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
              <TableRow
                key={b.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedCampaignId(b.id)}
              >
                <TableCell className="whitespace-nowrap">
                  {format(new Date(b.created_at), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="font-medium text-primary hover:underline">
                  {b.title}
                </TableCell>
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

      <Sheet
        open={selectedCampaignId !== null}
        onOpenChange={(open) => !open && setSelectedCampaignId(null)}
      >
        <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col h-full">
          <SheetHeader className="mb-4">
            <SheetTitle>Broadcast Drill-Down</SheetTitle>
            <SheetDescription>
              {selectedCampaign?.title} •{" "}
              {selectedCampaign && format(new Date(selectedCampaign.created_at), "MMM d, yyyy")}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 -mx-6 px-6">
            {isLoadingRecipients ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading delivery report...
              </div>
            ) : !recipients || recipients.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No delivery logs found for this campaign.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipients.map((r) => (
                    <TableRow key={r.log_id}>
                      <TableCell>
                        <div className="font-medium">{r.user_name}</div>
                        <div className="text-xs text-muted-foreground">{r.destination}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {r.channel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            r.status === "DELIVERED" || r.status === "SENT"
                              ? "default"
                              : r.status === "FAILED"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};
