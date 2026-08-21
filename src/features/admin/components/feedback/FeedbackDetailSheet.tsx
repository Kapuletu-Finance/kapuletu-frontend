"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateFeedbackMutation } from "@/features/admin/services/mutations";
import type { AdminFeedbackItem } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<AdminFeedbackItem["feedback_type"], string> = {
  bug: "Bug Report",
  feature_request: "Feature Request",
  ux_issue: "UI / UX Issue",
  performance: "Performance",
  general: "General",
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

const STATUS_OPTIONS: { value: AdminFeedbackItem["status"]; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "shipped", label: "Shipped" },
  { value: "declined", label: "Declined" },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const StarDisplay: React.FC<{ rating: number | null }> = ({ rating }) => {
  if (!rating) return <span className="text-sm text-muted-foreground">No rating provided</span>;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <IconLibrary
          key={n}
          name="star"
          className={cn(
            "size-4",
            n <= rating ? "fill-primary text-primary" : "text-muted-foreground/20",
          )}
        />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">
        {["", "Poor", "Fair", "Average", "Good", "Excellent"][rating]}
      </span>
    </div>
  );
};

// ─── Section block ────────────────────────────────────────────────────────────

const Section: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    <div className="text-sm text-foreground">{children}</div>
  </div>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface FeedbackDetailSheetProps {
  item: AdminFeedbackItem | null;
  open: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FeedbackDetailSheet: React.FC<FeedbackDetailSheetProps> = ({
  item,
  open,
  onClose,
}) => {
  const [status, setStatus] = useState<AdminFeedbackItem["status"] | "">("");
  const [adminResponse, setAdminResponse] = useState("");

  const { mutate: update, isPending } = useUpdateFeedbackMutation();

  const handleOpen = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      setStatus("");
      setAdminResponse("");
    }
  };

  // Sync state when item changes
  if (item && status === "" && item.status) {
    setStatus(item.status);
  }
  if (item && adminResponse === "" && item.admin_response) {
    setAdminResponse(item.admin_response);
  }

  const handleSave = () => {
    if (!item) return;
    update({
      feedbackId: item.feedback_id,
      data: {
        status: status || undefined,
        admin_response: adminResponse.trim() || undefined,
      },
    });
  };

  if (!item) return null;

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent side="right" className="flex w-full max-w-[560px] flex-col gap-0 p-0">
        {/* Header */}
        <SheetHeader className="shrink-0 border-b border-border px-6 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <SheetTitle className="text-base font-semibold flex-1 min-w-0 truncate">
              {item.title}
            </SheetTitle>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {TYPE_LABELS[item.feedback_type]}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {item.app_area}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-xs capitalize", SEVERITY_CLASSES[item.severity])}
            >
              {item.severity}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-xs capitalize", STATUS_CLASSES[item.status])}
            >
              {item.status.replace("_", " ")}
            </Badge>
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              By <span className="font-medium text-foreground">{item.user_name}</span>
            </span>
            <span>{formatDate(item.created_at)}</span>
          </div>

          {/* Rating */}
          <Section label="Rating">
            <StarDisplay rating={item.overall_rating} />
          </Section>

          {/* Core content */}
          <Section label="Description">
            <p className="whitespace-pre-wrap leading-relaxed">{item.description}</p>
          </Section>

          {item.what_works && (
            <Section label="What's Working">
              <p className="whitespace-pre-wrap leading-relaxed">{item.what_works}</p>
            </Section>
          )}

          {item.what_needs_improvement && (
            <Section label="What Needs Improvement">
              <p className="whitespace-pre-wrap leading-relaxed">{item.what_needs_improvement}</p>
            </Section>
          )}

          {item.steps_to_reproduce && (
            <Section label="Steps to Reproduce">
              <pre className="whitespace-pre-wrap font-mono text-xs bg-muted/40 rounded-md p-3 leading-relaxed">
                {item.steps_to_reproduce}
              </pre>
            </Section>
          )}

          {item.expected_behavior && (
            <Section label="Expected Behaviour">
              <p className="whitespace-pre-wrap leading-relaxed">{item.expected_behavior}</p>
            </Section>
          )}

          {/* Divider */}
          <div className="border-t border-border pt-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Admin Actions
            </p>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="detail-status">
                Status
              </label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as AdminFeedbackItem["status"])}
              >
                <SelectTrigger id="detail-status" className="h-9 text-sm">
                  <SelectValue placeholder="Set status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Admin response */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="detail-admin-response"
              >
                Response <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Textarea
                id="detail-admin-response"
                placeholder="Leave an internal note or response to the user..."
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                className="min-h-[90px] resize-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <>
                <IconLibrary name="loading" className="mr-2 size-3.5" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
