"use client";

import { Bell, Calendar, CheckCircle2, Clock, Mail, MapPin, User, Video } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useGetMeQuery } from "@/features/auth/services/queries";
import { useClockInMutation, useClockOutMutation } from "@/features/hr/services/mutations";
import { useEmployeeReportsQuery, useMeetingsQuery } from "@/features/hr/services/queries";
import { useNotificationsQuery } from "@/features/notifications/services/queries";

export const EmployeeDashboardClient = () => {
  const { data: user } = useGetMeQuery();
  const { data: reports, isLoading: isLoadingReports } = useEmployeeReportsQuery(user?.user_id);
  const { data: meetings, isLoading: isLoadingMeetings } = useMeetingsQuery();
  const { data: notificationsData, isLoading: isLoadingNotifs } = useNotificationsQuery();

  const clockInMutation = useClockInMutation();
  const clockOutMutation = useClockOutMutation();

  const [workSummary, setWorkSummary] = useState("");

  const todayReport = reports?.find(
    (r: any) => new Date(r.report_date).toDateString() === new Date().toDateString(),
  );
  const isClockedIn = !!todayReport?.clock_in_time;
  const isClockedOut = !!todayReport?.clock_out_time;

  const handleClockOut = () => {
    if (!workSummary.trim()) {
      alert("Please provide a work summary for today.");
      return;
    }
    clockOutMutation.mutate(workSummary);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Workspace</h1>
          <p className="text-muted-foreground">
            Manage your schedule, meetings, and daily reporting.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg border">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-sm text-muted-foreground capitalize">
              {user?.role?.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" /> Daily Work Log
            </CardTitle>
            <CardDescription>
              Track your attendance and submit your daily end-of-shift report.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isClockedIn ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-lg">Not Clocked In</p>
                  <p className="text-sm text-muted-foreground">
                    Start your shift to record attendance.
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => clockInMutation.mutate()}
                  disabled={clockInMutation.isPending}
                >
                  Clock In Now
                </Button>
              </div>
            ) : !isClockedOut ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-400">
                      You are clocked in!
                    </p>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80">
                      Started at {new Date(todayReport.clock_in_time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-sm font-medium">End of Day Work Summary</p>
                  <Textarea
                    placeholder="Briefly describe what you worked on today..."
                    value={workSummary}
                    onChange={(e) => setWorkSummary(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={handleClockOut}
                  disabled={clockOutMutation.isPending}
                >
                  Submit Report & Clock Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 bg-muted/20 rounded-lg border border-dashed">
                <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                <div>
                  <p className="font-medium text-lg">Shift Completed</p>
                  <p className="text-sm text-muted-foreground">
                    Your report has been submitted to your supervisor.
                  </p>
                </div>
                <Badge
                  variant={todayReport.status === "confirmed" ? "default" : "secondary"}
                  className="mt-2"
                >
                  Status: {todayReport.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> My Upcoming Meetings
            </CardTitle>
            <CardDescription>Scheduled online and physical sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMeetings ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : !meetings || meetings.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p>No upcoming meetings found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {meetings.map((meeting: any) => (
                  <div key={meeting.id} className="p-3 border rounded-lg flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium flex items-center gap-2">
                        {meeting.meeting_type === "online" ? (
                          <Video className="h-4 w-4 text-blue-500" />
                        ) : (
                          <MapPin className="h-4 w-4 text-amber-500" />
                        )}
                        {meeting.title}
                      </h4>
                      <Badge variant="outline">
                        {new Date(meeting.start_time).toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(meeting.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {meeting.location_or_url && (
                        <a
                          href={meeting.location_or_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline text-xs flex items-center gap-1"
                        >
                          View Location/Link
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Kapuletu Project Manager (KPM)
          </CardTitle>
          <CardDescription>
            Track daily progress, report activities, and log blockers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 border rounded-lg bg-primary/5">
            <div>
              <p className="font-medium">KPM Dashboard</p>
              <p className="text-sm text-muted-foreground">
                Access your primary project management workspace to update your active tickets.
              </p>
            </div>
            <a
              href="https://kpm.kapuletu.co.ke"
              target="_blank"
              rel="noreferrer"
              className="shrink-0"
            >
              <Button variant="default">Open KPM Workspace</Button>
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Internal Communications & Alerts</CardTitle>
          <CardDescription>Recent notifications and policy updates.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingNotifs ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !notificationsData?.notifications || notificationsData.notifications.length === 0 ? (
            <div className="bg-muted/10 border border-dashed rounded-lg p-6 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2 opacity-50" />
              <p className="text-muted-foreground text-sm">
                You have no new internal communications.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notificationsData.notifications.slice(0, 5).map((notif: any) => (
                <div
                  key={notif.notification_id || notif.id}
                  className={`p-3 rounded-lg border flex gap-3 items-start ${!notif.is_read ? "bg-primary/5 border-primary/20" : ""}`}
                >
                  <div className="mt-0.5">
                    <Mail
                      className={`h-4 w-4 ${!notif.is_read ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div>
                    <p className={`text-sm ${!notif.is_read ? "font-semibold" : ""}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
