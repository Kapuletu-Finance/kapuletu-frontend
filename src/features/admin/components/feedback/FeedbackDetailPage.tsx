"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateFeedbackMutation } from "@/features/admin/services/mutations";
import { useAdminFeedbackDetailsQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  bug: "Bug",
  feature_request: "Feature",
  ux_issue: "UX",
  performance: "Performance",
  general: "General",
};

const TYPE_CLASSES: Record<string, string> = {
  bug: "bg-destructive/10 text-destructive border-destructive/20",
  feature_request: "bg-refined-blue/10 text-refined-blue border-refined-blue/20",
  ux_issue: "bg-muted text-muted-foreground border-border",
  performance: "bg-burnt-amber/10 text-burnt-amber border-burnt-amber/20",
  general: "bg-muted text-muted-foreground border-border",
};

const SEVERITY_CLASSES: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-burnt-amber/10 text-burnt-amber border-burnt-amber/20",
  medium: "bg-muted text-muted-foreground border-border",
  low: "bg-muted/50 text-muted-foreground border-border",
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "shipped", label: "Shipped" },
  { value: "declined", label: "Declined" },
];

export const FeedbackDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const feedbackId = params.slug as string;

  const { data: item, isLoading } = useAdminFeedbackDetailsQuery(feedbackId);
  const updateMutation = useUpdateFeedbackMutation();

  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("new");

  useEffect(() => {
    if (item) {
      setResponse(item.admin_response || "");
      setStatus(item.status);
    }
  }, [item]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSave = () => {
    updateMutation.mutate({
      feedbackId,
      data: { status, admin_response: response.trim() || undefined },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full lg:col-span-1" />
          <Skeleton className="h-96 w-full lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <IconLibrary name="alert" className="size-10 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground">Feedback not found</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          This feedback item may have been removed or does not exist.
        </p>
        <Button className="mt-6" onClick={() => router.push("/admin/feedback")}>
          <IconLibrary name="arrow-left" className="mr-2 size-4" /> Back to Feedback
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Button
            variant="link"
            className="p-0 h-auto w-fit text-muted-foreground justify-start mb-2"
            onClick={() => router.push("/admin/feedback")}
          >
            <IconLibrary name="arrow-left" className="mr-1 size-3" /> Back to Feedback
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground tracking-tight line-clamp-1 max-w-xl">
              {item.title}
            </h1>
            <Badge variant="outline" className={cn("capitalize", TYPE_CLASSES[item.feedback_type])}>
              {TYPE_LABELS[item.feedback_type] || item.feedback_type}
            </Badge>
            <Badge variant="outline" className={cn("capitalize", SEVERITY_CLASSES[item.severity])}>
              {item.severity} Severity
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Identifier: {feedbackId.split("-")[0].toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={
              updateMutation.isPending ||
              (status === item.status && response === (item.admin_response || ""))
            }
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metadata */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                  Submitter Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium text-foreground">{item.user_name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Email</span>
                    <span
                      className="font-medium text-foreground truncate"
                      title={item.user_email || "N/A"}
                    >
                      {item.user_email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/admin/users/${item.user_id}`)}
                    >
                      View User Profile
                    </Button>
                  </div>
                </div>
              </div>
              <div className="h-px bg-border w-full" />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                  Feedback Meta
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Submitted</span>
                    <span className="font-medium text-foreground">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">App Area</span>
                    <span className="font-medium text-foreground capitalize">
                      {item.app_area.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-0.5">
                      {item.overall_rating ? (
                        [1, 2, 3, 4, 5].map((n) => (
                          <IconLibrary
                            key={n}
                            name="star"
                            className={cn(
                              "size-3",
                              n <= item.overall_rating!
                                ? "fill-primary text-primary"
                                : "text-muted-foreground/30",
                            )}
                          />
                        ))
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Feedback Content & Admin Response */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 p-4 rounded-md border border-border">
                  {item.description}
                </p>
              </div>

              {item.steps_to_reproduce && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Steps to Reproduce
                  </h3>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 p-4 rounded-md border border-border">
                    {item.steps_to_reproduce}
                  </p>
                </div>
              )}

              {item.expected_behavior && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Expected Behavior
                  </h3>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 p-4 rounded-md border border-border">
                    {item.expected_behavior}
                  </p>
                </div>
              )}

              {(item.what_works || item.what_needs_improvement) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.what_works && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        What Works
                      </h3>
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-primary/5 p-4 rounded-md border border-primary/10">
                        {item.what_works}
                      </p>
                    </div>
                  )}
                  {item.what_needs_improvement && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Needs Improvement
                      </h3>
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-destructive/5 p-4 rounded-md border border-destructive/10">
                        {item.what_needs_improvement}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-semibold text-lg text-foreground">Admin Response</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select value={status} onValueChange={(val) => setStatus(val || "new")}>
                    <SelectTrigger className="w-full sm:w-64" id="status">
                      <SelectValue placeholder="Status" />
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

                <div className="space-y-2">
                  <label htmlFor="response" className="text-sm font-medium">
                    Internal Note / Response
                  </label>
                  <Textarea
                    id="response"
                    placeholder="Add an internal note or response to this feedback..."
                    className="min-h-[120px] resize-y"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This note is strictly for internal administrative use.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
