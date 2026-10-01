"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
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

  const getMessageText = () => {
    if (!preview) return "";
    return preview.preview_text.trim();
  };

  const handleCopyMessage = async () => {
    const message = getMessageText();
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Message copied to clipboard!");
    } catch {
      toast.error("Failed to copy message");
    }
  };

  const handleShare = async () => {
    const message = getMessageText();
    if (!message) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${campaignData?.title || "Campaign"} Report`,
          text: message,
        });
      } catch (error) {
        // User cancelled or share failed
        console.log("Share failed or cancelled", error);
      }
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  return (
    <Card className="border-none bg-card overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border rounded-xl bg-primary/5 p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-600 shrink-0">
            <IconLibrary
              name="message-circle"
              className="w-7 h-7 fill-emerald-600 text-emerald-600"
            />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-lg">WhatsApp Update Preview</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Copy or share a perfectly formatted campaign report for your WhatsApp groups.
            </p>
          </div>
        </div>

        <div className="flex w-full sm:w-auto mt-2 sm:mt-0">
          <Dialog>
            <DialogTrigger>
              <Button
                variant="default"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold px-6"
                disabled={!preview || isLoading}
              >
                <IconLibrary name="eye" className="w-4 h-4" /> Open Full Preview
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl gap-0 p-0 overflow-hidden bg-background">
              <DialogHeader className="p-6 border-b border-border bg-muted/20">
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <IconLibrary name="message-circle" className="w-5 h-5 text-emerald-600" />
                  WhatsApp Message Preview
                </DialogTitle>
              </DialogHeader>

              <div className="p-6 bg-card">
                {isLoading ? (
                  <div className="space-y-4 max-w-2xl mx-auto py-4">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                ) : preview ? (
                  <ScrollArea
                    className="h-[50vh] max-h-[500px] w-full rounded-xl border border-primary/10 bg-primary/5"
                    orientation="vertical"
                  >
                    <div className="p-6 font-mono text-xs md:text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {getMessageText()}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="py-12 text-center text-sm text-muted-foreground bg-primary/5 rounded-xl border border-primary/10">
                    No preview available.
                  </div>
                )}
              </div>

              <div className="p-6 pt-0 flex flex-col sm:flex-row items-center justify-end gap-3 bg-card rounded-b-lg">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/10 gap-2 font-semibold order-2 sm:order-1"
                  onClick={handleCopyMessage}
                  disabled={!preview || isLoading}
                >
                  <IconLibrary name="copy" className="w-4 h-4" /> Copy Message
                </Button>

                <Button
                  variant="default"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold order-1 sm:order-2"
                  disabled={!preview || isLoading}
                  onClick={handleShare}
                >
                  <IconLibrary name="share" className="w-4 h-4" /> Share via...
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
    </Card>
  );
};

export default WhatsappUpdatePreviewCard;
