"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env";
import {
  useCampaignQuery,
  useCampaignReportPreviewQuery,
} from "@/features/campaigns/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

const WhatsappUpdatePreviewCard = () => {
  const params = useParams();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";
  const { data: preview, isLoading } = useCampaignReportPreviewQuery(campaignSlug);
  const { data: campaignData } = useCampaignQuery(campaignSlug);
  const publicSlug = campaignData?.slug || campaignSlug;
  const publicUrl =
    preview?.public_url || `${env.NEXT_PUBLIC_APP_URL}/r/${campaignData?.short_code || publicSlug}`;
  const blankSlotsCount = campaignData?.settings_override?.blank_slots ?? 3;

  const getMessageText = () => {
    if (!preview) return "";
    return preview.preview_text.trim();
  };

  const handleCopyMessage = async () => {
    const message = getMessageText();
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      toast.error("Failed to copy message");
    }
  };

  return (
    <Card className="border-none bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-600">
            <IconLibrary
              name="message-circle"
              className="w-6 h-6 fill-emerald-600 text-emerald-600"
            />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-base">WhatsApp Update Preview</h2>
            <p className="text-xs text-muted-foreground">
              Copy the message or share it with your group
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold"
            onClick={handleCopyMessage}
            disabled={!preview || isLoading}
          >
            <IconLibrary name="copy" className="w-4 h-4" /> Copy message
          </Button>

          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 gap-2 font-semibold"
            disabled={!preview || isLoading}
            onClick={() => {
              const text = getMessageText();
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
            }}
          >
            <IconLibrary name="share" className="w-4 h-4" /> Share on WhatsApp
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4 max-w-2xl mx-auto">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-56" />
          </div>
        ) : preview ? (
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 font-mono text-xs md:text-sm text-foreground space-y-4 max-w-2xl mx-auto leading-relaxed max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            <div>
              <p className="font-bold underline">{preview.title}</p>
              {preview.description && (
                <p className="text-muted-foreground mt-2">{preview.description}</p>
              )}
            </div>

            <div>
              <p className="font-bold">*Progress Update:*</p>
              <p>
                So far, we have raised Ksh {preview.raised.toLocaleString("en-KE")} against our goal
                of Ksh {preview.target.toLocaleString("en-KE")}. We have an amount remaining of Ksh{" "}
                {Math.max(0, preview.target - preview.raised).toLocaleString("en-KE")} to meet our
                goal. Every contribution counts.
              </p>
            </div>

            <div>
              {preview.total_mpesa > 0 && (
                <p>
                  <span className="font-bold">*Amount Received (M-Pesa):*</span> Ksh{" "}
                  {preview.total_mpesa.toLocaleString("en-KE")}
                </p>
              )}
              {preview.total_cash > 0 && (
                <p>
                  <span className="font-bold">*Amount Received (Cash):*</span> Ksh{" "}
                  {preview.total_cash.toLocaleString("en-KE")}
                </p>
              )}
              {preview.total_bank > 0 && (
                <p>
                  <span className="font-bold">*Amount Received (Bank):*</span> Ksh{" "}
                  {preview.total_bank.toLocaleString("en-KE")}
                </p>
              )}
              {preview.total_pledges > 0 && (
                <p>
                  <span className="font-bold">*Amount Received (Pledge):*</span> Ksh{" "}
                  {preview.total_pledges.toLocaleString("en-KE")}
                </p>
              )}
            </div>

            <div>
              <p>To send your contributions, the payment instructions are as follows:</p>
              {preview.payment_instructions && (
                <p className="font-medium bg-background px-1.5 py-0.5 rounded border border-border mt-1 inline-block">
                  {preview.payment_instructions}
                </p>
              )}
            </div>

            <div>
              <p className="font-bold">*Contributions Received:*</p>
              <div className="space-y-1 mt-1">
                {preview.contributors.map((c, i) => (
                  <p key={`contrib-${i}-${c.name}`}>
                    {i + 1}. {c.name} - Ksh {c.amount.toLocaleString("en-KE")} ✓
                  </p>
                ))}
                {Array.from({ length: blankSlotsCount }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: this is a static list of blank slots
                  <p key={`blank-${i}`}>{preview.contributors.length + i + 1}.</p>
                ))}
              </div>
            </div>

            <div>
              <p>
                Thank you to everyone who has contributed so far. Your continued support is greatly
                appreciated as we work towards our goal.
              </p>
            </div>

            <div>
              <p>To view a more comprehensive report, click the link below:</p>
              <p>
                <a href={publicUrl} className="text-refined-blue underline">
                  {publicUrl.replace("https://", "")}
                </a>
              </p>
            </div>

            <div className="pt-2 font-sans font-bold text-xs text-muted-foreground">
              Powered by KapuLetu
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No preview available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsappUpdatePreviewCard;
