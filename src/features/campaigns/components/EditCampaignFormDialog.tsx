"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import IconLibrary from "@/features/shared/components/IconLibrary";

const EditCampaignFormDialog = () => {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-6 font-semibold gap-2">
            <IconLibrary name="edit" className="w-4 h-4" /> Edit Campaign
          </Button>
        }
      />

      <DialogContent className="sm:max-w-120 rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="items-center space-y-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary text-xl">🔒</div>
          <DialogTitle className="text-xl font-bold text-foreground">Campaign Settings</DialogTitle>
        </DialogHeader>

        <form className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="campaignName" className="text-sm font-semibold text-foreground">
              Campaign Name
            </Label>
            <Input
              id="campaignName"
              defaultValue="VBS"
              className="rounded-xl border-border bg-background py-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              defaultValue="Bible school for children"
              className="rounded-xl border-border bg-background min-h-25 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount" className="text-sm font-semibold text-foreground">
              Target Amount
            </Label>
            <Input
              id="targetAmount"
              defaultValue="10,000"
              className="rounded-xl border-border bg-background py-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentInstructions" className="text-sm font-semibold text-foreground">
              Payment Instructions
            </Label>
            <Input
              id="paymentInstructions"
              defaultValue="Paybill 12345, Account 6789"
              className="rounded-xl border-border bg-background py-5"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Group Status</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between rounded-xl border-border bg-background text-foreground font-normal py-5 px-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>Active</span>
              </div>
              <IconLibrary name="chevron-down" className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Fundraising Deadline</Label>
            <div className="relative flex items-center">
              <IconLibrary
                name="calendar"
                className="absolute left-3 w-4 h-4 text-muted-foreground"
              />
              <Input
                readOnly
                defaultValue="01/01/2025"
                className="rounded-xl border-border bg-background py-5 pl-10 pr-10 text-foreground font-medium"
              />
              <IconLibrary
                name="close"
                className="absolute right-3 w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 font-semibold mt-4"
          >
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCampaignFormDialog;
