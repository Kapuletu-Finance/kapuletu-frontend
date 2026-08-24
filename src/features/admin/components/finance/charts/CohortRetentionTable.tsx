"use client";

import type React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCohortsQuery } from "@/features/admin/services/queries";

export const CohortRetentionTable: React.FC = () => {
  const { data: cohorts, isLoading } = useAdminCohortsQuery();

  if (isLoading) {
    return <Skeleton className="w-full h-[400px] rounded-xl" />;
  }

  const getHeatmapColor = (percentage: number) => {
    if (percentage === 100) return "bg-primary/20 text-foreground";
    if (percentage >= 90) return "bg-primary/40 text-primary-foreground font-medium";
    if (percentage >= 80) return "bg-primary/60 text-primary-foreground font-medium";
    if (percentage >= 70) return "bg-primary/80 text-primary-foreground font-semibold";
    return "bg-primary text-primary-foreground font-bold";
  };

  return (
    <Card className="col-span-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Cohort Retention Analysis</CardTitle>
        <CardDescription>
          User retention percentages tracked by signup month (Heatmap).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 font-medium text-muted-foreground border-b min-w-[100px]">
                  Cohort
                </th>
                <th className="p-3 font-medium text-muted-foreground border-b min-w-[80px]">
                  Users
                </th>
                {[...Array(12)].map((_, i) => (
                  <th
                    key={"month-" + i}
                    className="p-3 font-medium text-muted-foreground border-b text-center min-w-[60px]"
                  >
                    Month {i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohorts?.map((row) => (
                <tr
                  key={row.cohort}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3 font-semibold">{row.cohort}</td>
                  <td className="p-3 text-muted-foreground">{row.users}</td>
                  {[...Array(12)].map((_, i) => {
                    const percentage = row.retention[i];
                    if (percentage === undefined || percentage === null) {
                      return (
                        <td key={"month-" + i} className="p-3 text-center text-muted-foreground/30">
                          -
                        </td>
                      );
                    }
                    return (
                      <td key={"month-" + i} className="p-1">
                        <div
                          className={`w-full h-full p-2 text-center rounded-md transition-all duration-300 hover:scale-105 ${getHeatmapColor(percentage)}`}
                        >
                          {percentage}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {(!cohorts || cohorts.length === 0) && (
                <tr>
                  <td colSpan={14} className="p-6 text-center text-muted-foreground">
                    No cohort data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
