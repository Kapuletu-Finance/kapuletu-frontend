"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import Pagination from "@/features/shared/components/Pagination";

interface Contribution {
  id: string;
  name: string;
  amount: string;
  date: string;
  paymentMethod: "M-pesa" | "Cash";
  avatarBg: string;
}

const contributions: Contribution[] = [
  {
    id: "1",
    name: "John Doe",
    amount: "Ksh. 500",
    date: "13 Jul 2026, 10:55 AM",
    paymentMethod: "M-pesa",
    avatarBg: "bg-burnt-amber text-white",
  },
  {
    id: "2",
    name: "Jane Doe",
    amount: "Ksh. 500",
    date: "13 Jul 2026, 10:55 AM",
    paymentMethod: "Cash",
    avatarBg: "bg-primary text-primary-foreground",
  },
  {
    id: "3",
    name: "John Doe",
    amount: "Ksh. 500",
    date: "13 Jul 2026, 10:55 AM",
    paymentMethod: "M-pesa",
    avatarBg: "bg-refined-blue text-white",
  },
  {
    id: "4",
    name: "John Doe",
    amount: "Ksh. 500",
    date: "13 Jul 2026, 10:55 AM",
    paymentMethod: "M-pesa",
    avatarBg: "bg-burnt-amber text-white",
  },
  {
    id: "5",
    name: "John Doe",
    amount: "Ksh. 500",
    date: "13 Jul 2026, 10:55 AM",
    paymentMethod: "Cash",
    avatarBg: "bg-primary text-primary-foreground",
  },
  {
    id: "6",
    name: "John Doe",
    amount: "Ksh. 500",
    date: "13 Jul 2026, 10:55 AM",
    paymentMethod: "M-pesa",
    avatarBg: "bg-refined-blue text-white",
  },
  {
    id: "7",
    name: "John Doe",
    amount: "Ksh. 500",
    date: "13 Jul 2026, 10:55 AM",
    paymentMethod: "M-pesa",
    avatarBg: "bg-burnt-amber text-white",
  },
  {
    id: "8",
    name: "John Doe",
    amount: "Ksh. 500",
    date: "13 Jul 2026, 10:55 AM",
    paymentMethod: "Cash",
    avatarBg: "bg-primary text-primary-foreground",
  },
  {
    id: "9",
    name: "John Doe",
    amount: "Ksh. 500",
    date: "13 Jul 2026, 10:55 AM",
    paymentMethod: "M-pesa",
    avatarBg: "bg-refined-blue text-white",
  },
];

const CampaignContributions = () => {
  return (
    <PageLayout
      className="p-0"
      controls={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          {/* Search Input */}
          <div className="relative w-full max-w-2xl">
            <IconLibrary
              name="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            />
            <Input
              placeholder="Search contribution..."
              className="pl-10 h-12 bg-muted/30 border-muted text-sm shadow-sm"
            />
          </div>

          {/* Time Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="h-12 px-6 border-border bg-transparent font-medium gap-2 shadow-sm w-full sm:w-auto shrink-0"
                >
                  <IconLibrary name="calendar" className="w-4 h-4 text-muted-foreground" />
                  This year
                  <IconLibrary name="chevron-down" className="w-4 h-4 text-muted-foreground" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="">
              <DropdownMenuItem>This year</DropdownMenuItem>
              <DropdownMenuItem>Last year</DropdownMenuItem>
              <DropdownMenuItem>All time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
      pagination={<Pagination currentPage={1} totalPages={10} />}
    >
      <div className="bg-transparent rounded-2xl overflow-hidden mt-6">
        <CardContent>
          {/* Table Header */}
          <div className="grid grid-cols-4 text-sm font-semibold text-muted-foreground pb-4 px-6 border-b border-border">
            <span>Name</span>
            <span>Amount</span>
            <span>Date</span>
            <span className="text-right sm:text-center">Payment method</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-border">
            {contributions.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-4 items-center py-5 px-6 text-sm transition-colors hover:bg-muted/20"
              >
                {/* Name & Avatar */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${item.avatarBg}`}
                  >
                    JD
                  </div>
                  <span className="font-semibold text-foreground truncate">{item.name}</span>
                </div>

                {/* Amount */}
                <span className="font-medium text-foreground">{item.amount}</span>

                {/* Date */}
                <span className="text-muted-foreground">{item.date}</span>

                {/* Payment Method Badge */}
                <div className="text-right sm:text-center">
                  <Badge
                    variant="secondary"
                    className={`px-4 py-1.5 font-medium shadow-sm ${
                      item.paymentMethod === "M-pesa"
                        ? "bg-primary/10 text-primary hover:bg-primary/15"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {item.paymentMethod}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </PageLayout>
  );
};

export default CampaignContributions;
