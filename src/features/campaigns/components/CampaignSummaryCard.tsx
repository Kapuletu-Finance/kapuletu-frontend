import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Wallet, RotateCcw, CreditCard, Plus } from "lucide-react";

const CampaignSummaryCard = () => {
  return (
    <Card className="rounded-3xl border-none shadow-sm p-6 bg-card w-full h-full flex flex-col justify-between">
      <CardHeader className="p-0 pb-6">
        <CardTitle className="text-xl font-bold text-foreground font-sans">
          Campaign Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>Goal</span>
            </div>
            <span className="font-semibold text-foreground">Ksh. 50,000</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Wallet className="w-4 h-4" />
              <span>Amount Raised</span>
            </div>
            <span className="font-semibold text-foreground">Ksh. 20,000</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <RotateCcw className="w-4 h-4" />
              <span>Amount Remaining</span>
            </div>
            <span className="font-semibold text-foreground">Ksh. 30,000</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              <span>Total Contributions</span>
            </div>
            <span className="font-semibold text-foreground">15</span>
          </div>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-6 font-semibold gap-2">
          <Plus className="w-5 h-5" /> Add a contribution
        </Button>
      </CardContent>
    </Card>
  );
};

export default CampaignSummaryCard;