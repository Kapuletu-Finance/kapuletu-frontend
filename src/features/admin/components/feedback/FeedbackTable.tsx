"use client";

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
import type { AdminFeedbackItem } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

// ─── Badge helpers ────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<AdminFeedbackItem["feedback_type"], string> = {
  bug: "Bug",
  feature_request: "Feature",
  ux_issue: "UX",
  performance: "Performance",
  general: "General",
};

const TYPE_CLASSES: Record<AdminFeedbackItem["feedback_type"], string> = {
  bug: "bg-destructive/10 text-destructive border-destructive/20",
  feature_request: "bg-refined-blue/10 text-refined-blue border-refined-blue/20",
  ux_issue: "bg-muted text-muted-foreground border-border",
  performance: "bg-burnt-amber/10 text-burnt-amber border-burnt-amber/20",
  general: "bg-muted text-muted-foreground border-border",
};

const SEVERITY_CLASSES: Record<AdminFeedbackItem["severity"], string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-burnt-amber/10 text-burnt-amber border-burnt-amber/20",
  medium: "bg-muted text-muted-foreground border-border",
  low: "bg-muted/50 text-muted-foreground border-border",
};

const STATUS_CLASSES: Record<AdminFeedbackItem["status"], string> = {
  new: "bg-primary/10 text-primary border-primary/20",
  reviewing: "bg-burnt-amber/10 text-burnt-amber border-burnt-amber/20",
  planned: "bg-refined-blue/10 text-refined-blue border-refined-blue/20",
  in_progress: "bg-burnt-amber/10 text-burnt-amber border-burnt-amber/20",
  shipped: "bg-primary/10 text-primary border-primary/20",
  declined: "bg-muted text-muted-foreground border-border",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

// ─── Star display ─────────────────────────────────────────────────────────────

const StarDisplay: React.FC<{ rating: number | null }> = ({ rating }) => {
  if (!rating) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <IconLibrary
          key={n}
          name="star"
          className={cn(
            "size-3",
            n <= rating ? "fill-primary text-primary" : "text-muted-foreground/20",
          )}
        />
      ))}
    </div>
  );
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface FeedbackTableProps {
  items: AdminFeedbackItem[];
  isLoading: boolean;
  onSelect: (item: AdminFeedbackItem) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FeedbackTable: React.FC<FeedbackTableProps> = ({
  items,
  isLoading,
  onSelect,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
          <Skeleton key={k} className="h-10 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <IconLibrary name="feedback" className="size-8 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">No feedback submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs font-semibold">Type</TableHead>
              <TableHead className="text-xs font-semibold">Area</TableHead>
              <TableHead className="text-xs font-semibold">Title</TableHead>
              <TableHead className="text-xs font-semibold">Severity</TableHead>
              <TableHead className="text-xs font-semibold">Rating</TableHead>
              <TableHead className="text-xs font-semibold">Submitted</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.feedback_id}
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => onSelect(item)}
              >
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", TYPE_CLASSES[item.feedback_type])}
                  >
                    {TYPE_LABELS[item.feedback_type]}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs capitalize text-muted-foreground">
                  {item.app_area}
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.user_name}</p>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs capitalize", SEVERITY_CLASSES[item.severity])}
                  >
                    {item.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StarDisplay rating={item.overall_rating} />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(item.created_at)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs capitalize", STATUS_CLASSES[item.status])}
                  >
                    {item.status.replace("_", " ")}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <IconLibrary name="chevron-left" className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <IconLibrary name="chevron-right" className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
