"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import { Separator } from "@/components/ui/separator";
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
    whatsapp_bot: true,
    public_api: true,
  });

  const isDirty = config
    ? maintenance !== Boolean(config.maintenance_mode) ||
      maintenanceMsg !==
        ((config.maintenance_message as string) ||
          "The platform is currently undergoing scheduled maintenance.") ||
      JSON.stringify(maintenanceModules) !== JSON.stringify(config.maintenance_modules)
    : false;

  // Sync state when config loads
  useEffect(() => {
    if (config) {
      setMaintenance(Boolean(config.maintenance_mode));
      setMaintenanceMsg(
        (config.maintenance_message as string) ||
          "The platform is currently undergoing scheduled maintenance.",
      );
      if (config.maintenance_modules) {
        setMaintenanceModules(config.maintenance_modules as typeof maintenanceModules);
      }
    }
  }, [config]);

  const handleSave = async () => {
    if (!config) return;
    try {
      await updateMutation.mutateAsync([
        { key: "maintenance_mode", value: maintenance },
        { key: "maintenance_modules", value: maintenanceModules },
        { key: "maintenance_message", value: maintenanceMsg },
      ]);
      toast.success("Platform access controls updated.");
    } catch (_err) {
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
        <Button
          onClick={handleSave}
          disabled={!isDirty || updateMutation.isPending}
          className="font-semibold transition-all"
          variant={isDirty ? "default" : "secondary"}
        >
          {updateMutation.isPending ? "Saving changes..." : isDirty ? "Save Changes" : "Saved"}
        </Button>
      </div>

      <div className="max-w-3xl">
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
                  <Label htmlFor="web_app" className="text-sm cursor-pointer">
                    Web Dashboard & API
                  </Label>
                  <LabeledSwitch
                    checked={maintenanceModules.web_app}
                    onCheckedChange={(checked) =>
                      setMaintenanceModules((prev) => ({ ...prev, web_app: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="whatsapp_bot" className="text-sm cursor-pointer">
                    WhatsApp AI Bot
                  </Label>
                  <LabeledSwitch
                    checked={maintenanceModules.whatsapp_bot}
                    onCheckedChange={(checked) =>
                      setMaintenanceModules((prev) => ({ ...prev, whatsapp_bot: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="public_api" className="text-sm cursor-pointer">
                    Public API (Integrations)
                  </Label>
                  <LabeledSwitch
                    checked={maintenanceModules.public_api}
                    onCheckedChange={(checked) =>
                      setMaintenanceModules((prev) => ({ ...prev, public_api: checked }))
                    }
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
      </div>
    </div>
  );
};
