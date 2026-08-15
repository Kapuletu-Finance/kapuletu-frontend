"use client";

import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import AddContributionFormDialog from "@/features/contributions/components/AddContributionFormDialog";
import BulkApproveDialog from "@/features/inbox/components/BulkApproveDialog";
import BulkRejectDialog from "@/features/inbox/components/BulkRejectDialog";
import InboxBulkActions from "@/features/inbox/components/InboxBulkActions";
import InboxHeaderControls, {
  type TimeFilterValue,
} from "@/features/inbox/components/InboxHeaderControls";
import InboxListRow from "@/features/inbox/components/InboxListRow";
import {
  useApproveMutation,
  useBulkApproveMutation,
  useBulkRejectMutation,
  useClearHistoryMutation,
  useRejectMutation,
  useSplitMutation,
  useUndoMutation,
} from "@/features/inbox/services/mutations";
import { usePendingInboxQuery } from "@/features/inbox/services/queries";
import EmptyState from "@/features/shared/components/EmptyState";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import { cn } from "@/lib/utils";

export const TreasurerInboxPageClient = () => {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [filter, setFilter] = useQueryState("filter", parseAsString.withDefault("this_year"));
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("pending"));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const limit = 50;
  const router = useRouter();
  const undoMutation = useUndoMutation();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkApproveOpen, setIsBulkApproveOpen] = useState(false);
  const [isBulkRejectOpen, setIsBulkRejectOpen] = useState(false);
  const [singleApproveId, setSingleApproveId] = useState<string | null>(null);
  const [singleRejectId, setSingleRejectId] = useState<string | null>(null);
  const [isClearHistoryOpen, setIsClearHistoryOpen] = useState(false);
  const clearHistoryMutation = useClearHistoryMutation();

  const { data, isLoading } = usePendingInboxQuery({
    skip: (page - 1) * limit,
    limit,
    search: search || undefined,
    filter: filter || undefined,
    status: status,
  });

  const inboxItems = data?.items ?? [];
  const totalPages = data?.total_pages ?? 1;
  const totalItems = data?.total_items ?? 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: We explicitly want to clear selections when the filters change
  React.useEffect(() => {
    setSelectedIds(new Set());
  }, [status, filter, search]);

  const handleSearchChange = React.useCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
    },
    [setSearch, setPage],
  );

  const handleFilterChange = React.useCallback(
    (value: TimeFilterValue) => {
      setFilter(value);
      setPage(1);
    },
    [setFilter, setPage],
  );

  const handleStatusChange = React.useCallback(
    (value: string) => {
      setStatus(value);
      setPage(1);
    },
    [setStatus, setPage],
  );

  const handleSelect = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const approveMutation = useApproveMutation();
  const rejectMutation = useRejectMutation();
  const bulkApproveMutation = useBulkApproveMutation();
  const bulkRejectMutation = useBulkRejectMutation();

  const handleApprove = (
    id: string,
    groupId?: string,
    campaignId?: string,
    notes?: string,
    groupSlug?: string,
    campaignSlug?: string,
  ) => {
    if (!groupId) {
      setSingleApproveId(id);
      return;
    }
    approveMutation.mutate(
      { id, data: { group_id: groupId, campaign_id: campaignId, internal_note: notes } },
      {
        onSuccess: () => {
          toast.success("Contribution approved!", {
            duration: 60000,
            closeButton: true,
            action: {
              label: "View",
              onClick: () =>
                router.push(
                  campaignId
                    ? `/treasurer/groups/${groupSlug || groupId}/campaigns/${campaignSlug || campaignId}/contributions`
                    : `/treasurer/groups/${groupSlug || groupId}/contributions`,
                ),
            },
            cancel: { label: "Undo", onClick: () => undoMutation.mutate(id) },
            classNames: {
              actionButton:
                "!bg-primary !text-primary-foreground hover:!bg-primary/90 !px-3 !py-1.5 !rounded-md !text-xs !font-semibold",
              cancelButton:
                "!bg-secondary !text-secondary-foreground hover:!bg-secondary/80 !px-3 !py-1.5 !rounded-md !text-xs !font-semibold !mr-2",
            },
          });
        },
      },
    );
  };

  const splitMutation = useSplitMutation();
  const handleSplit = (
    id: string,
    groupId: string,
    campaignId: string | undefined,
    allocations: { name: string; amount: number }[],
    notes?: string,
    groupSlug?: string,
    campaignSlug?: string,
  ) => {
    splitMutation.mutate(
      {
        id,
        data: { group_id: groupId, campaign_id: campaignId, allocations, internal_note: notes },
      },
      {
        onSuccess: () => {
          toast.success("Contribution split successfully!", {
            duration: 60000,
            closeButton: true,
            action: {
              label: "View",
              onClick: () =>
                router.push(
                  campaignId
                    ? `/treasurer/groups/${groupSlug || groupId}/campaigns/${campaignSlug || campaignId}/contributions`
                    : `/treasurer/groups/${groupSlug || groupId}/contributions`,
                ),
            },
            cancel: { label: "Undo", onClick: () => undoMutation.mutate(id) },
            classNames: {
              actionButton:
                "!bg-primary !text-primary-foreground hover:!bg-primary/90 !px-3 !py-1.5 !rounded-md !text-xs !font-semibold",
              cancelButton:
                "!bg-secondary !text-secondary-foreground hover:!bg-secondary/80 !px-3 !py-1.5 !rounded-md !text-xs !font-semibold !mr-2",
            },
          });
        },
      },
    );
  };

  const handleReject = (id: string) => {
    setSingleRejectId(id);
  };

  const handleBulkApprove = (groupId: string, campaignId?: string) => {
    bulkApproveMutation.mutate(
      { pending_ids: Array.from(selectedIds), group_id: groupId, campaign_id: campaignId },
      {
        onSuccess: () => {
          setSelectedIds(new Set());
        },
      },
    );
  };

  const handleBulkReject = () => {
    bulkRejectMutation.mutate(
      { pending_ids: Array.from(selectedIds) },
      {
        onSuccess: () => {
          setSelectedIds(new Set());
        },
      },
    );
  };

  return (
    <PageLayout
      title={`Inbox (${totalItems})`}
      subtitle="Review new contributions before adding them to your records"
      actionButton={
        <AddContributionFormDialog>
          <Button className="gap-2">
            <IconLibrary name="add" className="w-4 h-4" />
            Add a contribution
          </Button>
        </AddContributionFormDialog>
      }
      controls={
        <InboxHeaderControls
          searchValue={search}
          filterValue={filter as TimeFilterValue}
          statusValue={status}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onStatusChange={handleStatusChange}
        />
      }
      pagination={
        totalPages > 1 ? (
          <div className="flex justify-center items-center gap-2 pt-6">
            <Button
              variant="outline"
              size="icon"
              className="text-muted-foreground"
              disabled={page === 1}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              <IconLibrary name="chevron-left" className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
              <Button
                key={String(i + 1)}
                variant={page === i + 1 ? "default" : "outline"}
                size="icon"
                className={cn(
                  "font-semibold shadow-sm",
                  page !== i + 1 && "text-foreground font-medium",
                )}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="text-muted-foreground"
              disabled={page >= totalPages}
              onClick={() => setPage(Math.min(totalPages, page + 1))}
            >
              <IconLibrary name="chevron-right" className="w-4 h-4" />
            </Button>
          </div>
        ) : undefined
      }
    >
      <div className="w-full overflow-x-auto pb-4 mt-6">
        <div className="flex flex-col min-w-[1000px] bg-card rounded-xl border border-border">
          {status === "pending" ? (
            <InboxBulkActions
              selectedCount={selectedIds.size}
              onClearSelection={() => setSelectedIds(new Set())}
              onApproveAll={() => setIsBulkApproveOpen(true)}
              onRejectAll={() => setIsBulkRejectOpen(true)}
            />
          ) : (
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
              <span className="text-sm font-medium text-muted-foreground">
                {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Processed History"}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive gap-2"
                onClick={() => setIsClearHistoryOpen(true)}
              >
                <IconLibrary name="trash" className="w-4 h-4" />
                Clear History
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col w-full">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 py-4 px-4 border-b border-border">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex flex-col gap-2 w-32">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-4 w-24 ml-4" />
                  <Skeleton className="h-4 w-32 ml-4" />
                  <Skeleton className="h-4 w-24 ml-4" />
                  <Skeleton className="h-6 w-16 rounded-full ml-4" />
                  <div className="ml-auto flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : inboxItems.length > 0 ? (
            <div className="flex flex-col w-full">
              {inboxItems.map((item) => (
                <InboxListRow
                  key={item.pending_id}
                  item={item}
                  isSelected={selectedIds.has(item.pending_id)}
                  onSelect={handleSelect}
                  onApprove={handleApprove}
                  onSplit={handleSplit}
                  onReject={handleReject}
                />
              ))}
            </div>
          ) : (
            <div className="py-16">
              <EmptyState message="No new inbox items found." />
            </div>
          )}
        </div>
      </div>

      <BulkApproveDialog
        open={isBulkApproveOpen || singleApproveId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsBulkApproveOpen(false);
            setSingleApproveId(null);
          }
        }}
        selectedCount={singleApproveId ? 1 : selectedIds.size}
        onConfirm={(groupId, campaignId?: string, groupSlug?: string, campaignSlug?: string) => {
          if (singleApproveId) {
            approveMutation.mutate(
              { id: singleApproveId, data: { group_id: groupId, campaign_id: campaignId } },
              {
                onSuccess: () => {
                  toast.success("Contribution approved!", {
                    duration: 60000,
                    closeButton: true,
                    action: {
                      label: "View",
                      onClick: () =>
                        router.push(
                          campaignId
                            ? `/treasurer/groups/${groupSlug || groupId}/campaigns/${campaignSlug || campaignId}/contributions`
                            : `/treasurer/groups/${groupSlug || groupId}/contributions`,
                        ),
                    },
                    cancel: { label: "Undo", onClick: () => undoMutation.mutate(singleApproveId) },
                    classNames: {
                      actionButton:
                        "!bg-primary !text-primary-foreground hover:!bg-primary/90 !px-3 !py-1.5 !rounded-md !text-xs !font-semibold",
                      cancelButton:
                        "!bg-secondary !text-secondary-foreground hover:!bg-secondary/80 !px-3 !py-1.5 !rounded-md !text-xs !font-semibold !mr-2",
                    },
                  });
                  setSingleApproveId(null);
                },
              },
            );
          } else {
            handleBulkApprove(groupId, campaignId);
          }
        }}
      />

      <BulkRejectDialog
        open={isBulkRejectOpen || singleRejectId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsBulkRejectOpen(false);
            setSingleRejectId(null);
          }
        }}
        selectedCount={singleRejectId ? 1 : selectedIds.size}
        onConfirm={() => {
          if (singleRejectId) {
            rejectMutation.mutate(singleRejectId, {
              onSuccess: () => {
                toast.success("Contribution rejected!", {
                  duration: 60000,
                  closeButton: true,
                  cancel: { label: "Undo", onClick: () => undoMutation.mutate(singleRejectId) },
                  classNames: {
                    cancelButton:
                      "!bg-secondary !text-secondary-foreground hover:!bg-secondary/80 !px-3 !py-1.5 !rounded-md !text-xs !font-semibold",
                  },
                });
                setSingleRejectId(null);
              },
            });
          } else {
            handleBulkReject();
          }
        }}
      />

      <Dialog open={isClearHistoryOpen} onOpenChange={setIsClearHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear History</DialogTitle>
            <DialogDescription>
              This will clear the selected records from your inbox history. Note: This action does
              not delete the actual contributions from your financial ledger.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClearHistoryOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={clearHistoryMutation.isPending}
              onClick={() => {
                const pending_ids = selectedIds.size > 0 ? Array.from(selectedIds) : undefined;
                clearHistoryMutation.mutate(
                  { pending_ids },
                  {
                    onSuccess: () => {
                      setIsClearHistoryOpen(false);
                      setSelectedIds(new Set());
                    },
                  },
                );
              }}
            >
              {clearHistoryMutation.isPending
                ? "Clearing..."
                : selectedIds.size > 0
                  ? `Clear ${selectedIds.size} Records`
                  : "Clear All History"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default TreasurerInboxPageClient;
