import { Button } from "@/components/ui/button";
import DownloadCampaignReportCard from "@/features/campaigns/components/DownloadCampaignReportCard";
import PublicReportLinkCard from "@/features/campaigns/components/PublicReportLinkCard";
import WhatsappUpdatePreviewCard from "@/features/campaigns/components/WhatsappUpdatePreviewCard";
import IconLibrary from "@/features/shared/components/IconLibrary";

export default function CampaignReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 font-semibold gap-2">
          <IconLibrary name="edit" className="w-4 h-4" /> Customize your report
        </Button>
      </div> */}
      <WhatsappUpdatePreviewCard />
      <PublicReportLinkCard />
      <DownloadCampaignReportCard />
    </div>
  );
}
