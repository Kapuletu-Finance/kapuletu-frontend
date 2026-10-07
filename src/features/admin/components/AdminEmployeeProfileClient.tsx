"use client";

import {
  Activity,
  ArrowLeft,
  BarChart3,
  Calendar,
  Clock,
  ListOrdered,
  Shield,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAdminEmployeesQuery,
  useAdminPendingInvitesQuery,
  useAuditLogsQuery,
  useEmployeeMetricsQuery,
} from "@/features/admin/services/queries";
import { useConfirmReportMutation } from "@/features/hr/services/mutations";
import { useEmployeeReportsQuery } from "@/features/hr/services/queries";

const AuditLogsList = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useAuditLogsQuery({ actor_id: userId, page: 1, limit: 10 });

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (!data?.logs || data.logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground bg-muted/10 rounded border border-dashed">
        <ListOrdered className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No audit trail activity found for this user.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.logs.map((log: any) => (
        <div
          key={log.log_id}
          className="p-3 text-sm border-b last:border-0 flex justify-between items-start"
        >
          <div>
            <span className="font-semibold text-primary block">{log.action}</span>
            <span className="text-muted-foreground">
              {log.entity_type} {log.entity_id ? `(${log.entity_id})` : ""}
            </span>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {new Date(log.timestamp).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export const AdminEmployeeProfileClient = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const { data: employees, isLoading: isLoadingEmployees } = useAdminEmployeesQuery();
  const { data: invites, isLoading: isLoadingInvites } = useAdminPendingInvitesQuery();
  const { data: reports, isLoading: isLoadingReports } = useEmployeeReportsQuery(userId);
  const { data: metrics, isLoading: isLoadingMetrics } = useEmployeeMetricsQuery(userId);
  const confirmMutation = useConfirmReportMutation();

  const employee = useMemo(() => {
    return employees?.find((emp: any) => emp.user_id === userId);
  }, [employees, userId]);

  const invite = useMemo(() => {
    return invites?.find((inv: any) => inv.id === userId);
  }, [invites, userId]);

  if (isLoadingEmployees || isLoadingInvites) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (invite && !employee) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/employees")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {invite.first_name} {invite.last_name}
            </h1>
            <p className="text-muted-foreground">{invite.email}</p>
          </div>
        </div>

        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle>Pending Invitation</CardTitle>
            <CardDescription>This user has not yet completed their account setup.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium capitalize">{invite.role.replace("_", " ")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>{invite.permissions?.length || 0} Modules Granted</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span>
                Status: <span className="text-amber-600 font-medium">Pending Setup</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Employee Not Found</h2>
        <Button onClick={() => router.push("/admin/employees")}>Back to Directory</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/employees")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {employee.first_name} {employee.last_name}
          </h1>
          <p className="text-muted-foreground">{employee.email}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium capitalize">{employee.role.replace("_", " ")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>{employee.permissions?.length || 0} Modules Granted</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span>
                Status:{" "}
                <span
                  className={
                    employee.is_active ? "text-green-600 font-medium" : "text-red-600 font-medium"
                  }
                >
                  {employee.is_active ? "Active" : "Suspended"}
                </span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Real-time metrics and activity over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMetrics ? (
              <Skeleton className="h-40 w-full" />
            ) : !metrics ? (
              <div className="text-sm text-muted-foreground">No metrics available.</div>
            ) : (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col gap-6 w-full md:w-1/3 shrink-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Hours Logged</p>
                    <p className="text-3xl font-bold">{metrics.total_hours_logged}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Actions Performed</p>
                    <p className="text-3xl font-bold">{metrics.total_actions_performed}</p>
                  </div>
                </div>
                <div className="w-full h-[180px]">
                  {metrics.activity_trend.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.activity_trend}>
                        <XAxis
                          dataKey="date"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="actions"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="stroke-primary"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded">
                      No activity data for the past week
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="work" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="work" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Work Reports
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="work">
          <Card>
            <CardHeader>
              <CardTitle>Work Reports</CardTitle>
              <CardDescription>Logs of employee activities and task progression.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingReports ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : !reports || reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/20 rounded-md border border-dashed">
                  <Calendar className="h-10 w-10 mb-4 opacity-50" />
                  <p className="font-medium">No recent work reports available.</p>
                  <p className="text-sm mt-1">
                    This employee has not submitted any daily reports yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report: any) => (
                    <div
                      key={report.id}
                      className="p-4 border rounded-lg flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">
                            {new Date(report.report_date).toLocaleDateString()}
                          </span>
                          <Badge
                            variant={
                              report.status === "confirmed"
                                ? "default"
                                : report.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {report.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {report.work_summary || "No work summary provided."}
                        </p>
                        <div className="text-xs text-muted-foreground flex items-center gap-4 mt-2">
                          <span>
                            In:{" "}
                            {report.clock_in_time
                              ? new Date(report.clock_in_time).toLocaleTimeString()
                              : "N/A"}
                          </span>
                          <span>
                            Out:{" "}
                            {report.clock_out_time
                              ? new Date(report.clock_out_time).toLocaleTimeString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                      {report.status === "pending_review" && (
                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="default"
                            size="sm"
                            disabled={confirmMutation.isPending}
                            onClick={() =>
                              confirmMutation.mutate({ reportId: report.id, status: "confirmed" })
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={confirmMutation.isPending}
                            onClick={() =>
                              confirmMutation.mutate({ reportId: report.id, status: "rejected" })
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Audit logs and actions for this employee.</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditLogsList userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
