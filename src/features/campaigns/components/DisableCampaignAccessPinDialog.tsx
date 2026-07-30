"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

const DisableCampaignAccessPinDialog = () => {
  return (
    <Dialog>
      <DialogTrigger render={
        <Button variant="outline" className="w-full justify-between hover:bg-destructive/10 hover:text-destructive border-transparent hover:border-destructive/20 transition-colors group">
          Disable access PIN
        </Button>
      } />

      <DialogContent className="sm:max-w-md rounded-3xl p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-destructive/10 text-destructive shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-lg font-bold text-foreground leading-snug">
              Are you sure you want to disable the access PIN?
            </DialogTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Disabling your access PIN will allow any one with the campaign link to access your campaign data.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-3 sm:justify-end pt-2">
          <Button 
            variant="default" 
            className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 font-semibold"
          >
            Cancel
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-initial border-primary text-primary hover:bg-primary/10 rounded-xl py-6 font-semibold"
          >
            Yes, disable PIN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisableCampaignAccessPinDialog;