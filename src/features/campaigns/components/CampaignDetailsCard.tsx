"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EditCampaignFormDialog from "@/features/campaigns/components/EditCampaignFormDialog";
import { useCampaignQuery } from "@/features/campaigns/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

const CampaignDetailsCard = () => {
  const params = useParams();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";

  const { data: campaign } = useCampaignQuery(campaignSlug);

  const isArchived = campaign?.status !== "active";

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <h2 className="font-bold text-foreground text-xl">Campaign Details</h2>
          <p className="text-xs text-muted-foreground">View and update your campaign details</p>
        </div>
        <EditCampaignFormDialog>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold">
            <IconLibrary name="edit" className="w-4 h-4" /> Edit
          </Button>
        </EditCampaignFormDialog>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 items-center py-2">
          <span className="text-sm font-medium text-muted-foreground">Name</span>
          <span className="md:col-span-3 text-sm font-semibold text-foreground">
            {campaign?.title}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 items-center py-2">
          <span className="text-sm font-medium text-muted-foreground">Description</span>
          <span className="md:col-span-3 text-sm font-semibold text-foreground">
            {campaign?.description || "No description"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 items-center py-2">
          <span className="text-sm font-medium text-muted-foreground">Payment Instructions</span>
          <span className="md:col-span-3 text-sm font-semibold text-foreground">
            {campaign?.payment_instructions || "No payment instructions"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 items-center py-2">
          <span className="text-sm font-medium text-muted-foreground">Status</span>
          <div className="md:col-span-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                isArchived ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isArchived ? "bg-muted-foreground" : "bg-primary",
                )}
              />
              {isArchived ? "Archived" : "Active"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignDetailsCard;
