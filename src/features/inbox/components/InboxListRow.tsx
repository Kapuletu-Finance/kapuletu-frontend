import Link from "next/link";
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
  onApprove: (
    id: string,
    groupId?: string,
    campaignId?: string,
    notes?: string,
    groupSlug?: string,
    campaignSlug?: string,
  ) => void;
  onSplit: (
    id: string,
    groupId: string,
    campaignId: string | undefined,
    allocations: { name: string; amount: number }[],
    notes?: string,
    groupSlug?: string,
    campaignSlug?: string,
  ) => void;
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

  const isMpesa = item.transaction_code !== null;
  const paymentMethod = isMpesa ? "M-pesa" : "Cash";
  const amount = item.amount ? `Ksh. ${item.amount.toLocaleString()}` : "Unknown";

  const rawDateStr = item.processed_at || item.created_at;
  // Fallback to Z (UTC) if backend returns naive ISO string
  const dateStr =
    rawDateStr.endsWith("Z") || rawDateStr.includes("+") ? rawDateStr : `${rawDateStr}Z`;

  return (
    <>
      {/* biome-ignore lint/a11y/useSemanticElements: This row contains interactive child elements so it cannot be a native button */}
      <div
        className="flex items-center gap-4 py-4 px-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setIsDialogOpen(true)}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-4 flex-1">
          {item.workflow_status === "pending" ? (
            // biome-ignore lint/a11y/noStaticElementInteractions: Need to stop propagation for checkbox inside clickable row
            <div
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              role="presentation"
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect(item.pending_id, checked === true)}
              />
            </div>
          ) : (
            <div className="w-4 h-4 shrink-0" />
          )}

          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm",
              avatarColor,
            )}
          >
            {initials}
          </div>

          <div className="flex flex-col min-w-0 w-48 shrink-0 text-left">
            <span className="font-semibold text-sm text-foreground truncate w-full">
              {item.sender_name || "Unknown Sender"}
            </span>
            <span className="text-xs text-muted-foreground truncate w-full">
              {item.sender_phone || "No phone number"}
            </span>
          </div>

          <div className="w-24 shrink-0 font-medium text-sm">{amount}</div>

          <div className="w-48 shrink-0 text-muted-foreground text-sm">
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }).format(new Date(dateStr))}
          </div>

          <div className="w-32 shrink-0 truncate text-sm">
            {item.assigned_group_name ? (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Link
                  href={
                    item.assigned_group_slug
                      ? `/treasurer/groups/${item.assigned_group_slug}/overview`
                      : `/treasurer/groups/${item.assigned_group_id}/overview`
                  }
                  className="hover:text-primary transition-colors font-medium truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.assigned_group_name}
                </Link>
                {item.assigned_campaign_name && (
                  <>
                    <span>/</span>
                    <Link
                      href={
                        item.assigned_group_slug && item.assigned_campaign_slug
                          ? `/treasurer/groups/${item.assigned_group_slug}/campaigns/${item.assigned_campaign_slug}/contributions`
                          : `/treasurer/groups/${item.assigned_group_id}/campaigns/${item.assigned_campaign_id}/contributions`
                      }
                      className="hover:text-primary transition-colors font-medium truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.assigned_campaign_name}
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">{item.purpose || "No associated group"}</span>
            )}
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

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {item.workflow_status === "pending" ? (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDialogOpen(true);
                }}
                className="bg-primary hover:bg-primary/90 gap-1.5"
              >
                <IconLibrary name="check" className="w-4 h-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(item.pending_id);
                }}
                className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive gap-1.5"
              >
                <IconLibrary name="close" className="w-4 h-4" />
                Reject
              </Button>
            </>
          ) : (
            <div
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider min-w-[120px] text-center border",
                item.workflow_status === "approved" &&
                  "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
                item.workflow_status === "split_approved" &&
                  "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30",
                item.workflow_status === "rejected" &&
                  "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30",
              )}
            >
              {item.workflow_status === "approved" && "Approved"}
              {item.workflow_status === "split_approved" && "Split & Approved"}
              {item.workflow_status === "rejected" && "Rejected"}
            </div>
          )}
        </div>
      </div>

      <ContributionDetailsDialog
        item={item}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onApprove={(id, groupId, campaignId, notes, groupSlug, campaignSlug) =>
          onApprove(id, groupId, campaignId, notes, groupSlug, campaignSlug)
        }
        onSplit={onSplit}
        onReject={onReject}
      />
    </>
  );
};

export default InboxListRow;
