"use client";

import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceRegisterTab } from "@/features/hr/components/admin/attendance/AttendanceRegisterTab";
import { MeetingsTab } from "@/features/hr/components/admin/meetings/MeetingsTab";
import { AttendanceReportsTab } from "@/features/hr/components/admin/reports/AttendanceReportsTab";
import { WorkScheduleTab } from "@/features/hr/components/admin/schedule/WorkScheduleTab";
import { PageLayout } from "@/features/shared/components/PageLayout";

export const AdminHrPage: React.FC = () => (
  <PageLayout
    title="Meetings & Attendance"
    subtitle="Schedule meetings, track attendance, issue official reports, and set which days the team works in the office or online."
  >
    <Tabs defaultValue="meetings" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="meetings">Meetings</TabsTrigger>
        <TabsTrigger value="register">Attendance register</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="schedule">Schedule & locations</TabsTrigger>
      </TabsList>
      <TabsContent value="meetings">
        <MeetingsTab />
      </TabsContent>
      <TabsContent value="register">
        <AttendanceRegisterTab />
      </TabsContent>
      <TabsContent value="reports">
        <AttendanceReportsTab />
      </TabsContent>
      <TabsContent value="schedule">
        <WorkScheduleTab />
      </TabsContent>
    </Tabs>
  </PageLayout>
);
