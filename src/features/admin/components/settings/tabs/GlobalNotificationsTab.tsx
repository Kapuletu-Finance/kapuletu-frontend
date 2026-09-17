import type React from "react";
import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StickySaveBar } from "@/components/ui/sticky-save-bar";

interface Props {
  config: Record<string, any>;
  onUpdate: (key: string, value: any) => Promise<void>;
  isLoading: boolean;
}

export const GlobalNotificationsTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [alertEmail, setAlertEmail] = useState(config.critical_alert_email || "");

  const isDirty = alertEmail !== (config.critical_alert_email || "");

  const handleSave = async () => {
    await onUpdate("critical_alert_email", alertEmail);
  };

  const handleDiscard = () => {
    setAlertEmail(config.critical_alert_email || "");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="font-semibold text-lg text-foreground tracking-tight">
          Global Notifications & Alerts
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure routing for system-critical alerts.
        </p>
      </div>

      <div className="py-2">
        <Field className="space-y-2 max-w-sm">
          <FieldLabel className="font-semibold text-sm">Critical Alert Email</FieldLabel>
          <Input
            type="email"
            placeholder="admin@kapuletu.co.ke"
            className="bg-background border-border"
            value={alertEmail}
            onChange={(e) => setAlertEmail(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Receives webhook failures, large transactions, and security alerts.
          </p>
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
