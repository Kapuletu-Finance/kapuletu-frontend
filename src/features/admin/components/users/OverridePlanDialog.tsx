"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpgradeUserPlanMutation } from "@/features/admin/services/mutations";
import { useAdminFinancePlansQuery } from "@/features/admin/services/queries";

interface OverridePlanDialogProps {
  userId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OverridePlanDialog: React.FC<OverridePlanDialogProps> = ({
  userId,
  isOpen,
  onOpenChange,
}) => {
  const [planId, setPlanId] = useState("");
  const [duration, setDuration] = useState("30");
  const overridePlan = useUpgradeUserPlanMutation();
  const { data: plans } = useAdminFinancePlansQuery();

  useEffect(() => {
    if (isOpen) {
      setPlanId("");
      setDuration("30");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!planId) return;

    let submitPayload = {
      userId,
      plan_id: planId,
      duration: parseInt(duration, 10),
      is_trial: false,
    };

    if (planId === "PRO_TRIAL") {
      const proPlan = plans?.find((p) => p.name === "Professional" || p.name === "Pro");
      if (!proPlan) return;
      submitPayload = {
        userId,
        plan_id: proPlan.plan_id,
        duration: 21,
        is_trial: true,
      };
    }

    overridePlan.mutate(submitPayload, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Override Subscription Plan</DialogTitle>
          <DialogDescription>
            Manually assign a subscription plan to this user. This bypasses the normal payment flow.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="plan" className="text-sm font-medium">
              Select Plan
            </label>
            <Select
              value={planId}
              onValueChange={(val) => {
                setPlanId(val || "");
                if (val === "PRO_TRIAL") {
                  setDuration("21");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans?.map((plan) => (
                  <SelectItem key={plan.plan_id} value={plan.plan_id}>
                    {plan.name} (KES {plan.price})
                  </SelectItem>
                ))}
                <SelectItem value="PRO_TRIAL">Professional (21-Day Trial)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="duration" className="text-sm font-medium">
              Duration (Days)
            </label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={overridePlan.isPending || !planId || !duration}>
            {overridePlan.isPending ? "Applying..." : "Apply Override"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
