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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCampaignQuery,
  useCampaignTransactionsQuery,
} from "@/features/campaigns/services/queries";
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
  const [sort, setSort] = useState("date-desc");
  const [methodFilter, setMethodFilter] = useState("All");
  const limit = 50;

  const { data: campaignData } = useCampaignQuery(campaignSlug);

  const { data, isLoading } = useCampaignTransactionsQuery(campaignSlug, {
    skip: (page - 1) * limit,
    limit,
    search: debouncedSearch || undefined,
    filter: methodFilter !== "All" ? methodFilter : undefined,
    sort_by: sort.split("-")[0],
    sort_order: sort.split("-")[1] as "asc" | "desc",
  });

  const contributions = data?.items ?? [];
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
          <div className="relative w-full flex-1">
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

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="h-12 px-6 border-border bg-transparent font-medium gap-2 shadow-sm w-full sm:w-auto shrink-0"
                >
                  <IconLibrary name="filter" className="w-4 h-4 text-muted-foreground" />
                  {methodFilter}
                  <IconLibrary name="chevron-down" className="w-4 h-4 text-muted-foreground" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setMethodFilter("All")}>
                All Methods
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMethodFilter("M-Pesa")}>M-Pesa</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMethodFilter("Cash")}>Cash</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMethodFilter("Pledge")}>Pledges</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="h-12 px-6 border-border bg-transparent font-medium gap-2 shadow-sm w-full sm:w-auto shrink-0"
                >
                  <IconLibrary name="filter" className="w-4 h-4 text-muted-foreground" />
                  {sort === "date-desc"
                    ? "Newest First"
                    : sort === "date-asc"
                      ? "Oldest First"
                      : sort === "amount-desc"
                        ? "Amount: High to Low"
                        : "Amount: Low to High"}
                  <IconLibrary name="chevron-down" className="w-4 h-4 text-muted-foreground" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSort("date-desc")}>Newest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("date-asc")}>Oldest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("amount-desc")}>
                Amount: High to Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("amount-asc")}>
                Amount: Low to High
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
      pagination={
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
      }
    >
      {/* Stats Summary */}
      {campaignData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Received
            </span>
            <span className="text-2xl font-bold mt-1 text-foreground">
              Ksh. {campaignData.total_raised?.toLocaleString()}
            </span>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              M-Pesa
            </span>
            <span className="text-2xl font-bold mt-1 text-primary">
              Ksh. {campaignData.total_mpesa?.toLocaleString()}
            </span>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Cash & Bank
            </span>
            <span className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-500">
              Ksh.{" "}
              {((campaignData.total_cash || 0) + (campaignData.total_bank || 0)).toLocaleString()}
            </span>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pledges
            </span>
            <span className="text-2xl font-bold mt-1 text-burnt-amber">
              Ksh. {campaignData.total_pledges?.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden mt-6">
        <ScrollArea orientation="horizontal" className="w-full">
          <CardContent className="p-0">
            <div className="min-w-full md:min-w-[700px]">
              <div className="hidden md:grid grid-cols-4 text-sm font-semibold text-muted-foreground py-4 px-6 border-b border-border bg-card">
                <span>Name</span>
                <span>Amount</span>
                <span>Date</span>
                <span className="text-right sm:text-center">Payment method</span>
              </div>

              <div className="divide-y divide-border animate-in fade-in duration-500">
                {isLoading ? (
                  ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((key) => (
                    <div
                      key={key}
                      className="flex flex-col md:grid md:grid-cols-4 md:items-center py-4 md:py-5 px-4 md:px-6 text-sm gap-3 md:gap-0"
                    >
                      <div className="flex items-center justify-between md:contents">
                        <div className="flex items-center gap-3 md:gap-4">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-4 w-20 md:hidden" />
                      </div>
                      <Skeleton className="h-4 w-20 hidden md:block" />
                      <div className="flex items-center justify-between md:contents ml-13 md:ml-0">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-6 w-20 md:mx-auto" />
                      </div>
                    </div>
                  ))
                ) : contributions.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="bg-muted/50 p-4 rounded-full mb-4">
                      <IconLibrary name="info" className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">No contributions yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-1">
                      When this campaign receives its first contribution, it will appear here.
                    </p>
                  </div>
                ) : (
                  contributions.map((item, index) => {
                    const avatarColor = avatarColors[index % avatarColors.length];
                    return (
                      <div
                        key={item.transaction_id || `tx-${index}`}
                        className="flex flex-col md:grid md:grid-cols-4 md:items-center gap-2 md:gap-0 py-4 md:py-5 px-4 md:px-6 text-sm transition-colors hover:bg-muted/50 border-b border-border md:border-none last:border-none"
                      >
                        <div className="flex items-center justify-between md:contents">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarColor}`}
                            >
                              {getInitials(item.name || "")}
                            </div>
                            <span className="font-semibold text-foreground truncate text-base md:text-sm">
                              {item.name || "Unknown"}
                            </span>
                          </div>

                          {/* Mobile amount */}
                          <span className="font-bold text-foreground md:hidden">
                            Ksh. {item.amount.toLocaleString("en-KE")}
                          </span>
                        </div>

                        {/* Desktop amount */}
                        <span className="hidden md:block font-medium text-foreground">
                          Ksh. {item.amount.toLocaleString("en-KE")}
                        </span>

                        <div className="flex items-center justify-between md:contents mt-1 md:mt-0 ml-[3.25rem] md:ml-0">
                          <span className="text-muted-foreground text-xs md:text-sm">
                            {new Date(item.date).toLocaleDateString("en-KE", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          <div className="text-right md:text-center">
                            <Badge
                              variant="secondary"
                              className={`px-3 md:px-4 py-1 md:py-1.5 font-medium shadow-sm text-[10px] md:text-xs ${
                                paymentMethodColors[item.payment_method] ||
                                "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {item.payment_method}
                            </Badge>
                          </div>
                        </div>

                        {/* Split Info & Notes */}
                        {(item.is_split || item.notes) && (
                          <div className="md:col-span-4 mt-3 ml-[3.25rem] md:ml-14 mr-4 bg-muted/30 p-3 rounded-lg border border-border">
                            {item.is_split && (
                              <Badge
                                variant="outline"
                                className="bg-primary/10 text-primary border-primary/20 text-[10px] mb-2 inline-flex items-center gap-1"
                              >
                                <IconLibrary name="split" className="w-3 h-3" />
                                Split Contribution
                              </Badge>
                            )}
                            {item.notes && (
                              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                <IconLibrary name="info" className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                <span className="italic">{item.notes}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </CardContent>
        </ScrollArea>
      </div>
    </PageLayout>
  );
};

export default CampaignContributions;
