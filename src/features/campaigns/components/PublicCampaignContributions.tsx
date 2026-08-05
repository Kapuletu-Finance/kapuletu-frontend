"use client";

import { CardContent } from "@/components/ui/card";
import type { PublicContributor } from "@/features/shared/types";
import { getInitials } from "@/lib/utils";

const avatarColors = [
  "bg-burnt-amber text-white",
  "bg-primary text-primary-foreground",
  "bg-refined-blue text-white",
  "bg-emerald-600 text-white",
];

interface PublicCampaignContributionsProps {
  contributors: PublicContributor[];
}

const PublicCampaignContributions: React.FC<PublicCampaignContributionsProps> = ({
  contributors,
}) => {
  return (
    <div className="bg-transparent rounded-2xl overflow-hidden mt-6">
      <CardContent>
        <div className="grid grid-cols-3 text-sm font-semibold text-muted-foreground pb-4 px-6 border-b border-border">
          <span>Name</span>
          <span>Amount</span>
          <span>Date</span>
        </div>

        <div className="divide-y divide-border">
          {contributors.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No contributions found.
            </div>
          ) : (
            contributors.map((item, index) => {
              const avatarColor = avatarColors[index % avatarColors.length];
              return (
                <div
                  key={`${item.name}-${item.date}-${index}`}
                  className="grid grid-cols-3 items-center py-5 px-6 text-sm transition-colors hover:bg-muted/20"
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
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </div>
  );
};

export default PublicCampaignContributions;
