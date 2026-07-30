"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Children, isValidElement, useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCampaignQuery } from "@/features/campaigns/services/queries";
import { CAMPAIGNS_URLS } from "@/features/campaigns/urls";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { apiClient } from "@/lib/api-client";

interface DisableCampaignAccessPinDialogProps {
  campaignSlug: string;
  children?: React.ReactNode;
}

const DisableCampaignAccessPinDialog = ({
  campaignSlug,
  children,
}: DisableCampaignAccessPinDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();
  const { data: campaign } = useCampaignQuery(campaignSlug);
  const childrenArray = Children.toArray(children);
  const triggerElement = childrenArray.find((child) => isValidElement(child)) || null;

  const handleDisable = useCallback(async () => {
    setIsPending(true);
    try {
      await apiClient.patch(CAMPAIGNS_URLS.campaignDetail(campaignSlug), {
        settings: { require_pin: false },
      });
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignSlug] });
      toast.success("Access PIN disabled.");
      setIsOpen(false);
    } catch {
      toast.error("Failed to disable access PIN.");
    } finally {
      setIsPending(false);
    }
  }, [campaignSlug, queryClient]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerElement && <DialogTrigger render={triggerElement} />}

      <DialogContent className="sm:max-w-md p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-destructive/10 text-destructive shrink-0">
            <IconLibrary name="triangle-alert" className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-lg font-bold text-foreground leading-snug">
              Are you sure you want to disable the access PIN?
            </DialogTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Disabling your access PIN will allow anyone with the campaign link to view your
              campaign data.
            </p>
            {campaign?.slug && (
              <p className="text-xs text-muted-foreground mt-2">
                Campaign: <span className="font-semibold">{campaign.title}</span>
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-3 sm:justify-end pt-2">
          <Button
            variant="outline"
            className="flex-1 sm:flex-initial border-border text-foreground hover:bg-secondary py-6 font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 sm:flex-initial py-6 font-semibold"
            onClick={handleDisable}
            isLoading={isPending}
          >
            Yes, disable PIN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisableCampaignAccessPinDialog;
