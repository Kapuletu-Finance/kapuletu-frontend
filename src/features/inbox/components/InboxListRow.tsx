import type * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ContributionDetailsDialog from "@/features/inbox/components/ContributionDetailsDialog";
import IconLibrary from "@/features/shared/components/IconLibrary";
import type { PendingInboxOut } from "@/features/shared/types";
import { getAvatarColor } from "@/lib/colors";
import { cn } from "@/lib/utils";

export interface InboxListRowProps {
  item: PendingInboxOut;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onApprove: (id: string, groupId?: string, campaignId?: string, notes?: string) => void;
  onSplit: (id: string, groupId: string, campaignId: string | undefined, allocations: { name: string; amount: number }[], notes?: string) => void;
  onReject: (id: string) => void;
}

export const InboxListRow: React.FC<InboxListRowProps> = ({
  item,
  isSelected,
  onSelect,
  onApprove,
  onSplit,
  onReject,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const initials = (item.sender_name || "?").substring(0, 2).toUpperCase();
  const avatarColor = getAvatarColor(item.sender_name || "?");

  const isMpesa = item.inbox_code !== null;
  const paymentMethod = isMpesa ? "M-pesa" : "Cash";
  const amount = item.amount ? `Ksh. ${item.amount.toLocaleString()}` : "Unknown";

  return (
    <div className="flex flex-col xl:flex-row xl:items-center gap-4 py-4 px-2 border-b border-border hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(item.pending_id, checked === true)}
        />

        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm",
            avatarColor,
          )}
        >
          {initials}
        </div>

        <button
          type="button"
          className="flex flex-col min-w-0 w-48 shrink-0 cursor-pointer hover:underline decoration-muted-foreground underline-offset-4 text-left bg-transparent border-none p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          onClick={() => setIsDialogOpen(true)}
        >
          <span className="font-semibold text-sm text-foreground truncate w-full">
            {item.sender_name || "Unknown Sender"}
          </span>
          <span className="text-xs text-muted-foreground truncate w-full">
            {item.sender_phone || "No phone number"}
          </span>
        </button>

        <div className="w-24 shrink-0 font-medium text-sm">{amount}</div>

        <div className="w-48 shrink-0 text-muted-foreground text-sm">
          {new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(item.created_at))}
        </div>

        <div className="w-32 shrink-0 truncate text-muted-foreground text-sm">
          {item.purpose || "No associated group"}
        </div>

        <div className="w-20 shrink-0">
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              isMpesa
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
            )}
          >
            {paymentMethod}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 justify-end w-full xl:w-auto">
        <Button
          variant="default"
          size="sm"
          onClick={() => onApprove(item.pending_id)}
          className="bg-primary hover:bg-primary/90 gap-1.5"
        >
          <IconLibrary name="check" className="w-4 h-4" />
          Approve
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReject(item.pending_id)}
          className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive gap-1.5"
        >
          <IconLibrary name="close" className="w-4 h-4" />
          Reject
        </Button>

      </div>

      <ContributionDetailsDialog
        item={item}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onApprove={(id, groupId, campaignId, notes) => onApprove(id, groupId, campaignId, notes)}
        onSplit={onSplit}
        onReject={onReject}
      />
    </div>
  );
};

export default InboxListRow;
