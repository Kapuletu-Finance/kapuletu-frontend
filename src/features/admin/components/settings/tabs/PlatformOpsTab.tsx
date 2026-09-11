import { AlertTriangle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import { Separator } from "@/components/ui/separator";

interface Props {
  config: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => Promise<void>;
  isLoading: boolean;
}

export const PlatformOpsTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [maintenance, setMaintenance] = useState<boolean>(Boolean(config.maintenance_mode));
  const [openSignups, setOpenSignups] = useState<boolean>(
    config.open_signups !== undefined ? Boolean(config.open_signups) : true,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = async () => {
    await onUpdate("maintenance_mode", maintenance);
    await onUpdate("open_signups", openSignups);
    setIsDialogOpen(false);
  };

  const handleAttemptSave = () => {
    // Only prompt for confirmation if they are turning ON maintenance mode
    if (maintenance && !config.maintenance_mode) {
      setIsDialogOpen(true);
    } else {
      handleSave();
    }
  };

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
        <Button className="w-40 font-semibold" disabled={isLoading} onClick={handleAttemptSave}>
          Save Changes
        </Button>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-destructive gap-2">
              <AlertTriangle className="h-5 w-5" />
              Activate Maintenance Mode?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately lock out all active non-admin users and drop them into the
              maintenance screen. Any unsaved work they have will be lost. Are you absolutely sure
              you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSave}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Activate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
