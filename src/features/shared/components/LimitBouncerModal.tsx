"use client";

import { Lock, Zap } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center border-t-4 border-t-amber-500">
        <DialogHeader className="flex flex-col items-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
            <Lock className="h-6 w-6 text-amber-600 dark:text-amber-500" />
          </div>
          <DialogTitle className="text-xl">{titles[limitType]}</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {descriptions[limitType]}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 p-4 rounded-lg my-4 flex flex-col items-center">
          <Zap className="h-8 w-8 text-primary mb-2" />
          <h4 className="font-semibold text-foreground">Upgrade to Professional</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Unlock unlimited groups, campaigns, and advanced analytics by upgrading to the Pro plan
            today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full mt-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Maybe Later
          </Button>
          <Link href="/subscriptions" onClick={onClose} className="w-full sm:w-auto">
            <Button className="w-full">View Upgrade Plans</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};
