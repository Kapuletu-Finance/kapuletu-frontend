import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import { Separator } from "@/components/ui/separator";

interface Props {
  config: Record<string, any>;
  onUpdate: (key: string, value: any) => Promise<void>;
  isLoading: boolean;
}

export const PlatformOpsTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [maintenance, setMaintenance] = useState(config.maintenance_mode || false);
  const [openSignups, setOpenSignups] = useState(config.open_signups ?? true);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="font-semibold text-lg text-foreground tracking-tight">
          Platform Operations
        </h3>
        <p className="text-sm text-muted-foreground">
          Global controls for platform access and signups.
        </p>
      </div>

      <div className="flex flex-col py-2 gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-foreground">Maintenance Mode</h4>
            <p className="text-xs text-muted-foreground">
              Suspend platform access for all non-admin users.
            </p>
          </div>
          <LabeledSwitch checked={maintenance} onCheckedChange={setMaintenance} />
        </div>

        <Separator className="w-full" />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-foreground">Open Signups</h4>
            <p className="text-xs text-muted-foreground">
              Allow new users to register independently.
            </p>
          </div>
          <LabeledSwitch checked={openSignups} onCheckedChange={setOpenSignups} />
        </div>
      </div>

      <Separator className="w-full" />

      <div className="pt-2 flex justify-start">
        <Button
          className="w-40 font-semibold"
          disabled={isLoading}
          onClick={async () => {
            await onUpdate("maintenance_mode", maintenance);
            await onUpdate("open_signups", openSignups);
          }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
