"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaignChartDataQuery, useCampaignQuery } from "@/features/campaigns/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { useConfetti } from "@/hooks/useConfetti";

const timeRangeToFilter: Record<string, string> = {
  "this-year": "this_year",
  "last-year": "last_year",
  "all-time": "all_time",
};

const timeRangeLabel: Record<string, string> = {
  "this-year": "This year",
  "last-year": "Last year",
  "all-time": "All time",
};

const CampaignProgressCard = () => {
  const params = useParams();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";
  const [timeRange, setTimeRange] = useState("this-year");

  const filter = timeRangeToFilter[timeRange] || "this_year";
  const { data: campaign } = useCampaignQuery(campaignSlug);
  const { data: chartData, isLoading } = useCampaignChartDataQuery(campaignSlug, filter);

  const progress = campaign?.progress_percentage ?? 0;
  const isGoalMet = progress >= 100;
  const surplusPercentage = Math.max(0, progress - 100);
  const { fireConfetti } = useConfetti();

  useEffect(() => {
    if (isGoalMet) {
      fireConfetti();
    }
  }, [isGoalMet, fireConfetti]);

  const displayData = chartData?.length
    ? chartData.map((d) => ({ date: d.date, raised: d.amount }))
    : [];

  const maxValue = displayData.length ? Math.max(...displayData.map((d) => d.raised), 1) : 100000;

  const yTicks = [0, Math.round(maxValue / 2), Math.round(maxValue)];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-foreground font-sans">Progress</CardTitle>

        <Select value={timeRange} onValueChange={(val) => val && setTimeRange(val)}>
          <SelectTrigger className="border-border font-medium gap-2 w-auto h-auto py-2">
            <IconLibrary name="calendar" className="w-4 h-4 text-muted-foreground" />
            <SelectValue>{timeRangeLabel[timeRange] || "This year"}</SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="this-year" label="This year">
              This year
            </SelectItem>
            <SelectItem value="last-year" label="Last year">
              Last year
            </SelectItem>
            <SelectItem value="all-time" label="All time">
              All time
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-2xl">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <title>Progress Ring</title>
              <path
                className="text-secondary"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`text-primary transition-all duration-1000 ease-out ${isGoalMet ? "drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" : ""}`}
                strokeDasharray={`${Math.min(progress, 100)}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* SURPLUS RING */}
              {surplusPercentage > 0 && (
                <path
                  className="text-amber-500 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                  strokeDasharray={`${Math.min(surplusPercentage, 100)}, 100`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              )}
            </svg>
            <div className="absolute text-center flex flex-col items-center">
              {isLoading ? (
                <span className="text-3xl font-extrabold text-foreground tracking-tight">...</span>
              ) : isGoalMet ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                  <IconLibrary name="badge-check" className="w-8 h-8 text-primary mb-1" />
                  <span className="text-sm font-bold text-foreground tracking-tight leading-none text-center">
                    Target
                    <br />
                    Met!
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-3xl font-extrabold text-foreground tracking-tight">
                    {`${Math.round(progress)}%`}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Raised
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-secondary/20 p-6 rounded-2xl flex flex-col justify-between h-52 relative w-full">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="w-full h-40" />
            </div>
          ) : displayData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              No data available for this period.
            </div>
          ) : (
            <ChartContainer
              config={{
                raised: {
                  label: "Raised",
                  color: "var(--primary)",
                },
              }}
              className="w-full h-full min-h-37.5"
            >
              <AreaChart
                data={displayData}
                margin={{
                  left: -20,
                  right: 12,
                  top: 24,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="fillRaised" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-raised)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-raised)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--primary)"
                  strokeOpacity={0.15}
                  strokeDasharray="4 4"
                />
                <YAxis
                  dataKey="raised"
                  tickLine={false}
                  axisLine={{ stroke: "var(--primary)", strokeWidth: 1.5 }}
                  ticks={yTicks}
                  tickMargin={12}
                  tickFormatter={(value: number) =>
                    value === 0 ? "0" : `${Math.round(value / 1000)}k`
                  }
                  className="text-xs font-medium text-muted-foreground"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: "var(--primary)", strokeWidth: 1.5 }}
                  tickMargin={12}
                  className="text-xs font-medium text-muted-foreground"
                  tickFormatter={(val) => {
                    if (!val) return "";
                    // Support "YYYY-MM" downsampling by checking length
                    if (val.length === 7) {
                      const d = new Date(`${val}-01`);
                      if (Number.isNaN(d.getTime())) return val;
                      return d.toLocaleString("default", { month: "short", year: "2-digit" });
                    }
                    const d = new Date(val);
                    if (Number.isNaN(d.getTime())) return val;
                    return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
                  }}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area
                  type="linear"
                  dataKey="raised"
                  fill="url(#fillRaised)"
                  fillOpacity={1}
                  stroke="var(--color-raised)"
                  strokeWidth={2}
                  activeDot={{
                    r: 8,
                    strokeWidth: 0,
                    fill: "var(--color-raised)",
                  }}
                  dot={(props: Record<string, unknown>) => {
                    const { cx, cy, key } = props as { cx?: number; cy?: number; key?: string };
                    return (
                      <g key={key}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={12}
                          fill="var(--color-raised)"
                          fillOpacity={0.2}
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r={4.5}
                          fill="var(--color-raised)"
                          stroke="hsl(var(--background))"
                          strokeWidth={1.5}
                        />
                      </g>
                    );
                  }}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignProgressCard;
