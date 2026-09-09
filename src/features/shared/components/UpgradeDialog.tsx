import { useRouter } from "next/navigation";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const UpgradeDialog: React.FC<UpgradeDialogProps> = ({
  isOpen,
  onClose,
  message = "Upgrade to manage your group funds without any limits.",
}) => {
  const router = useRouter();

  const handleUpgradeClick = () => {
    onClose();
    router.push("/settings?tab=billing");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="max-w-md w-full border-none p-0 z-[101]">
        <div className="flex flex-col items-center text-center space-y-6 p-8">
          <SiteLogo />

          <div className="bg-primary/10 p-4 rounded-full mt-4">
            <IconLibrary name="gem" className="w-12 h-12 text-primary" strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              You've discovered a premium feature!
            </h2>
            <p className="text-muted-foreground text-sm">{message}</p>
          </div>

          <div className="w-full space-y-3 pt-4">
            <Button
              onClick={handleUpgradeClick}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold"
            >
              Upgrade Now
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full py-6 text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeDialog;
