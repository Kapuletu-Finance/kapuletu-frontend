import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import IconLibrary from "@/features/shared/components/IconLibrary";

const CampaignDetailsCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <h2 className="font-bold text-foreground text-xl">Campaign Details</h2>
          <p className="text-xs text-muted-foreground">View and update your campaign details</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold">
          <IconLibrary name="edit" className="w-4 h-4" /> Edit
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 items-center py-2">
          <span className="text-sm font-medium text-muted-foreground">Name</span>
          <span className="md:col-span-3 text-sm font-semibold text-foreground">Medical Fund</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 items-center py-2">
          <span className="text-sm font-medium text-muted-foreground">Description</span>
          <span className="md:col-span-3 text-sm font-semibold text-foreground">
            Raising funds to support John Doe&apos;s medical treatment and recovery.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 items-center py-2">
          <span className="text-sm font-medium text-muted-foreground">Payment Instructions</span>
          <span className="md:col-span-3 text-sm font-semibold text-foreground">
            Paybill 12345, Account John
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 items-center py-2">
          <span className="text-sm font-medium text-muted-foreground">Status</span>
          <div className="md:col-span-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Active
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignDetailsCard;
