"use client";

import { Bell, FolderKanban, User } from "lucide-react";
import type React from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMeQuery } from "@/features/auth/services/queries";
import { MyAttendanceCard } from "@/features/hr/components/employee/MyAttendanceCard";
import { MyMeetingsCard } from "@/features/hr/components/employee/MyMeetingsCard";
import { ShiftCard } from "@/features/hr/components/employee/ShiftCard";
import { formatRole } from "@/features/hr/utils";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import { useNotificationsQuery } from "@/features/notifications/services/queries";
import { notificationToDisplay } from "@/features/notifications/utils";

const KpmCard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FolderKanban className="h-5 w-5 text-primary" /> Kapuletu Project Manager (KPM)
      </CardTitle>
      <CardDescription>Track daily progress, report activities, and log blockers.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-between gap-4 rounded-lg border bg-primary/5 p-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          Open your project management workspace to update your active tickets.
        </p>
        <a
          href="https://kpm.kapuletu.co.ke"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ className: "shrink-0" })}
        >
          Open KPM workspace
        </a>
      </div>
    </CardContent>
  </Card>
);

const InternalCommsCard: React.FC = () => {
  const { data, isLoading } = useNotificationsQuery();
  const notifications = (data?.notifications ?? []).slice(0, 5).map(notificationToDisplay);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" /> Internal communications & alerts
        </CardTitle>
        <CardDescription>Meeting invitations, reminders and recent updates.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            You have no new internal communications.
          </p>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} variant="page" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const EmployeeDashboardClient: React.FC = () => {
  const { data: user } = useGetMeQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Workspace</h1>
          <p className="text-muted-foreground">Your shift, meetings, attendance and updates.</p>
        </div>
        <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-3">
          <div className="rounded-full bg-primary/10 p-2">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-sm text-muted-foreground">
              {user?.role ? formatRole(user.role) : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ShiftCard />
        <MyMeetingsCard />
      </div>
      <MyAttendanceCard />
      <div className="grid gap-6 lg:grid-cols-2">
        <InternalCommsCard />
        <KpmCard />
      </div>
    </div>
  );
};
