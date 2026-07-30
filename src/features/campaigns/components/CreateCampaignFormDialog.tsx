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
import { Calendar as CalendarIcon, X, Plus } from "lucide-react";

const CreateCampaignFormDialog = () => {
  return (
    <Dialog>
      <DialogTrigger render={
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-6 font-semibold gap-2">
          <Plus className="w-5 h-5" /> Create New Campaign
        </Button>
      } />

      <DialogContent className="sm:max-w-[480px] rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="items-center space-y-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary text-xl">🔒</div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Create A New Campaign
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="campaignName" className="text-sm font-semibold text-foreground">
              Campaign Name
            </Label>
            <Input
              id="campaignName"
              placeholder="e.g. Food Drive"
              className="rounded-xl border-border bg-background py-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="e.g. support, savings, or fundraising purposes"
              className="rounded-xl border-border bg-background min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount" className="text-sm font-semibold text-foreground">
              Target Amount
            </Label>
            <Input
              id="targetAmount"
              placeholder="e.g. 10,000"
              className="rounded-xl border-border bg-background py-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentInstructions" className="text-sm font-semibold text-foreground">
              Payment Instructions
            </Label>
            <Input
              id="paymentInstructions"
              placeholder="e.g. Paybill 12345, Account 6789"
              className="rounded-xl border-border bg-background py-5"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Fundraising Deadline</Label>
            <div className="relative flex items-center">
              <CalendarIcon className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <Input
                readOnly
                value="Choose Date"
                className="rounded-xl border-border bg-background py-5 pl-10 pr-10 text-muted-foreground"
              />
              <X className="absolute right-3 w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 font-semibold mt-4"
          >
            Create Campaign
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignFormDialog;
