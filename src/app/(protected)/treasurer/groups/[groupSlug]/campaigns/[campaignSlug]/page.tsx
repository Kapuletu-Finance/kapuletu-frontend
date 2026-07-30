import { Card } from "@/components/ui/card";

export default function CampaignOverviewPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Empty Card 1 */}
      <Card className="min-h-100 bg-muted/30 border-muted" />

      {/* Campaign Summary Card */}
      <Card className="min-h-100 bg-muted/30 border-muted p-6">
        <h3 className="font-semibold text-foreground">Campaign Summary</h3>
      </Card>
    </div>
  );
}
