"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useArchiveCampaignMutation,
  useDeleteCampaignMutation,
  useUnarchiveCampaignMutation,
} from "@/features/campaigns/services/mutations";
import { useCampaignQuery } from "@/features/campaigns/services/queries";
import { GROUPS_URLS } from "@/features/groups/urls";

const CampaignDangerZoneCard = () => {
  const params = useParams();
  const router = useRouter();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";
  const groupSlug = typeof params.groupSlug === "string" ? params.groupSlug : "";

  const { data: campaign, isLoading } = useCampaignQuery(campaignSlug);

  const archiveMutation = useArchiveCampaignMutation(campaign?.id || "");
  const unarchiveMutation = useUnarchiveCampaignMutation(campaign?.id || "");
  const deleteMutation = useDeleteCampaignMutation(campaign?.id || "");

  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  if (isLoading || !campaign) {
    return null;
  }

  const isArchived = campaign.status === "archived" || !campaign.is_active;
  const hasTransactions = campaign.total_raised > 0 || campaign.contributor_count > 0;

  const handleArchive = () => {
    archiveMutation.mutate();
  };

  const handleUnarchive = () => {
    unarchiveMutation.mutate();
  };

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        router.push(GROUPS_URLS.groupCampaigns(groupSlug));
      },
    });
  };

  return (
    <Card className="border-destructive/20 border-2 mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-destructive">Danger Zone</CardTitle>
        <CardDescription>Irreversible and critical actions for this campaign.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Archive Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border border-border rounded-lg bg-muted/10">
          <div>
            <h4 className="font-semibold">Archive Campaign</h4>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Archiving hides the campaign from active views but preserves all financial history.
              You can restore it later.
            </p>
          </div>
          {isArchived ? (
            <div className="flex flex-col gap-2 items-end">
              <span className="text-xs font-medium text-destructive">Currently Archived</span>
              <Button
                variant="outline"
                onClick={handleUnarchive}
                isLoading={unarchiveMutation.isPending}
              >
                Unarchive Campaign
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={handleArchive} isLoading={archiveMutation.isPending}>
              Archive Campaign
            </Button>
          )}
        </div>

        {/* Delete Section */}
        <div className="flex flex-col gap-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <div>
            <h4 className="font-semibold text-destructive">Permanently Delete Campaign</h4>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg mb-4">
              Permanently delete this campaign and all its data. This action is irreversible. Please
              type <strong>{campaign.title}</strong> below to confirm.
            </p>

            {hasTransactions && (
              <p className="text-sm font-bold text-destructive mb-3 border border-destructive/50 p-2 rounded bg-destructive/10 inline-block">
                WARNING: This campaign has processed transactions. Deleting it will permanently
                destroy financial records. Please proceed with extreme caution.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mt-2">
              <Input
                placeholder={`Type "${campaign.title}" to confirm`}
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="border-destructive/30 bg-background flex-1"
              />
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteConfirmation !== campaign.title || deleteMutation.isPending}
                isLoading={deleteMutation.isPending}
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignDangerZoneCard;
