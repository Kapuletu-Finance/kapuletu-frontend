"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";

const CampaignProgressCard = () => {
  return (
    <Card className="rounded-3xl border-none shadow-sm p-6 bg-card">
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-6">
        <CardTitle className="text-xl font-bold text-foreground font-sans">
          Progress
        </CardTitle>

        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="outline" className="rounded-xl border-border font-medium gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              This year
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          } />
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem>This year</DropdownMenuItem>
            <DropdownMenuItem>Last year</DropdownMenuItem>
            <DropdownMenuItem>All time</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Radial Progress Representation */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-2xl">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* SVG Circular Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
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
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Raised</span>
            </div>
          </div>
        </div>

        {/* Linear Trend Graph Visual Representation */}
        <div className="lg:col-span-8 bg-secondary/20 p-6 rounded-2xl flex flex-col justify-between h-52 relative">
          {/* Y-Axis Labels */}
          <div className="absolute left-6 top-6 bottom-12 flex flex-col justify-between text-xs font-medium text-muted-foreground pointer-events-none">
            <span>60k</span>
            <span>30k</span>
            <span>0</span>
          </div>

          {/* SVG Line Chart Viewport */}
          <div className="ml-10 h-full relative flex items-end">
            <svg className="w-full h-36 overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
              {/* Area Gradient Fill */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path
                d="M 0 110 L 40 80 L 120 70 L 220 50 L 300 45 L 380 20 L 380 120 L 0 120 Z"
                fill="url(#chartGradient)"
              />

              {/* Trend Line */}
              <path
                d="M 0 110 L 40 80 L 120 70 L 220 50 L 300 45 L 380 20"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points with Halos */}
              <g>
                <circle cx="40" cy="80" r="10" fill="var(--primary)" fillOpacity="0.2" />
                <circle cx="40" cy="80" r="4" fill="var(--primary)" />

                <circle cx="120" cy="70" r="10" fill="var(--primary)" fillOpacity="0.2" />
                <circle cx="120" cy="70" r="4" fill="var(--primary)" />

                <circle cx="220" cy="50" r="10" fill="var(--primary)" fillOpacity="0.2" />
                <circle cx="220" cy="50" r="4" fill="var(--primary)" />

                <circle cx="300" cy="45" r="10" fill="var(--primary)" fillOpacity="0.2" />
                <circle cx="300" cy="45" r="4" fill="var(--primary)" />

                <circle cx="380" cy="20" r="12" fill="var(--primary)" fillOpacity="0.2" />
                <circle cx="380" cy="20" r="5" fill="var(--primary)" />
              </g>
            </svg>
          </div>

          {/* X-Axis Labels */}
          <div className="ml-10 flex justify-between text-xs font-medium text-muted-foreground pt-2 border-t border-border">
            <span>1 Jul</span>
            <span>5 Jul</span>
            <span>12 Jul</span>
            <span>15 Jul</span>
            <span>19 Jul</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignProgressCard;