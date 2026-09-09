"use client";

import { CheckCircle, MessageSquare, Star, ThumbsDown, ThumbsUp, Zap } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useRateTicketMutation } from "../services/mutations";

interface Props {
  ticketId: string;
  userName: string;
  subject: string;
}

const StarRating: React.FC<{
  value: number | null;
  onChange: (v: number) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="space-y-1.5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5 transition-transform duration-100 hover:scale-125 focus-visible:outline-none"
            aria-label={`${star} star`}
          >
            <Star
              className={`w-6 h-6 transition-colors duration-100 ${
                star <= (hovered || value || 0)
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const EMOJI_MAP: Record<number, { icon: string; label: string; color: string }> = {
  1: { icon: "😞", label: "Very Unsatisfied", color: "text-red-500" },
  2: { icon: "😕", label: "Unsatisfied", color: "text-orange-500" },
  3: { icon: "😐", label: "Neutral", color: "text-yellow-500" },
  4: { icon: "😊", label: "Satisfied", color: "text-green-500" },
  5: { icon: "😄", label: "Very Satisfied", color: "text-emerald-500" },
};

export const SupportRatingCard: React.FC<Props> = ({ ticketId, userName, subject }) => {
  const { mutateAsync: rate, isPending } = useRateTicketMutation();

  const [submitted, setSubmitted] = useState(false);
  const [skipped, setSkipped] = useState(false);

  // Form fields
  const [issueResolved, setIssueResolved] = useState<boolean | null>(null);
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [responseQuality, setResponseQuality] = useState<number | null>(null);
  const [responseSpeed, setResponseSpeed] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const canSubmit = issueResolved !== null && satisfaction !== null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      await rate({
        ticketId,
        payload: {
          issue_resolved: issueResolved as boolean,
          satisfaction_level: satisfaction as number,
          response_quality: responseQuality,
          response_speed: responseSpeed,
          comment: comment.trim() || null,
        },
      });
      setSubmitted(true);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } };
      const detail = err.response?.data?.detail;
      if (detail === "This session has already been rated") {
        setSubmitted(true); // Already rated, show thank-you
      } else {
        toast.error("Unable to submit your feedback. Please try again.");
      }
    }
  };

  if (skipped) return null;

  if (submitted) {
    return (
      <div className="mx-6 mb-4 rounded-2xl border border-green-500/20 bg-green-500/5 p-5 flex items-center gap-4">
        <CheckCircle className="w-8 h-8 text-green-500 shrink-0" />
        <div>
          <p className="font-semibold text-green-700 dark:text-green-400">
            Thank you, {userName.split(" ")[0]}!
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your feedback has been received and will help us improve our support service for the
            entire Kapuletu community. 💙
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-6 mb-4 rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 p-5 pb-4">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <MessageSquare className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground leading-tight">
            How was your support experience?
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Re: <span className="font-medium text-foreground">{subject}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Your response helps us continuously improve our service for all treasurers on the
            platform.
          </p>
        </div>
      </div>

      <Separator />

      <div className="p-5 space-y-5">
        {/* Q1: Issue resolved */}
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Was your issue fully resolved?{" "}
            <span className="text-destructive text-xs">Required</span>
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIssueResolved(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                issueResolved === true
                  ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
                  : "border-border hover:border-green-500/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              Yes, fully resolved
            </button>
            <button
              type="button"
              onClick={() => setIssueResolved(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                issueResolved === false
                  ? "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400"
                  : "border-border hover:border-red-500/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              Not fully resolved
            </button>
          </div>
        </div>

        {/* Q2: Overall satisfaction emoji scale */}
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Overall satisfaction <span className="text-destructive text-xs">Required</span>
          </p>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as const).map((level) => {
              const { icon, label, color } = EMOJI_MAP[level];
              const isSelected = satisfaction === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSatisfaction(level)}
                  title={label}
                  className={`flex flex-col items-center gap-1 w-14 py-2 rounded-xl border transition-all duration-150 ${
                    isSelected
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className="text-xl leading-none">{icon}</span>
                  <span
                    className={`text-[10px] font-medium leading-tight ${isSelected ? color : "text-muted-foreground"}`}
                  >
                    {level}
                  </span>
                </button>
              );
            })}
          </div>
          {satisfaction && (
            <p className={`text-xs font-medium ${EMOJI_MAP[satisfaction].color}`}>
              {EMOJI_MAP[satisfaction].label}
            </p>
          )}
        </div>

        {/* Q3 & Q4: Star sub-scores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StarRating
            value={responseQuality}
            onChange={setResponseQuality}
            label="Clarity of communication (optional)"
          />
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Speed of response (optional)
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setResponseSpeed(star)}
                  className="p-0.5 transition-transform duration-100 hover:scale-125 focus-visible:outline-none"
                  aria-label={`${star} star`}
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (responseSpeed || 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Q5: Comment */}
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground">Additional comments (optional)</p>
          <Textarea
            placeholder="Tell us more about your experience — what went well, what could be improved..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px] resize-none text-sm"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">{comment.length}/500</p>
        </div>
      </div>

      <Separator />

      {/* Footer actions */}
      <div className="flex items-center justify-between p-4">
        <button
          type="button"
          onClick={() => setSkipped(true)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip for now
        </button>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || isPending}
          size="sm"
          className="gap-2"
        >
          {isPending ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>
    </div>
  );
};
