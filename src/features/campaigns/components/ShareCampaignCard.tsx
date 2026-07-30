"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import IconLibrary from "@/features/shared/components/IconLibrary";

const ShareCampaignCard = () => {
  return (
    <Card className="bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-2xl shrink-0">
          <IconLibrary name="megaphone" className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-foreground text-lg">Let’s reach the finish line!</h3>
          <p className="text-sm text-muted-foreground">
            You need Ksh.30,000 more to reach your goal. Share your campaign with more people.
          </p>
        </div>
      </div>

      <Dialog>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 gap-2 shrink-0"
            >
              <IconLibrary name="share" className="w-4 h-4" /> Share campaign
            </Button>
          }
        />

        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="space-y-2 text-center relative">
            <DialogTitle className="text-xl font-bold">Share Campaign Report</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Anyone with this link can view the report
            </p>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Link Copy Box */}
            <div className="flex items-center gap-2 bg-muted/50 border border-border p-2 rounded-xl">
              <IconLibrary name="link" className="w-4 h-4 text-muted-foreground ml-2 shrink-0" />
              <Input
                readOnly
                value="https://app.kapuletu.co.ke/report/medical-fund"
                className="text-sm text-foreground truncate"
              />
              <Button
                size="sm"
                variant="outline"
                className="gap-1 border-primary/30 text-primary hover:bg-primary/10 shrink-0"
              >
                <IconLibrary name="copy" className="w-3.5 h-3.5" /> Copy Link
              </Button>
            </div>

            {/* PIN Protection Box */}
            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-3 rounded-xl">
              <span className="text-sm font-medium text-foreground">
                This link is protected by a PIN
              </span>
              <span className="text-xs font-bold bg-primary/15 text-primary px-3 py-1.5 rounded-lg tracking-wider">
                PIN : 7115
              </span>
            </div>

            <hr className="border-border" />

            {/* Share Via Section */}
            <div className="space-y-3">
              <span className="text-sm font-semibold text-foreground">Share via</span>
              <div className="flex gap-6">
                <Button
                  variant="ghost"
                  className="flex flex-col items-center gap-2 h-auto p-2 bg-transparent hover:bg-transparent group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <IconLibrary name="mail" className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">WhatsApp</span>
                </Button>

                <Button
                  variant="ghost"
                  className="flex flex-col items-center gap-2 h-auto p-2 bg-transparent hover:bg-transparent group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <IconLibrary name="mail" className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">Email</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ShareCampaignCard;
