"use client";

import { Calendar, Clock, MapPin, Users, Video } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useScheduleMeetingMutation } from "@/features/hr/services/mutations";
import { useMeetingsQuery } from "@/features/hr/services/queries";

export default function AdminMeetingsClient() {
  const { data: meetings, isLoading } = useMeetingsQuery();
  const scheduleMutation = useScheduleMeetingMutation();
  const [isScheduling, setIsScheduling] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    meeting_type: "online" as "online" | "physical",
    location_or_url: "",
    start_time: "",
    end_time: "",
    attendee_ids: [] as string[],
  });

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleMutation.mutate(
      {
        ...form,
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
      },
      {
        onSuccess: () => {
          setIsScheduling(false);
          setForm({
            title: "",
            description: "",
            meeting_type: "online",
            location_or_url: "",
            start_time: "",
            end_time: "",
            attendee_ids: [],
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meetings Management</h1>
          <p className="text-muted-foreground">
            Schedule and track attendance for online and physical team meetings.
          </p>
        </div>
        <Button onClick={() => setIsScheduling(!isScheduling)}>
          {isScheduling ? "Cancel" : "Schedule Meeting"}
        </Button>
      </div>

      {isScheduling && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Meeting</CardTitle>
            <CardDescription>
              Fill in the details to schedule a meeting and invite employees.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSchedule} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meeting Title</Label>
                  <Input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Weekly Sync"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meeting Type</Label>
                  <Select
                    value={form.meeting_type}
                    onValueChange={(val: any) => setForm({ ...form, meeting_type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online (Virtual)</SelectItem>
                      <SelectItem value="physical">Physical (In-Person)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="datetime-local"
                    required
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="datetime-local"
                    required
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>
                    {form.meeting_type === "online" ? "Meeting URL (Zoom/Meet)" : "Location / Room"}
                  </Label>
                  <Input
                    value={form.location_or_url}
                    onChange={(e) => setForm({ ...form, location_or_url: e.target.value })}
                    placeholder={
                      form.meeting_type === "online"
                        ? "https://zoom.us/j/123..."
                        : "Conference Room A"
                    }
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Description / Agenda</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Agenda points..."
                  />
                </div>
              </div>
              <Button type="submit" disabled={scheduleMutation.isPending}>
                Schedule Meeting
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upcoming & Past Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : !meetings || meetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border rounded-md">
              <Calendar className="h-10 w-10 mb-4 opacity-50" />
              <p className="font-medium">No meetings scheduled.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting: any) => (
                <div
                  key={meeting.id}
                  className="p-4 border rounded-lg flex flex-col md:flex-row gap-4 justify-between items-start"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {meeting.meeting_type === "online" ? (
                        <Video className="h-4 w-4 text-blue-500" />
                      ) : (
                        <MapPin className="h-4 w-4 text-amber-500" />
                      )}
                      {meeting.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {new Date(meeting.start_time).toLocaleString()} -{" "}
                      {new Date(meeting.end_time).toLocaleTimeString()}
                    </p>
                    {meeting.location_or_url && (
                      <p className="text-sm font-medium mt-2">
                        Location:{" "}
                        <a
                          href={meeting.location_or_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          {meeting.location_or_url}
                        </a>
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Manage Attendance
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
