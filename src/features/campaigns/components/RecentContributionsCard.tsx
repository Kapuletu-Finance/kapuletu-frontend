"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaignTransactionsQuery } from "@/features/campaigns/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { getInitials } from "@/lib/utils";

const paymentMethodColors: Record<string, string> = {
  "M-pesa": "bg-primary/10 text-primary hover:bg-primary/15",
  "M-PESA": "bg-primary/10 text-primary hover:bg-primary/15",
  MPESA: "bg-primary/10 text-primary hover:bg-primary/15",
};

const avatarColors = [
  "bg-burnt-amber text-white",
  "bg-primary text-primary-foreground",
  "bg-refined-blue text-white",
  "bg-emerald-600 text-white",
];

const RecentContributionsCard = () => {
  const params = useParams();
  const groupSlug = params?.groupSlug;
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";

  const contributionsLink =
    groupSlug && campaignSlug
      ? `/treasurer/groups/${groupSlug}/campaigns/${campaignSlug}/contributions`
      : "#";

  const { data, isLoading } = useCampaignTransactionsQuery(campaignSlug, { limit: 5 });

  const contributions = data?.items ?? [];

  return (
    <Card className="border-none bg-card overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          RECENT CONTRIBUTIONS
        </h2>
        <Link
          href={contributionsLink}
          className="text-sm font-semibold text-primary hover:underline"
        >
          View All
        </Link>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[500px]">
          <div className="grid grid-cols-4 text-xs font-semibold text-muted-foreground py-4 px-6 border-b border-border bg-card">
            <span>Name</span>
            <span>Amount</span>
            <span>Date</span>
            <span className="text-right">Payment method</span>
          </div>

          <div className="divide-y divide-border animate-in fade-in duration-500">
            {isLoading ? (
              ["sk-1", "sk-2", "sk-3", "sk-4"].map((key) => (
                <div key={key} className="grid grid-cols-4 items-center py-4 px-6 text-sm">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-16 ml-auto" />
                </div>
              ))
            ) : contributions.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="bg-muted/50 p-3 rounded-full mb-3">
                  <IconLibrary name="info" className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">No recent contributions</h3>
              </div>
            ) : (
              contributions.map((item, index) => {
                const avatarColor = avatarColors[index % avatarColors.length];
                return (
                  <div
                    key={item.transaction_id || `tx-${index}`}
                    className="grid grid-cols-4 items-center py-4 px-6 text-sm transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${avatarColor}`}
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

                    <span className="text-muted-foreground text-xs">
                      {new Date(item.date).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <div className="text-right">
                      <Badge
                        variant="secondary"
                        className={`px-3 py-1 font-medium text-xs ${
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
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentContributionsCard;
