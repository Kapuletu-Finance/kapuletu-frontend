"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useUpdateSystemConfigMutation } from "@/features/admin/services/mutations";
import { useSystemConfigQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const AdminUserSettingsTab: React.FC = () => {
  const { data: config, isLoading, isError, refetch } = useSystemConfigQuery();
  const { mutate: updateConfig, isPending: isUpdating } = useUpdateSystemConfigMutation();

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-border p-8 text-center">
        <IconLibrary name="alert" className="size-8 text-destructive/80" />
        <h3 className="text-lg font-medium">Failed to load settings</h3>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const isWaitlistEnabled = config?.WAITLIST_MODE_ENABLED === "true";

  const toggleWaitlistMode = () => {
    updateConfig([
      {
        key: "WAITLIST_MODE_ENABLED",
        value: isWaitlistEnabled ? "false" : "true",
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Onboarding & Registration</h3>

        {isLoading ? (
          <div className="text-muted-foreground">Loading settings...</div>
        ) : (
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div className="pr-8">
              <h4 className="font-medium text-foreground">Waitlist Mode</h4>
              <p className="text-sm text-muted-foreground mt-1">
                When enabled, new users will be placed on a waitlist instead of gaining immediate
                access to the platform. Only whitelisted phone numbers bypass the waitlist.
              </p>
            </div>
            <div className="ml-4 flex items-center shrink-0">
              <Switch
                checked={isWaitlistEnabled}
                onCheckedChange={toggleWaitlistMode}
                disabled={isUpdating}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
