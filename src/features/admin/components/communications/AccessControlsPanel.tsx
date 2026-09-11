"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateSystemConfigMutation } from "@/features/admin/services/mutations";
import { useSystemConfigQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const AccessControlsPanel: React.FC = () => {
  const { data: config, isLoading: isConfigLoading } = useSystemConfigQuery();
  const updateMutation = useUpdateSystemConfigMutation();

  const [maintenance, setMaintenance] = useState<boolean>(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState("");
  const [maintenanceModules, setMaintenanceModules] = useState({
    web_app: true,
    whatsapp_bot: false,
    public_api: true,
  });

  const [openSignups, setOpenSignups] = useState<boolean>(true);
  const [signupMsg, setSignupMsg] = useState("");

  // Sync state when config loads
  useEffect(() => {
    if (config) {
      setMaintenance(Boolean(config.maintenance_mode));
      setMaintenanceMsg(
        (config.maintenance_message as string) ||
          "The platform is currently undergoing scheduled maintenance.",
      );
      if (config.maintenance_modules) {
        setMaintenanceModules(config.maintenance_modules as any);
      }

      setOpenSignups(config.open_signups !== undefined ? Boolean(config.open_signups) : true);
      setSignupMsg(
        (config.signup_restricted_message as string) ||
          "Signups are currently restricted to invite-only.",
      );
    }
  }, [config]);

  const handleSave = async () => {
    if (!config) return;
    try {
      await updateMutation.mutateAsync([
        { key: "maintenance_mode", value: maintenance },
        { key: "maintenance_modules", value: maintenanceModules },
        { key: "maintenance_message", value: maintenanceMsg },
        { key: "open_signups", value: openSignups },
        { key: "signup_restricted_message", value: signupMsg },
      ]);
      toast.success("Platform access controls updated.");
    } catch (err) {
      toast.error("Failed to update access controls.");
    }
  };

  if (isConfigLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading config...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Access Controls & Messaging</h3>
          <p className="text-sm text-muted-foreground">
            Govern platform availability and draft dynamic constraint messaging.
          </p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="font-semibold">
          {updateMutation.isPending ? "Saving changes..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Maintenance Mode Card */}
        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm flex flex-col">
          <div className="p-5 border-b border-border bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 text-destructive rounded-lg">
                <IconLibrary name="alert" className="size-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Maintenance Mode</h4>
                <p className="text-xs text-muted-foreground">
                  Suspend platform access for non-admins.
                </p>
              </div>
            </div>
            <LabeledSwitch checked={maintenance} onCheckedChange={setMaintenance} />
          </div>
          <div className="p-6 bg-card flex flex-col gap-6 transition-all duration-300">
            {/* Granular Module Settings */}
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-semibold mb-1">Targeted Modules</h5>
                <p className="text-xs text-muted-foreground mb-3">
                  Select which parts of the platform should be temporarily blocked.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="web_app" className="text-sm cursor-pointer">Web Dashboard & API</Label>
                  <LabeledSwitch
                    id="web_app"
                    checked={maintenanceModules.web_app}
                    onCheckedChange={(checked) => setMaintenanceModules(prev => ({ ...prev, web_app: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="whatsapp_bot" className="text-sm cursor-pointer">WhatsApp AI Bot</Label>
                  <LabeledSwitch
                    id="whatsapp_bot"
                    checked={maintenanceModules.whatsapp_bot}
                    onCheckedChange={(checked) => setMaintenanceModules(prev => ({ ...prev, whatsapp_bot: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="public_api" className="text-sm cursor-pointer">Public API (Integrations)</Label>
                  <LabeledSwitch
                    id="public_api"
                    checked={maintenanceModules.public_api}
                    onCheckedChange={(checked) => setMaintenanceModules(prev => ({ ...prev, public_api: checked }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Maintenance Display Note</Label>
              <Textarea
                placeholder="e.g. Down for 2 hours for DB upgrades"
                className="min-h-[100px] resize-none"
                value={maintenanceMsg}
                onChange={(e) => setMaintenanceMsg(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Users will see this exact message when they visit blocked modules.
              </p>
            </div>
          </div>
        </div>

        {/* Open Signups Card */}
        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm flex flex-col">
          <div className="p-5 border-b border-border bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <IconLibrary name="shield-check" className="size-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Open Signups</h4>
                <p className="text-xs text-muted-foreground">
                  Allow independent user registration.
                </p>
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
                disabled={openSignups} // Disabled if signups are actually open
              />
              <p className="text-xs text-muted-foreground">
                Message shown on the registration page when signups are closed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
