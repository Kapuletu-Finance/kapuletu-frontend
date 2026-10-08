"use client";

import type React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { AttendanceTrendPoint } from "@/features/hr/types";

const chartConfig = {
  absent: { color: "#dc2626", label: "Absent" },
  late: { color: "#d97706", label: "Late" },
  onTime: { color: "var(--primary)", label: "On time" },
} satisfies ChartConfig;

/** Stacked scheduled days per bucket: on time, late, absent. */
export const AttendanceTrendChart: React.FC<{ trend: AttendanceTrendPoint[] }> = ({ trend }) => {
  const data = trend.map((point) => ({
    absent: point.absent,
    label: point.label,
    late: point.late,
    onTime: point.attended - point.late,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          interval="preserveStartEnd"
        />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="onTime" stackId="days" fill="var(--color-onTime)" />
        <Bar dataKey="late" stackId="days" fill="var(--color-late)" />
        <Bar dataKey="absent" stackId="days" fill="var(--color-absent)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
};
