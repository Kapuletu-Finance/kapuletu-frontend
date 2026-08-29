"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetMeQuery } from "@/features/auth/services/queries";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const SNOOZE_KEY = "kapuletu_2fa_snooze_until";
const SKIP_COUNT_KEY = "kapuletu_2fa_skip_count";
const BACKOFF_DAYS = [1, 3, 7, 14, 30, 90];

export const SecurityNudgeModal = () => {
  const { data: user, isLoading } = useGetMeQuery();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !user) return;

    if (user.two_factor_enabled) {
      setIsOpen(false);
      return;
    }

    const snoozeUntil = localStorage.getItem(SNOOZE_KEY);
    if (snoozeUntil && new Date().getTime() < parseInt(snoozeUntil, 10)) {
      return;
    }

    // Only show if not enabled and snooze has expired or doesn't exist
    setIsOpen(true);
  }, [user, isLoading]);

  const handleSnooze = () => {
    const currentSkipCount = parseInt(localStorage.getItem(SKIP_COUNT_KEY) || "0", 10);
    const snoozeDays = BACKOFF_DAYS[Math.min(currentSkipCount, BACKOFF_DAYS.length - 1)];

    const snoozeDate = new Date();
    snoozeDate.setDate(snoozeDate.getDate() + snoozeDays);

    localStorage.setItem(SNOOZE_KEY, snoozeDate.getTime().toString());
    localStorage.setItem(SKIP_COUNT_KEY, (currentSkipCount + 1).toString());

    setIsOpen(false);
  };

  const handleEnable = () => {
    setIsOpen(false);
    router.push("/treasurer/settings"); // Or /admin/settings based on role, but mostly treasurer in this context
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleSnooze()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-4">
            <SiteLogo variant="icon" href={null} logoClassName="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl">Secure Your Kapuletu Account</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Add an extra layer of security to your information. Two-step verification is an optional
            feature that adds an extra layer of security to your account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <Button onClick={handleEnable} className="w-full text-md font-semibold h-12">
            Secure my account
          </Button>
          <Button variant="outline" onClick={handleSnooze} className="w-full h-12">
            I'll do this later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
