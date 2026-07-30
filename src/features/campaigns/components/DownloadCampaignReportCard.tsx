"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useExportCampaignExcelMutation,
  useExportCampaignPdfMutation,
} from "@/features/campaigns/services/mutations";
import { useCampaignQuery } from "@/features/campaigns/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

const PdfIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
    <title>PDF Icon</title>
    <path
      fill="#F44336"
      d="M41,10H7c-0.553,0-1,0.447-1,1v26c0,0.553,0.447,1,1,1h34c0.553,0,1-0.447,1-1V11C42,10.447,41.553,10,41,10z"
    />
    <path
      fill="#FFF"
      d="M12.5 17H17C19.209 17 21 18.791 21 21C21 23.209 19.209 25 17 25H15V31H12.5V17ZM15 19.5V22.5H16.5C17.328 22.5 18 21.828 18 21C18 20.172 17.328 19.5 16.5 19.5H15Z"
    />
    <path
      fill="#FFF"
      d="M22 17H26.5C29.538 17 32 19.462 32 22.5C32 25.538 29.538 28 26.5 28H24.5V31H22V17ZM24.5 19.5V25.5H26.5C28.157 25.5 29.5 24.157 29.5 22.5C29.5 20.843 28.157 19.5 26.5 19.5H24.5Z"
    />
    <path fill="#FFF" d="M33 17H39.5V19.5H35.5V22.5H38.5V25H35.5V31H33V17Z" />
  </svg>
);

const ExcelIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
    <title>Excel Icon</title>
    <path fill="#4CAF50" d="M41,10H25v28h16c0.553,0,1-0.447,1-1V11C42,10.447,41.553,10,41,10z" />
    <path
      fill="#FFF"
      d="M32 15H39V18H32zM32 25H39V28H32zM32 30H39V33H32zM32 20H39V23H32zM25 15H30V18H25zM25 25H30V28H25zM25 30H30V33H25zM25 20H30V23H25z"
    />
    <path fill="#2E7D32" d="M27 42L6 38 6 10 27 6z" />
    <path
      fill="#FFF"
      d="M19.129,31l-2.411-4.561c-0.092-0.171-0.186-0.483-0.284-0.938h-0.037c-0.046,0.215-0.154,0.541-0.324,0.979L13.652,31H9.895l4.462-7.001L10.274,17h3.837l2.001,4.196c0.156,0.331,0.296,0.725,0.42,1.179h0.04c0.078-0.271,0.224-0.68,0.439-1.22L19.237,17h3.515l-4.199,6.939l4.316,7.059h-3.74V31z"
    />
  </svg>
);

const DownloadCampaignReportCard = () => {
  const params = useParams();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";
  const { data: campaignData } = useCampaignQuery(campaignSlug);
  const campaignId = campaignData?.id || campaignSlug;

  const { mutateAsync: exportPdf } = useExportCampaignPdfMutation(campaignId);
  const { mutateAsync: exportExcel } = useExportCampaignExcelMutation(campaignId);

  const handleDownloadPdf = async () => {
    try {
      await exportPdf();
    } catch {
      // silently fail
    }
  };

  const handleDownloadExcel = async () => {
    try {
      await exportExcel();
    } catch {
      // silently fail
    }
  };

  return (
    <Card className="border-none bg-card space-y-6">
      <CardHeader className="space-y-1">
        <h2 className="font-bold text-foreground text-base">Download Report</h2>
        <p className="text-xs text-muted-foreground">
          Download a detailed report for this campaign.
        </p>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-4">
            <PdfIcon className="w-10 h-10 shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-sm">Download as PDF file</p>
              <p className="text-xs text-muted-foreground">
                A detailed report with all contributions.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0"
            onClick={handleDownloadPdf}
          >
            <IconLibrary name="download" className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-4">
            <ExcelIcon className="w-10 h-10 shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-sm">Download as Excel file</p>
              <p className="text-xs text-muted-foreground">
                A detailed spreadsheet with all contributions.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0"
            onClick={handleDownloadExcel}
          >
            <IconLibrary name="download" className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadCampaignReportCard;
