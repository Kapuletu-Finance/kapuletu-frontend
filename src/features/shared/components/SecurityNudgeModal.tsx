"use client";

import { ShieldAlert } from "lucide-react";
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
            <ShieldAlert className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl">Protect Your Account</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            We highly recommend enabling Two-Factor Authentication (2FA) to keep your Kapuletu
            account secure. It adds an extra layer of protection against unauthorized access.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <Button onClick={handleEnable} className="w-full text-md font-semibold h-12">
            Enable 2FA Now
          </Button>
          <Button variant="outline" onClick={handleSnooze} className="w-full h-12">
            Remind Me Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
