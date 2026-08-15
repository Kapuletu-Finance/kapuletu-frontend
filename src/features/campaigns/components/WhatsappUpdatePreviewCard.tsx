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
  const publicUrl = `${env.NEXT_PUBLIC_APP_URL}/report/${publicSlug}`;
  const blankSlotsCount = campaignData?.settings_override?.blank_slots ?? 3;

  const getMessageText = () => {
    if (!preview) return "";
    const lines: string[] = [
      preview.title,
      "",
      preview.description ?? "",
      "",
      `Raised so far: Ksh ${preview.raised.toLocaleString("en-KE")} of Ksh ${preview.target.toLocaleString("en-KE")}`,
      ...(preview.total_mpesa > 0
        ? [`Amount Received (M-Pesa): Ksh ${preview.total_mpesa.toLocaleString("en-KE")}`]
        : []),
      ...(preview.total_cash > 0
        ? [`Amount Received (Cash): Ksh ${preview.total_cash.toLocaleString("en-KE")}`]
        : []),
      ...(preview.total_bank > 0
        ? [`Amount Received (Bank): Ksh ${preview.total_bank.toLocaleString("en-KE")}`]
        : []),
      ...(preview.total_pledges > 0
        ? [`Amount Received (Pledge): Ksh ${preview.total_pledges.toLocaleString("en-KE")}`]
        : []),
      (() => {
        if (!preview.payment_instructions) return "";
        return `Payment Instructions: ${preview.payment_instructions}`;
      })(),
      "",
      ...preview.contributors.map(
        (c, i) => `${i + 1}. ${c.name} - Ksh ${c.amount.toLocaleString("en-KE")} ✓`,
      ),
      ...Array.from({ length: blankSlotsCount }).map(
        (_, i) => `${preview.contributors.length + i + 1}. `,
      ),
      "",
      preview.footer,
      `View the full report at: ${publicUrl}`,
    ];
    return lines.join("\n");
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
              <p className="text-muted-foreground">{preview.description}</p>
            </div>

            <div>
              <p>
                Raised so far: Ksh {preview.raised.toLocaleString("en-KE")} of Ksh{" "}
                {preview.target.toLocaleString("en-KE")}
              </p>
              {preview.total_mpesa > 0 && (
                <p>Amount Received (M-Pesa): Ksh {preview.total_mpesa.toLocaleString("en-KE")}</p>
              )}
              {preview.total_cash > 0 && (
                <p>Amount Received (Cash): Ksh {preview.total_cash.toLocaleString("en-KE")}</p>
              )}
              {preview.total_bank > 0 && (
                <p>Amount Received (Bank): Ksh {preview.total_bank.toLocaleString("en-KE")}</p>
              )}
              {preview.total_pledges > 0 && (
                <p>Amount Received (Pledge): Ksh {preview.total_pledges.toLocaleString("en-KE")}</p>
              )}
              {preview.payment_instructions && (
                <p className="font-bold mt-2">
                  Payment Instructions:{" "}
                  <span className="bg-background px-1.5 py-0.5 rounded border border-border">
                    {preview.payment_instructions}
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-1">
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

            <div>
              <p>{preview.footer}</p>
              <p>
                View the full report at:{" "}
                <a href={preview.public_url} className="text-refined-blue underline">
                  {preview.public_url.replace("https://", "")}
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
