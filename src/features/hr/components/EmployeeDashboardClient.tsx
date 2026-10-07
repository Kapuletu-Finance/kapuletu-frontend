"use client";

import { Bell, Calendar, CheckCircle2, Clock, Mail, MapPin, User, Video } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
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
  const [isClockOutModalOpen, setIsClockOutModalOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [workMode, setWorkMode] = useState<"physical" | "remote">("physical");

  const todayReport = reports?.find(
    (r: any) => new Date(r.report_date).toDateString() === new Date().toDateString(),
  );
  const isClockedIn = !!todayReport?.clock_in_time;
  const isClockedOut = !!todayReport?.clock_out_time;

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isClockedIn && !isClockedOut && todayReport?.clock_in_time) {
      interval = setInterval(() => {
        const start = new Date(todayReport.clock_in_time).getTime();
        const now = new Date().getTime();
        setElapsedSeconds(Math.floor((now - start) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, isClockedOut, todayReport?.clock_in_time]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = Math.min((elapsedSeconds / (8 * 3600)) * 100, 100);

  const handleClockOut = () => {
    if (!workSummary.trim()) {
      alert("Please provide a work summary for today.");
      return;
    }
    clockOutMutation.mutate(workSummary, {
      onSuccess: () => {
        setIsClockOutModalOpen(false);
      },
    });
  };

  const handleClockIn = () => {
    if (workMode === "physical") {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clockInMutation.mutate({
            work_mode: "physical",
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        (err) => {
          toast.error(
            "Location access denied: " +
              err.message +
              ". Please allow location access to clock in physically.",
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      clockInMutation.mutate({ work_mode: "remote", latitude: null, longitude: null });
    }
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
        <Card className="border-primary/20 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-500" /> My Shift
              </span>
              {isClockedIn && !isClockedOut && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 gap-1.5 px-3 py-1 animate-pulse"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Active
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {isClockedIn && !isClockedOut
                ? "You are currently on the clock. Track your time and stay productive."
                : "Manage your daily attendance and end-of-shift reporting."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isClockedIn ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative h-24 w-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg text-white">
                    <Clock className="h-10 w-10" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-2xl tracking-tight">Ready for your shift?</h3>
                  <p className="text-muted-foreground mt-1 max-w-xs mx-auto">
                    Select your working mode and start your timer.
                  </p>
                </div>

                <div className="flex bg-muted p-1 rounded-lg w-full max-w-[240px]">
                  <button
                    onClick={() => setWorkMode("physical")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${workMode === "physical" ? "bg-white shadow-sm text-indigo-600" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Office (GPS)
                  </button>
                  <button
                    onClick={() => setWorkMode("remote")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${workMode === "remote" ? "bg-white shadow-sm text-indigo-600" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Remote
                  </button>
                </div>

                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 text-lg rounded-full shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
                  onClick={handleClockIn}
                  disabled={clockInMutation.isPending}
                >
                  {clockInMutation.isPending ? "Validating..." : "Start Shift"}
                </Button>
              </div>
            ) : !isClockedOut ? (
              <div className="space-y-8 py-2">
                <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-widest">
                    Elapsed Time
                  </p>
                  <p className="text-6xl sm:text-7xl font-light tabular-nums tracking-tighter text-slate-800 dark:text-slate-100">
                    {formatTime(elapsedSeconds)}
                  </p>
                </div>

                <div className="space-y-2 px-2">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>Shift Progress</span>
                    <span>{Math.floor(progressPercentage)}% (Goal: 8h)</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2.5" />
                  <p className="text-xs text-muted-foreground/70 text-right mt-1">
                    Started at{" "}
                    {new Date(todayReport.clock_in_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    className="w-full py-6 text-lg shadow-sm border-2"
                    variant="outline"
                    onClick={() => setIsClockOutModalOpen(true)}
                  >
                    End Shift
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 bg-muted/20 rounded-2xl border border-dashed">
                <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-2xl tracking-tight">Shift Completed</h3>
                  <p className="text-muted-foreground mt-1 max-w-xs mx-auto">
                    Excellent work today. Your shift report has been successfully submitted to your
                    supervisor.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t w-full max-w-xs justify-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge
                    variant={todayReport.status === "confirmed" ? "default" : "secondary"}
                    className={
                      todayReport.status === "confirmed" ? "bg-green-500 hover:bg-green-600" : ""
                    }
                  >
                    {todayReport.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Clock Out Modal */}
        <Dialog open={isClockOutModalOpen} onOpenChange={setIsClockOutModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Complete Your Shift</DialogTitle>
              <DialogDescription>
                You have been active for <strong>{formatTime(elapsedSeconds)}</strong>. Please
                provide a brief summary of what you accomplished today before clocking out.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Summarize your completed tasks, pending items, or any blockers..."
                  value={workSummary}
                  onChange={(e) => setWorkSummary(e.target.value)}
                  rows={5}
                  className="resize-none"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsClockOutModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleClockOut}
                disabled={clockOutMutation.isPending || !workSummary.trim()}
              >
                {clockOutMutation.isPending ? "Submitting..." : "Submit & Clock Out"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
