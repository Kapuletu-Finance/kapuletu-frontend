"use client";

import { format } from "date-fns";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VenueSelect } from "@/features/hr/components/admin/locations/VenueSelect";
import {
  AudienceSelector,
  type AudienceValue,
} from "@/features/hr/components/admin/meetings/AudienceSelector";
import {
  useScheduleMeetingMutation,
  useUpdateMeetingMutation,
} from "@/features/hr/services/mutations";
import type { MeetingDetail, MeetingInput, WorkMode } from "@/features/hr/types";
import { cn } from "@/lib/utils";

interface MeetingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the dialog edits this meeting; otherwise it schedules a new one. */
  meeting?: MeetingDetail;
}

const toLocalInput = (iso: string) => format(new Date(iso), "yyyy-MM-dd'T'HH:mm");

const initialForm = (meeting?: MeetingDetail) => ({
  description: meeting?.description ?? "",
  end_time: meeting ? toLocalInput(meeting.end_time) : "",
  location_id: meeting?.location_id ?? null,
  location_or_url: meeting?.location_or_url ?? "",
  meeting_type: (meeting?.meeting_type ?? "physical") as WorkMode,
  start_time: meeting ? toLocalInput(meeting.start_time) : "",
  title: meeting?.title ?? "",
});

const initialAudience = (meeting?: MeetingDetail): AudienceValue => ({
  attendee_ids: meeting?.attendees.map((a) => a.user_id) ?? [],
  audience: meeting?.audience ?? "all",
  audience_roles: meeting?.audience_roles ?? [],
});

const validate = (form: ReturnType<typeof initialForm>, audience: AudienceValue) => {
  if (new Date(form.end_time) <= new Date(form.start_time))
    return "The meeting must end after it starts.";
  if (audience.audience === "roles" && audience.audience_roles.length === 0)
    return "Select at least one role.";
  if (audience.audience === "custom" && audience.attendee_ids.length === 0)
    return "Select at least one attendee.";
  return null;
};

export const MeetingFormDialog: React.FC<MeetingFormDialogProps> = ({
  open,
  onOpenChange,
  meeting,
}) => {
  const isEdit = !!meeting;
  const [form, setForm] = useState(() => initialForm(meeting));
  const [audience, setAudience] = useState(() => initialAudience(meeting));
  const [error, setError] = useState<string | null>(null);
  const scheduleMutation = useScheduleMeetingMutation();
  const updateMutation = useUpdateMeetingMutation();
  const isPending = scheduleMutation.isPending || updateMutation.isPending;

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate(form, audience);
    setError(validationError);
    if (validationError) return;

    const payload: MeetingInput = {
      ...form,
      ...audience,
      description: form.description.trim() || undefined,
      end_time: new Date(form.end_time).toISOString(),
      location_id: form.meeting_type === "physical" ? form.location_id : null,
      location_or_url: form.location_or_url.trim() || undefined,
      start_time: new Date(form.start_time).toISOString(),
    };
    const onSuccess = () => onOpenChange(false);
    if (meeting) updateMutation.mutate({ meetingId: meeting.id, payload }, { onSuccess });
    else scheduleMutation.mutate(payload, { onSuccess });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit meeting" : "Schedule a meeting"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Changing the time, place or mode asks attendees to confirm again. Added or removed people are notified."
              : "Invitees receive an email and an in-app notification, plus reminders 24 hours and 1 hour before."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="meeting-title">Title</Label>
              <Input
                id="meeting-title"
                required
                maxLength={200}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Weekly sync"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Mode</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["physical", "online"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={form.meeting_type === mode}
                    onClick={() => update("meeting_type", mode)}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors",
                      form.meeting_type === mode
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/40",
                    )}
                  >
                    <p className="text-sm font-semibold">
                      {mode === "physical" ? "In person" : "Online"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {mode === "physical"
                        ? "Check-in requires being within the office radius."
                        : "Attendees check in from anywhere during the meeting."}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-start">Starts</Label>
              <Input
                id="meeting-start"
                type="datetime-local"
                required
                value={form.start_time}
                onChange={(e) => update("start_time", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-end">Ends</Label>
              <Input
                id="meeting-end"
                type="datetime-local"
                required
                min={form.start_time || undefined}
                value={form.end_time}
                onChange={(e) => update("end_time", e.target.value)}
              />
            </div>

            {form.meeting_type === "physical" && (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="meeting-venue">Venue</Label>
                <VenueSelect
                  id="meeting-venue"
                  value={form.location_id}
                  onChange={(locationId) => update("location_id", locationId)}
                />
                <p className="text-xs text-muted-foreground">
                  Check-ins must be within this venue&apos;s radius. Manage venues under Schedule
                  &amp; locations.
                </p>
              </div>
            )}

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="meeting-location">
                {form.meeting_type === "online" ? "Meeting link" : "Room / directions (optional)"}
              </Label>
              <Input
                id="meeting-location"
                type={form.meeting_type === "online" ? "url" : "text"}
                value={form.location_or_url}
                onChange={(e) => update("location_or_url", e.target.value)}
                placeholder={
                  form.meeting_type === "online" ? "https://meet.google.com/..." : "Board room"
                }
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="meeting-description">Agenda</Label>
              <Textarea
                id="meeting-description"
                rows={3}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Agenda points..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Who should attend?</Label>
            <AudienceSelector value={audience} onChange={setAudience} />
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Save changes" : "Schedule & notify"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
