"use client";

import React, { useState } from "react";
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
import type { AuditLogItem } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

interface AuditLogTableProps {
  logs: AuditLogItem[];
  isLoading: boolean;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs, isLoading }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (logId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(logId)) next.delete(logId);
      else next.add(logId);
      return next;
    });
  };

  const formatDate = (iso: string) => {
    if (!iso) return "Unknown";
    return new Date(iso).toLocaleString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getLogStyle = (entityType: string, action: string) => {
    if (entityType === "system" && action === "server_crash") {
      return {
        badge: "bg-destructive/10 text-destructive border-destructive/20",
        icon: "bug" as const,
        iconColor: "text-destructive",
      };
    }
    if (entityType === "system") {
      return {
        badge: "bg-muted text-muted-foreground border-border",
        icon: "audit" as const,
        iconColor: "text-muted-foreground",
      };
    }
    return {
      badge: "bg-primary/10 text-primary border-primary/20",
      icon: "user" as const,
      iconColor: "text-primary",
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-2 mt-4">
        {["s1", "s2", "s3", "s4", "s5"].map((k) => (
          <Skeleton key={k} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border mt-4">
        <span className="text-sm text-muted-foreground">No audit logs found.</span>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border mt-4 overflow-hidden bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="font-semibold">Timestamp</TableHead>
            <TableHead className="font-semibold">Actor</TableHead>
            <TableHead className="font-semibold">Action</TableHead>
            <TableHead className="font-semibold">Target</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const isExpanded = expandedRows.has(log.log_id);
            const style = getLogStyle(log.entity_type, log.action);

            return (
              <React.Fragment key={log.log_id}>
                <TableRow
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-muted/50",
                    isExpanded && "bg-muted/30",
                  )}
                  onClick={() => toggleRow(log.log_id)}
                >
                  <TableCell className="p-2 text-center">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-transparent">
                      <IconLibrary
                        name={isExpanded ? "chevron-down" : "chevron-right"}
                        className="h-4 w-4 text-muted-foreground"
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IconLibrary name={style.icon} className={cn("h-4 w-4", style.iconColor)} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.actor_name}</p>
                        {log.actor_email && (
                          <p className="text-xs text-muted-foreground">{log.actor_email}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-mono uppercase", style.badge)}
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-foreground uppercase">
                      {log.entity_type}
                    </p>
                    {log.entity_id && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {log.entity_id.split("-")[0]}...
                      </p>
                    )}
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow className="bg-muted/10 hover:bg-muted/10">
                    <TableCell colSpan={5} className="p-0 border-b">
                      <div className="p-4 pl-12 border-l-2 border-l-primary/30 bg-muted/20">
                        <pre className="text-xs font-mono text-foreground whitespace-pre-wrap rounded-md bg-background border border-border p-4 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
