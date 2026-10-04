import { format } from "date-fns";
import type React from "react";
import { useAdminAuditLogsQuery } from "../services/queries";

export const AdminAuditClient: React.FC = () => {
  const { data: logs, isLoading, error } = useAdminAuditLogsQuery(100);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading audit logs...
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-destructive">Failed to load audit logs.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
      </div>
      <div className="text-muted-foreground mb-6">
        Global activity feed for tracking sensitive actions across the platform.
      </div>

      <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-xs uppercase bg-muted/50 border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
                <th scope="col" className="px-6 py-3">
                  Employee ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Resource ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {logs?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No audit logs found.
                  </td>
                </tr>
              )}
              {logs?.map((log) => (
                <tr key={log.log_id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium whitespace-nowrap">
                    {format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss")}
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">{log.action_type}</td>
                  <td className="px-6 py-4 font-mono text-xs">{log.employee_id || "N/A"}</td>
                  <td className="px-6 py-4 font-mono text-xs">{log.resource_id || "N/A"}</td>
                  <td className="px-6 py-4">
                    <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto max-w-[250px]">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
