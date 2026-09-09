"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

interface LimitBouncerModalProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: "groups" | "campaigns" | "transactions";
}

export const LimitBouncerModal: React.FC<LimitBouncerModalProps> = ({
  isOpen,
  onClose,
  limitType,
}) => {
  const router = useRouter();

  const titles = {
    groups: "Group Limit Reached",
    campaigns: "Campaign Limit Reached",
    transactions: "Transaction Limit Reached",
  };

  const descriptions = {
    groups: "You've reached the maximum number of groups allowed on your current plan.",
    campaigns:
      "You've reached the maximum number of active campaigns allowed on your current plan.",
    transactions: "You've reached your monthly transaction limit.",
  };

  const handleUpgradeClick = () => {
    onClose();
    router.push("/subscriptions");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="max-w-md w-full border-none p-0 z-[101]">
        <div className="flex flex-col items-center text-center space-y-6 p-8">
          <SiteLogo />

          <div className="bg-amber-500/10 dark:bg-amber-500/20 p-4 rounded-full mt-4">
            <IconLibrary name="lock" className="w-12 h-12 text-amber-600 dark:text-amber-500" strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              {titles[limitType]}
            </h2>
            <p className="text-muted-foreground text-sm">{descriptions[limitType]}</p>
          </div>

          <div className="w-full space-y-3 pt-4">
            <Button
              onClick={handleUpgradeClick}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold"
            >
              View Upgrade Plans
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full py-6 text-muted-foreground hover:text-foreground"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
