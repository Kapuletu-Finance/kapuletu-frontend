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
import IconLibrary from "@/features/shared/components/IconLibrary";

const AddContributionDialog = () => {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-6 font-semibold gap-2">
            <IconLibrary name="add" className="w-5 h-5" /> Add a contribution
          </Button>
        }
      />

      <DialogContent className="sm:max-w-112.5 rounded-3xl p-8">
        <DialogHeader className="items-center space-y-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary">🔒</div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Add A Contribution
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-foreground">
              Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. John Doe"
              className="rounded-xl border-border bg-background py-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="e.g +2547 1234 5678"
              className="rounded-xl border-border bg-background py-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-semibold text-foreground">
              Amount
            </Label>
            <Input
              id="amount"
              placeholder="e.g. 10,000"
              className="rounded-xl border-border bg-background py-5"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Payment Type</Label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between rounded-xl border-border bg-background text-foreground font-normal py-5 px-4"
              >
                Cash
                <IconLibrary name="chevron-down" className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 font-semibold mt-2"
          >
            Create Campaign
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContributionDialog;
