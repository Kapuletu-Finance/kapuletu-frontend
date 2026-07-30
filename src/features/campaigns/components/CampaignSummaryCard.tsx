import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IconLibrary from "@/features/shared/components/IconLibrary";

const CampaignSummaryCard = () => {
  return (
    <Card className="shadow-sm h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground font-sans">
          Campaign Summary
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconLibrary name="target" className="w-4 h-4" />
              <span>Goal</span>
            </div>
            <span className="font-semibold text-foreground">Ksh. 50,000</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconLibrary name="campaign" className="w-4 h-4" />
              <span>Amount Raised</span>
            </div>
            <span className="font-semibold text-foreground">Ksh. 20,000</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconLibrary name="rotate-ccw" className="w-4 h-4" />
              <span>Amount Remaining</span>
            </div>
            <span className="font-semibold text-foreground">Ksh. 30,000</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconLibrary name="credit-card" className="w-4 h-4" />
              <span>Total Contributions</span>
            </div>
            <span className="font-semibold text-foreground">15</span>
          </div>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-6 font-semibold gap-2">
          <IconLibrary name="add" className="w-5 h-5" /> Add a contribution
        </Button>
      </CardContent>
    </Card>
  );
};

export default CampaignSummaryCard;
