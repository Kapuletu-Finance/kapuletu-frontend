"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import { StickySaveBar } from "@/components/ui/sticky-save-bar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateSystemConfigMutation } from "@/features/admin/services/mutations";
import { useSystemConfigQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SetPinDialog } from "./SetPinDialog";

export const AdminUserSettingsTab: React.FC = () => {
  const { data: config, isLoading, isError, refetch } = useSystemConfigQuery();
  const { mutateAsync: updateConfig, isPending: isUpdating } = useUpdateSystemConfigMutation();

  const [openSignups, setOpenSignups] = useState<boolean>(true);
  const [signupMsg, setSignupMsg] = useState("");
  const [waitlistEnabled, setWaitlistEnabled] = useState<boolean>(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);

  const isWaitlistDirty = waitlistEnabled !== (config?.WAITLIST_MODE_ENABLED === "true");
  const isDirty = config
    ? openSignups !== (config.open_signups !== undefined ? Boolean(config.open_signups) : true) ||
      signupMsg !==
        ((config.signup_restricted_message as string) ||
          "Signups are currently restricted to invite-only.") ||
      isWaitlistDirty
    : false;

  useEffect(() => {
    if (config) {
      setOpenSignups(config.open_signups !== undefined ? Boolean(config.open_signups) : true);
      setSignupMsg(
        (config.signup_restricted_message as string) ||
          "Signups are currently restricted to invite-only.",
      );
      setWaitlistEnabled(config.WAITLIST_MODE_ENABLED === "true");
    }
  }, [config]);

  const handleSave = async () => {
    if (!window.confirm("Are you sure you want to apply these changes?")) return;
    try {
      await updateConfig([
        { key: "open_signups", value: openSignups },
        { key: "signup_restricted_message", value: signupMsg },
        { key: "WAITLIST_MODE_ENABLED", value: waitlistEnabled ? "true" : "false" },
      ]);
      toast.success("Signup settings updated.");
    } catch (_err) {
      toast.error("Failed to update signup settings.");
    }
  };

  const handleDiscard = () => {
    if (!config) return;
    setOpenSignups(config.open_signups !== undefined ? Boolean(config.open_signups) : true);
    setSignupMsg(
      (config.signup_restricted_message as string) ||
        "Signups are currently restricted to invite-only.",
    );
    setWaitlistEnabled(config.WAITLIST_MODE_ENABLED === "true");
  };

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
                checked={waitlistEnabled}
                onCheckedChange={setWaitlistEnabled}
                disabled={isLoading}
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-5 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <IconLibrary name="shield-check" className="size-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Open Signups</h4>
              <p className="text-xs text-muted-foreground">Allow independent user registration.</p>
            </div>
          </div>
          <LabeledSwitch checked={openSignups} onCheckedChange={setOpenSignups} />
        </div>
        <div className="p-6 bg-card flex flex-col gap-4 transition-all duration-300">
          <div className="space-y-2">
            <Label>Signup Restriction Message</Label>
            <Textarea
              placeholder="e.g. Signups are currently restricted to invite-only."
              className="min-h-[100px] resize-none"
              value={signupMsg}
              onChange={(e) => setSignupMsg(e.target.value)}
              disabled={openSignups}
            />
            <p className="text-xs text-muted-foreground">
              Message shown on the registration page when signups are closed.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Security Settings</h3>
        <div className="flex items-center justify-between py-4 border-t border-border">
          <div className="pr-8">
            <h4 className="font-medium text-foreground">Global Security PIN</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Configure the master PIN required for sensitive administrative actions.
            </p>
          </div>
          <div className="ml-4 flex items-center shrink-0">
            <Button variant="outline" onClick={() => setPinDialogOpen(true)}>
              <IconLibrary name="shield" className="mr-2 size-4 text-primary" /> Update PIN
            </Button>
          </div>
        </div>
      </div>

      <StickySaveBar
        isDirty={isDirty}
        isSaving={isUpdating}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
      <SetPinDialog isOpen={pinDialogOpen} onOpenChange={setPinDialogOpen} />
    </div>
  );
};
