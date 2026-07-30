"use client";

import { useState } from "react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IconLibrary from "@/features/shared/components/IconLibrary";

const chartData = [
  { date: "1 Jul", raised: 6000 },
  { date: "5 Jul", raised: 24000 },
  { date: "12 Jul", raised: 30000 },
  { date: "15 Jul", raised: 42000 },
  { date: "19 Jul", raised: 45000 },
  { date: "22 Jul", raised: 60000 },
];

const CampaignProgressCard = () => {
  const [timeRange, setTimeRange] = useState("this-year");

  const timeRangeLabel =
    {
      "this-year": "This year",
      "last-year": "Last year",
      "all-time": "All time",
    }[timeRange] || "This year";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-foreground font-sans">Progress</CardTitle>

        <Select value={timeRange} onValueChange={(val) => val && setTimeRange(val)}>
          <SelectTrigger className="border-border font-medium gap-2 w-auto h-auto py-2">
            <IconLibrary name="calendar" className="w-4 h-4 text-muted-foreground" />
            <SelectValue>{timeRangeLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent align="end" className="">
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
        {/* Radial Progress Representation */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-2xl">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* SVG Circular Progress Ring */}
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
                className="text-primary"
                strokeDasharray="70, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center flex flex-col items-center">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">70%</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Raised
              </span>
            </div>
          </div>
        </div>

        {/* Linear Trend Graph Visual Representation */}
        <div className="lg:col-span-8 bg-secondary/20 p-6 rounded-2xl flex flex-col justify-between h-52 relative w-full">
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
              data={chartData}
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
              <YAxis
                dataKey="raised"
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
                ticks={[0, 30000, 60000]}
                tickMargin={12}
                tickFormatter={(value) => (value === 0 ? "0" : `${value / 1000}k`)}
                className="text-xs font-medium text-muted-foreground"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickMargin={12}
                className="text-xs font-medium text-muted-foreground"
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
                dot={(props) => {
                  const { cx, cy, key } = props;
                  return (
                    <g key={key}>
                      <circle cx={cx} cy={cy} r={12} fill="var(--color-raised)" fillOpacity={0.2} />
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignProgressCard;
