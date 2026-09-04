"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApproveFeedbackMutation } from "@/features/admin/services/mutations";
import { useAIFeedbackQueueQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const FeedbackQueueTab: React.FC = () => {
  const { data: queue, isLoading } = useAIFeedbackQueueQuery();
  const { mutate: reviewFeedback, isPending } = useApproveFeedbackMutation();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!queue || queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-xl bg-background/50">
        <IconLibrary
          name="check-circle"
          className="h-12 w-12 text-muted-foreground mb-4 opacity-50"
        />
        <h3 className="text-lg font-semibold text-foreground">Inbox Zero</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
          There are no pending AI corrections from treasurers. The model is parsing perfectly!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-background overflow-hidden">
        <ScrollArea orientation="horizontal" className="w-full">
          <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Treasurer ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queue.map((item) => {
              const isExpanded = expandedRow === item.feedback_id;

              return (
                <React.Fragment key={item.feedback_id}>
                  <TableRow
                    className="cursor-pointer hover:bg-muted/20"
                    onClick={() => setExpandedRow(isExpanded ? null : item.feedback_id)}
                  >
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-transparent"
                      >
                        <IconLibrary
                          name={isExpanded ? "chevron-down" : "chevron-right"}
                          className="h-4 w-4 text-muted-foreground"
                        />
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {new Date(item.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {item.user_id.split("-")[0]}...
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-500 border-amber-500/20"
                      >
                        Pending Review
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        disabled={isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          reviewFeedback({ feedbackId: item.feedback_id, approve: false });
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="h-8"
                        disabled={isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          reviewFeedback({ feedbackId: item.feedback_id, approve: true });
                        }}
                      >
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow className="bg-muted/10">
                      <TableCell colSpan={5} className="p-0 border-b">
                        <div className="p-4 grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-destructive flex items-center gap-2">
                              <IconLibrary name="close" className="h-4 w-4" /> Original Parsed Data
                            </h4>
                            <ScrollArea orientation="horizontal" className="w-full bg-destructive/5 border border-destructive/10 rounded-md">
                              <pre className="text-xs text-destructive-foreground p-4">
                                {JSON.stringify(item.original, null, 2)}
                              </pre>
                            </ScrollArea>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-emerald-500 flex items-center gap-2">
                              <IconLibrary name="check-circle" className="h-4 w-4" /> Corrected
                              Ground Truth
                            </h4>
                            <ScrollArea orientation="horizontal" className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-md">
                              <pre className="text-xs text-emerald-500 p-4">
                                {JSON.stringify(item.corrected, null, 2)}
                              </pre>
                            </ScrollArea>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
        </ScrollArea>
      </div>
    </div>
  );
};
