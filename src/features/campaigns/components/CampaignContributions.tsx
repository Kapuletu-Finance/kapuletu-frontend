"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaignTransactionsQuery } from "@/features/campaigns/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import Pagination from "@/features/shared/components/Pagination";
import { getInitials } from "@/lib/utils";

const avatarColors = [
  "bg-burnt-amber text-white",
  "bg-primary text-primary-foreground",
  "bg-refined-blue text-white",
  "bg-emerald-600 text-white",
];

const paymentMethodColors: Record<string, string> = {
  "M-pesa": "bg-primary/10 text-primary hover:bg-primary/15",
  "M-PESA": "bg-primary/10 text-primary hover:bg-primary/15",
  MPESA: "bg-primary/10 text-primary hover:bg-primary/15",
};

const CampaignContributions = () => {
  const params = useParams();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("This year");
  const limit = 10;

  const { data, isLoading } = useCampaignTransactionsQuery(campaignSlug, {
    skip: (page - 1) * limit,
    limit,
    search: debouncedSearch || undefined,
  });

  const transactions = data?.items ?? [];
  const totalPages = data?.total_pages ?? 1;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  };

  return (
    <PageLayout
      className="p-0"
      controls={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <div className="relative w-full max-w-2xl">
            <IconLibrary
              name="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            />
            <Input
              placeholder="Search contribution..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-12 bg-muted/30 border-muted text-sm shadow-sm"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="h-12 px-6 border-border bg-transparent font-medium gap-2 shadow-sm w-full sm:w-auto shrink-0"
                >
                  <IconLibrary name="calendar" className="w-4 h-4 text-muted-foreground" />
                  {timeFilter}
                  <IconLibrary name="chevron-down" className="w-4 h-4 text-muted-foreground" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeFilter("This year")}>
                This year
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter("Last year")}>
                Last year
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter("All time")}>
                All time
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
      pagination={
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
      }
    >
      <div className="bg-transparent rounded-2xl overflow-hidden mt-6">
        <CardContent>
          <div className="grid grid-cols-4 text-sm font-semibold text-muted-foreground pb-4 px-6 border-b border-border">
            <span>Name</span>
            <span>Amount</span>
            <span>Date</span>
            <span className="text-right sm:text-center">Payment method</span>
          </div>

          <div className="divide-y divide-border">
            {isLoading ? (
              ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((key) => (
                <div key={key} className="grid grid-cols-4 items-center py-5 px-6 text-sm">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-6 w-20 ml-auto sm:mx-auto" />
                </div>
              ))
            ) : transactions.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No contributions found.
              </div>
            ) : (
              transactions.map((item, index) => {
                const avatarColor = avatarColors[index % avatarColors.length];
                return (
                  <div
                    key={item.transaction_id || `tx-${index}`}
                    className="grid grid-cols-4 items-center py-5 px-6 text-sm transition-colors hover:bg-muted/20"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarColor}`}
                      >
                        {getInitials(item.name || "")}
                      </div>
                      <span className="font-semibold text-foreground truncate">
                        {item.name || "Unknown"}
                      </span>
                    </div>

                    <span className="font-medium text-foreground">
                      Ksh. {item.amount.toLocaleString("en-KE")}
                    </span>

                    <span className="text-muted-foreground">
                      {new Date(item.date).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <div className="text-right sm:text-center">
                      <Badge
                        variant="secondary"
                        className={`px-4 py-1.5 font-medium shadow-sm ${
                          paymentMethodColors[item.payment_method] ||
                          "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {item.payment_method}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </div>
    </PageLayout>
  );
};

export default CampaignContributions;
