import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StickySaveBar } from "@/components/ui/sticky-save-bar";

interface Props {
  config: Record<string, any>;
  onUpdate: (key: string, value: any) => Promise<void>;
  isLoading: boolean;
}

export const BillingRulesTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [trialDays, setTrialDays] = useState(config.trial_days || 14);
  const [gracePeriod, setGracePeriod] = useState(config.grace_period_days || 7);

  const isDirty =
    trialDays !== (config.trial_days || 14) || gracePeriod !== (config.grace_period_days || 7);

  const handleSave = async () => {
    await onUpdate("trial_days", trialDays);
    await onUpdate("grace_period_days", gracePeriod);
  };

  const handleDiscard = () => {
    setTrialDays(config.trial_days || 14);
    setGracePeriod(config.grace_period_days || 7);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="font-semibold text-lg text-foreground tracking-tight">
          Subscription & Billing Rules
        </h3>
        <p className="text-sm text-muted-foreground">Platform-wide rules for SaaS subscriptions.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 py-2">
        <Field className="space-y-2 max-w-sm">
          <FieldLabel className="font-semibold text-sm">Default Trial Period (Days)</FieldLabel>
          <Input
            type="number"
            className="bg-background border-border"
            value={trialDays}
            onChange={(e) => setTrialDays(parseInt(e.target.value, 10) || 0)}
          />
        </Field>

        <Field className="space-y-2 max-w-sm">
          <FieldLabel className="font-semibold text-sm">Payment Grace Period (Days)</FieldLabel>
          <Input
            type="number"
            className="bg-background border-border"
            value={gracePeriod}
            onChange={(e) => setGracePeriod(parseInt(e.target.value, 10) || 0)}
          />
        </Field>
      </div>

      <Separator className="w-full" />

      <StickySaveBar
        isDirty={isDirty}
        isSaving={isLoading}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
};
