"use client";

import { CardContent } from "@/components/ui/card";
import IconLibrary from "@/features/shared/components/IconLibrary";
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
    <div className="bg-card border border-border shadow-sm rounded-xl overflow-x-auto mt-6">
      <CardContent className="p-0 min-w-[500px]">
        <div className="grid grid-cols-3 text-sm font-semibold text-muted-foreground py-4 px-6 border-b border-border sticky top-0 z-10 bg-card">
          <span>Name</span>
          <span>Amount</span>
          <span>Date</span>
        </div>

        <div className="divide-y divide-border animate-in fade-in duration-500">
          {contributors.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="bg-muted/50 p-4 rounded-full mb-4">
                <IconLibrary name="info" className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No contributions yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1">
                Be the first to support this campaign!
              </p>
            </div>
          ) : (
            contributors.map((item, index) => {
              const avatarColor = avatarColors[index % avatarColors.length];
              return (
                <div
                  key={`${item.name}-${item.date}-${index}`}
                  className="grid grid-cols-3 items-center py-5 px-6 text-sm transition-colors hover:bg-muted/50"
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
