"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FeedbackSubmission } from "@/features/admin/services/mutations";
import { useSubmitFeedbackMutation } from "@/features/admin/services/mutations";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type FeedbackType = FeedbackSubmission["feedback_type"];
type AppArea = string;
type Severity = FeedbackSubmission["severity"];

interface FormState {
  feedback_type: FeedbackType | "";
  app_area: AppArea;
  severity: Severity;
  title: string;
  description: string;
  what_works: string;
  what_needs_improvement: string;
  steps_to_reproduce: string;
  expected_behavior: string;
  overall_rating: number | null;
}

const EMPTY_FORM: FormState = {
  feedback_type: "",
  app_area: "",
  severity: "medium",
  title: "",
  description: "",
  what_works: "",
  what_needs_improvement: "",
  steps_to_reproduce: "",
  expected_behavior: "",
  overall_rating: null,
};

// ─── Config ───────────────────────────────────────────────────────────────────

const FEEDBACK_TYPES: {
  value: FeedbackType;
  label: string;
  icon: "bug" | "lightbulb" | "layout" | "zap" | "message-circle";
  hint: string;
}[] = [
  { value: "bug", label: "Bug Report", icon: "bug", hint: "Something isn't working" },
  {
    value: "feature_request",
    label: "Feature Request",
    icon: "lightbulb",
    hint: "Suggest an improvement",
  },
  {
    value: "ux_issue",
    label: "UI / UX Issue",
    icon: "layout",
    hint: "Design or usability problem",
  },
  {
    value: "performance",
    label: "Performance",
    icon: "zap",
    hint: "Slowness or loading issues",
  },
  { value: "general", label: "General", icon: "message-circle", hint: "Other feedback" },
];

const APP_AREAS: { value: string; label: string }[] = [
  { value: "dashboard", label: "Dashboard" },
  { value: "groups", label: "Groups" },
  { value: "campaigns", label: "Campaigns" },
  { value: "contributions", label: "Contributions" },
  { value: "reports", label: "Reports" },
  { value: "inbox", label: "Inbox" },
  { value: "notifications", label: "Notifications" },
  { value: "settings", label: "Settings" },
  { value: "other", label: "Other" },
];

const SEVERITIES: { value: Severity; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const showWhatWorks = (t: FeedbackType | "") =>
  t === "ux_issue" || t === "general" || t === "feature_request";

const showWhatNeedsImprovement = (t: FeedbackType | "") =>
  t === "ux_issue" || t === "general" || t === "performance" || t === "feature_request";

const showStepsToReproduce = (t: FeedbackType | "") => t === "bug";

const showExpectedBehavior = (t: FeedbackType | "") => t === "bug" || t === "feature_request";

// ─── Step Indicator ───────────────────────────────────────────────────────────

const StepIndicator: React.FC<{ step: number; total: number }> = ({ step, total }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
      <div
        key={n}
        className={cn(
          "h-1.5 rounded-full transition-all duration-300",
          n === step
            ? "w-6 bg-primary"
            : n < step
              ? "w-3 bg-primary/50"
              : "w-3 bg-muted-foreground/20",
        )}
      />
    ))}
    <span className="ml-1 text-xs text-muted-foreground">
      {step} / {total}
    </span>
  </div>
);

// ─── Step 1: Type, Area, Severity ─────────────────────────────────────────────

const Step1: React.FC<{
  form: FormState;
  onChange: (patch: Partial<FormState>) => void;
}> = ({ form, onChange }) => (
  <div className="space-y-6">
    {/* Type */}
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">What type of feedback?</p>
      <div className="grid grid-cols-1 gap-2">
        {FEEDBACK_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange({ feedback_type: t.value })}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
              form.feedback_type === t.value
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/30",
            )}
          >
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md",
                form.feedback_type === t.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <IconLibrary name={t.icon} className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-tight">{t.label}</p>
              <p className="text-xs text-muted-foreground">{t.hint}</p>
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* Area */}
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">Which area of the app?</p>
      <div className="flex flex-wrap gap-2">
        {APP_AREAS.map((a) => (
          <button
            key={a.value}
            type="button"
            onClick={() => onChange({ app_area: a.value })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              form.app_area === a.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>

    {/* Severity */}
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">How severe is this?</p>
      <div className="flex gap-2">
        {SEVERITIES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange({ severity: s.value })}
            className={cn(
              "flex-1 rounded-lg border py-2 text-xs font-medium transition-colors",
              form.severity === s.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ─── Step 2: Details ──────────────────────────────────────────────────────────

const Step2: React.FC<{
  form: FormState;
  onChange: (patch: Partial<FormState>) => void;
}> = ({ form, onChange }) => (
  <div className="space-y-4">
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground" htmlFor="fb-title">
        Title <span className="text-destructive">*</span>
      </label>
      <Input
        id="fb-title"
        placeholder="Short summary of the issue or suggestion"
        value={form.title}
        onChange={(e) => onChange({ title: e.target.value })}
        maxLength={255}
      />
      <p className="text-right text-xs text-muted-foreground">{form.title.length} / 255</p>
    </div>

    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground" htmlFor="fb-description">
        Description <span className="text-destructive">*</span>
      </label>
      <Textarea
        id="fb-description"
        placeholder="Describe the issue or suggestion in as much detail as possible."
        value={form.description}
        onChange={(e) => onChange({ description: e.target.value })}
        className="min-h-[90px] resize-none"
      />
    </div>

    {showWhatWorks(form.feedback_type) && (
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="fb-works">
          What's currently working well?
        </label>
        <Textarea
          id="fb-works"
          placeholder="Describe what you like or what's functioning correctly."
          value={form.what_works}
          onChange={(e) => onChange({ what_works: e.target.value })}
          className="min-h-[70px] resize-none"
        />
      </div>
    )}

    {showWhatNeedsImprovement(form.feedback_type) && (
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="fb-improvement">
          What needs to change?
        </label>
        <Textarea
          id="fb-improvement"
          placeholder="Be specific about what should be different."
          value={form.what_needs_improvement}
          onChange={(e) => onChange({ what_needs_improvement: e.target.value })}
          className="min-h-[70px] resize-none"
        />
      </div>
    )}

    {showStepsToReproduce(form.feedback_type) && (
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="fb-steps">
          Steps to reproduce
        </label>
        <Textarea
          id="fb-steps"
          placeholder={"1. Go to...\n2. Click on...\n3. Observe..."}
          value={form.steps_to_reproduce}
          onChange={(e) => onChange({ steps_to_reproduce: e.target.value })}
          className="min-h-[80px] resize-none font-mono text-xs"
        />
      </div>
    )}

    {showExpectedBehavior(form.feedback_type) && (
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="fb-expected">
          Expected behaviour
        </label>
        <Textarea
          id="fb-expected"
          placeholder="What should happen instead?"
          value={form.expected_behavior}
          onChange={(e) => onChange({ expected_behavior: e.target.value })}
          className="min-h-[70px] resize-none"
        />
      </div>
    )}
  </div>
);

// ─── Step 3: Rating + Review ──────────────────────────────────────────────────

const StarRating: React.FC<{
  value: number | null;
  onChange: (v: number) => void;
}> = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        aria-label={`Rate ${n} out of 5`}
        className="transition-transform hover:scale-110"
      >
        <IconLibrary
          name="star"
          className={cn(
            "size-7 transition-colors",
            value !== null && n <= value ? "fill-primary text-primary" : "text-muted-foreground/30",
          )}
        />
      </button>
    ))}
  </div>
);

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-burnt-amber/10 text-burnt-amber border-burnt-amber/20",
  medium: "bg-muted text-muted-foreground border-border",
  low: "bg-muted text-muted-foreground border-border",
};

const TYPE_LABELS: Record<FeedbackType, string> = {
  bug: "Bug Report",
  feature_request: "Feature Request",
  ux_issue: "UI / UX Issue",
  performance: "Performance",
  general: "General",
};

const Step3: React.FC<{
  form: FormState;
  onChange: (patch: Partial<FormState>) => void;
}> = ({ form, onChange }) => (
  <div className="space-y-5">
    {/* Rating */}
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">
        Overall app rating <span className="text-muted-foreground">(optional)</span>
      </p>
      <StarRating value={form.overall_rating} onChange={(v) => onChange({ overall_rating: v })} />
      {form.overall_rating && (
        <p className="text-xs text-muted-foreground">
          {["", "Poor", "Fair", "Average", "Good", "Excellent"][form.overall_rating]}
        </p>
      )}
    </div>

    {/* Summary */}
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Review your submission
      </p>
      <div className="flex flex-wrap gap-2">
        {form.feedback_type && (
          <Badge variant="outline" className="text-xs">
            {TYPE_LABELS[form.feedback_type as FeedbackType]}
          </Badge>
        )}
        {form.app_area && (
          <Badge variant="outline" className="text-xs capitalize">
            {form.app_area}
          </Badge>
        )}
        {form.severity && (
          <Badge
            variant="outline"
            className={cn("text-xs capitalize", SEVERITY_COLORS[form.severity])}
          >
            {form.severity}
          </Badge>
        )}
      </div>
      <p className="text-sm font-medium text-foreground">{form.title}</p>
      <p className="text-xs text-muted-foreground line-clamp-3">{form.description}</p>
    </div>
  </div>
);

// ─── Success State ─────────────────────────────────────────────────────────────

const SuccessState: React.FC<{ onReset: () => void; onClose: () => void }> = ({
  onReset,
  onClose,
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center gap-6">
    <div className="flex flex-col items-center gap-4">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
        <IconLibrary name="check-circle" className="size-7 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">Feedback received</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Thank you. Your submission helps us improve Kapuletu for everyone.
        </p>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      <Button variant="outline" className="w-full sm:w-auto" onClick={onClose}>
        Close
      </Button>
      <Button className="w-full sm:w-auto" onClick={onReset}>
        Submit Another
      </Button>
    </div>
  </div>
);

// ─── Main Widget ──────────────────────────────────────────────────────────────

export const FeedbackWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { mutate: submit, isPending } = useSubmitFeedbackMutation();

  // Responsive side detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const patch = (p: Partial<FormState>) => setForm((prev) => ({ ...prev, ...p }));

  const handleOpen = () => {
    setOpen(true);
    handleReset();
  };

  const handleReset = () => {
    setStep(1);
    setForm(EMPTY_FORM);
    setSubmitted(false);
  };

  const handleClose = () => setOpen(false);

  // Step 1 validation
  const step1Valid = Boolean(form.feedback_type && form.app_area);

  // Step 2 validation
  const step2Valid = Boolean(form.title.trim() && form.description.trim());

  const handleSubmit = () => {
    if (!form.feedback_type || !form.app_area) return;

    const payload: FeedbackSubmission = {
      feedback_type: form.feedback_type as FeedbackType,
      app_area: form.app_area,
      severity: form.severity,
      title: form.title.trim(),
      description: form.description.trim(),
      what_works: form.what_works.trim() || undefined,
      what_needs_improvement: form.what_needs_improvement.trim() || undefined,
      steps_to_reproduce: form.steps_to_reproduce.trim() || undefined,
      expected_behavior: form.expected_behavior.trim() || undefined,
      overall_rating: form.overall_rating,
    };

    submit(payload, {
      onSuccess: () => {
        setSubmitted(true);
      },
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        id="feedback-widget-trigger"
        onClick={handleOpen}
        aria-label="Send feedback"
        className={cn(
          "fixed z-40 flex items-center gap-2 rounded-full shadow-lg transition-all duration-200",
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl",
          "bottom-6 right-6 px-4 py-3",
        )}
      >
        <IconLibrary name="feedback" className="size-4 shrink-0" />
        <span className="hidden text-sm font-medium sm:inline">Feedback</span>
      </button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "flex flex-col p-0 gap-0 overflow-hidden",
            isMobile ? "max-h-[92dvh] w-full" : "w-full max-w-[540px] max-h-[85vh]",
          )}
        >
          {/* Header */}
          <DialogHeader className="shrink-0 px-6 py-5 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <DialogTitle className="text-base font-semibold">Share Feedback</DialogTitle>
                <p className="text-xs text-muted-foreground pr-4">
                  By sharing your feedback, you help us improve Kapuletu's application and service
                  delivery.
                </p>
              </div>
              {!submitted && <StepIndicator step={step} total={3} />}
            </div>
          </DialogHeader>

          {/* Content — scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {submitted ? (
              <SuccessState onReset={handleReset} onClose={handleClose} />
            ) : (
              <>
                {step === 1 && <Step1 form={form} onChange={patch} />}
                {step === 2 && <Step2 form={form} onChange={patch} />}
                {step === 3 && <Step3 form={form} onChange={patch} />}
              </>
            )}
          </div>

          {/* Footer — sticky actions */}
          {!submitted && (
            <div className="shrink-0 flex items-center justify-between gap-3 border-t border-border px-6 py-4">
              {step > 1 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={isPending}
                >
                  Back
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  Cancel
                </Button>
              )}

              {step < 3 ? (
                <Button
                  size="sm"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === 1 ? !step1Valid : !step2Valid}
                >
                  Continue
                </Button>
              ) : (
                <Button size="sm" onClick={handleSubmit} disabled={isPending || !step2Valid}>
                  {isPending ? (
                    <>
                      <IconLibrary name="loading" className="mr-2 size-3.5" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
