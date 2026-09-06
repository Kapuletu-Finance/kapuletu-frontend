"use client";

import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import IconLibrary from "@/features/shared/components/IconLibrary";
import type { TransactionOut } from "@/features/shared/types";
import { getAvatarColor } from "@/lib/colors";
import { cn, getInitials } from "@/lib/utils";

export interface TransactionDetailsDialogProps {
  item: TransactionOut | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransactionDetailsDialog: React.FC<TransactionDetailsDialogProps> = ({
  item,
  open,
  onOpenChange,
}) => {
  if (!item) return null;

  const initials = getInitials(item.name || "?");
  const avatarColor = getAvatarColor(item.name || "?");

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(item.date));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-6 bg-card border-none sm:rounded-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">Contribution Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex items-center gap-4 flex-1">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0",
                avatarColor,
              )}
            >
              {initials}
            </div>
            <div className="flex flex-col flex-1 max-w-[200px]">
              <span className="font-semibold text-base text-foreground truncate">
                {item.name || "Unknown"}
              </span>
              <span className="text-sm text-muted-foreground truncate">
                {item.sender_phone || "No phone number"}
              </span>
            </div>
          </div>

          {/* Details List */}
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-base text-foreground">
                Ksh. {item.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Payment method</span>
              <Badge
                variant="secondary"
                className="font-medium bg-secondary text-secondary-foreground"
              >
                {item.payment_method}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Transaction code</span>
              <span className="font-medium">{item.transaction_code || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Received on</span>
              <span className="font-medium">{formattedDate}</span>
            </div>
            {item.is_split && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Split Status</span>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <IconLibrary name="split" className="w-3 h-3 mr-1" />
                  Split Contribution
                </Badge>
              </div>
            )}
          </div>

          {(item.notes || item.source_evidence) && <div className="w-full h-px bg-border my-1" />}

          {/* Edit Notes Block */}
          {item.notes && (
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2 mb-1.5 text-primary font-semibold text-[10px] uppercase tracking-wider">
                <IconLibrary name="edit" className="w-3.5 h-3.5" />
                Treasurer Edit Note
              </div>
              <p className="text-sm text-foreground/90 italic leading-relaxed break-words">
                "{item.notes}"
              </p>
            </div>
          )}

          {/* Original Evidence Block */}
          {item.source_evidence && (
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-1.5 text-muted-foreground font-semibold text-[10px] uppercase tracking-wider">
                <IconLibrary name="info" className="w-3.5 h-3.5" />
                Original Evidence
              </div>
              <p className="text-xs text-foreground/80 italic leading-relaxed break-words">
                {item.source_evidence}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsDialog;
