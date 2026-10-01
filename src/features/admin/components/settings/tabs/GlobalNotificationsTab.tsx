import type React from "react";
import { useEffect, useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StickySaveBar } from "@/components/ui/sticky-save-bar";
import { useUpdateAdminNotificationEmailsMutation } from "../../../services/mutations";
import { useAdminNotificationEmailsQuery } from "../../../services/queries";

interface Props {
  config: Record<string, any>;
  onUpdate: (key: string, value: any) => Promise<void>;
  isLoading: boolean;
}

export const GlobalNotificationsTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [alertEmail, setAlertEmail] = useState(config.critical_alert_email || "");
  const { data: adminConfig, isLoading: isAdminConfigLoading } = useAdminNotificationEmailsQuery();
  const updateAdminEmailsMutation = useUpdateAdminNotificationEmailsMutation();

  const [lifecycleEmails, setLifecycleEmails] = useState<string>("");

  useEffect(() => {
    if (adminConfig && adminConfig.emails) {
      setLifecycleEmails(adminConfig.emails.join(", "));
    }
  }, [adminConfig]);

  const isAlertEmailDirty = alertEmail !== (config.critical_alert_email || "");
  const originalLifecycleStr = (adminConfig?.emails || []).join(", ");
  const isLifecycleDirty = lifecycleEmails !== originalLifecycleStr;

  const isDirty = isAlertEmailDirty || isLifecycleDirty;
  const isSaving = isLoading || updateAdminEmailsMutation.isPending;

  const handleSave = async () => {
    if (isAlertEmailDirty) {
      await onUpdate("critical_alert_email", alertEmail);
    }

    if (isLifecycleDirty) {
      const emailArray = lifecycleEmails
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e.length > 0);
      await updateAdminEmailsMutation.mutateAsync(emailArray);
    }
  };

  const handleDiscard = () => {
    setAlertEmail(config.critical_alert_email || "");
    setLifecycleEmails(originalLifecycleStr);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="font-semibold text-lg text-foreground tracking-tight">
          Global Notifications & Alerts
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure routing for system-critical alerts and lifecycle events.
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

      <div className="py-2">
        <Field className="space-y-2 max-w-xl">
          <FieldLabel className="font-semibold text-sm">Lifecycle Event Alerts</FieldLabel>
          {isAdminConfigLoading ? (
            <div className="h-10 w-full animate-pulse bg-muted rounded-md" />
          ) : (
            <Input
              type="text"
              placeholder="admin@kapuletu.co.ke, support@kapuletu.co.ke"
              className="bg-background border-border"
              value={lifecycleEmails}
              onChange={(e) => setLifecycleEmails(e.target.value)}
            />
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Enter a comma-separated list of emails to receive real-time notifications when a user
            signs up, joins the waitlist, or upgrades their plan.
          </p>
        </Field>
      </div>

      <StickySaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
};
