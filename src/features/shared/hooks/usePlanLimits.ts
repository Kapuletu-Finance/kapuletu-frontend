import { useMemo } from "react";
import { useGetMySubscriptionQuery } from "@/features/auth/services/queries";

export const usePlanLimits = () => {
  const { data: subscription, isPending } = useGetMySubscriptionQuery();

  return useMemo(() => {
    let canCreateGroup = true;
    let canCreateCampaign = true;

    const hasFeature = (featureName: string) => {
      if (!subscription?.allowed_features) return false;
      return !!subscription.allowed_features[featureName];
    };

    if (subscription?.usage) {
      // Parse groups usage (e.g. "1/2")
      const [currentGroups, maxGroups] = subscription.usage.groups.split("/");
      if (maxGroups && maxGroups.toLowerCase() !== "unlimited") {
        canCreateGroup = parseInt(currentGroups, 10) < parseInt(maxGroups, 10);
      }

      // Parse campaigns usage (e.g. "3/5")
      const [currentCampaigns, maxCampaigns] = subscription.usage.campaigns.split("/");
      if (maxCampaigns && maxCampaigns.toLowerCase() !== "unlimited") {
        canCreateCampaign = parseInt(currentCampaigns, 10) < parseInt(maxCampaigns, 10);
      }
    }

    return {
      canCreateGroup,
      canCreateCampaign,
      hasFeature,
      isPending,
    };
  }, [subscription, isPending]);
};
