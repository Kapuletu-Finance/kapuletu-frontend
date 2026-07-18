import { Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CurrentPlanCard = () => {
  return (
    <>
      {/* Full Card View */}
      <Card className="bg-refined-blue text-primary-foreground shadow-lg border-none group-data-[collapsible=icon]:hidden">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium tracking-tight">Current Plan :</span>
            <div className="flex items-center gap-2 bg-background/10 px-4 py-2 rounded-full">
              <Gift className="w-5 h-5 text-primary-foreground" />
              <span className="font-bold">FREE</span>
            </div>
          </div>

          <div className="bg-secondary text-secondary-foreground py-2 rounded-full text-center">
            <p className="text-xs">Unlock all premium features free for 14 days</p>
          </div>
        </CardContent>
      </Card>

      {/* Collapsed Icon View */}
      <div className="hidden group-data-[collapsible=icon]:flex justify-center shrink-0">
        <div className="flex items-center justify-center size-10 rounded-sm bg-refined-blue text-primary-foreground cursor-pointer hover:opacity-80 transition-opacity">
          <Gift className="size-5" />
        </div>
      </div>
    </>
  );
};

export default CurrentPlanCard;
