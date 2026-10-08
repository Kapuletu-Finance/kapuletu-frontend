"use client";

import { Clock, Mail, Phone, Shield } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeAccessTab } from "@/features/admin/components/employee-profile/EmployeeAccessTab";
import { EmployeeActivityTab } from "@/features/admin/components/employee-profile/EmployeeActivityTab";
import { EmployeeAttendanceTab } from "@/features/admin/components/employee-profile/EmployeeAttendanceTab";
import { EmployeeMeetingsTab } from "@/features/admin/components/employee-profile/EmployeeMeetingsTab";
import { EmployeeOverviewTab } from "@/features/admin/components/employee-profile/EmployeeOverviewTab";
import { EmployeeProfileHeader } from "@/features/admin/components/employee-profile/EmployeeProfileHeader";
import { useEmployeeProfileQuery } from "@/features/admin/services/employeeProfile";
import { useAdminPendingInvitesQuery } from "@/features/admin/services/queries";
import { useGetMeQuery } from "@/features/auth/services/queries";
import { formatRole } from "@/features/hr/utils";

/** Directory links use the invite id for people who haven't finished account setup. */
const PendingInvite: React.FC<{ inviteId: string }> = ({ inviteId }) => {
  const { data: invites, isLoading } = useAdminPendingInvitesQuery();
  const invite = invites?.find((inv) => inv.id === inviteId);

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (!invite) {
    return (
      <div className="space-y-4 py-12 text-center">
        <h2 className="text-xl font-semibold">Employee not found</h2>
        <Link href="/admin/employees" className={buttonVariants()}>
          Back to directory
        </Link>
      </div>
    );
  }
  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <CardHeader>
        <CardTitle>
          {invite.first_name} {invite.last_name} · pending invitation
        </CardTitle>
        <CardDescription>
          This person hasn&apos;t completed their account setup yet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" /> {invite.email}
        </p>
        {invite.phone_number && (
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" /> {invite.phone_number}
          </p>
        )}
        <p className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" /> {formatRole(invite.role)} ·{" "}
          {invite.permissions?.length ?? 0} permissions granted
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" /> Invitation expires{" "}
          {new Date(invite.expires_at).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};

export const EmployeeProfilePage: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: employee, isLoading, isError } = useEmployeeProfileQuery(userId);
  const { data: me } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (isError || !employee) return <PendingInvite inviteId={userId} />;

  const isSuperAdmin = me?.role === "super_admin";
  const isSelf = me?.user_id === employee.user_id;

  return (
    <div className="space-y-6">
      <EmployeeProfileHeader employee={employee} canManageAccount={isSuperAdmin} isSelf={isSelf} />
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="access">Access</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <EmployeeOverviewTab employee={employee} />
        </TabsContent>
        <TabsContent value="attendance">
          <EmployeeAttendanceTab employee={employee} />
        </TabsContent>
        <TabsContent value="meetings">
          <EmployeeMeetingsTab userId={employee.user_id} />
        </TabsContent>
        <TabsContent value="access">
          {/* Keyed so the form resets after a save refreshes the profile. */}
          <EmployeeAccessTab
            key={`${employee.role}-${employee.permissions.join(",")}-${employee.first_name}-${employee.last_name}-${employee.phone_number}`}
            employee={employee}
            canEdit={isSuperAdmin}
            isSelf={isSelf}
          />
        </TabsContent>
        <TabsContent value="activity">
          <EmployeeActivityTab userId={employee.user_id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
