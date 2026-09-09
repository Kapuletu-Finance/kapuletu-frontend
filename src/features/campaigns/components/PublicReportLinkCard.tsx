"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useCampaignQuery,
  useCampaignReportPreviewQuery,
} from "@/features/campaigns/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const PublicReportLinkCard = () => {
  const params = useParams();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";
  const { data: campaignData, isLoading: isCampaignLoading } = useCampaignQuery(campaignSlug);
  const { data: preview, isLoading: isPreviewLoading } =
    useCampaignReportPreviewQuery(campaignSlug);
  const [shareOpen, setShareOpen] = useState(false);

  const publicUrl = preview?.public_url ?? "";
  const isLoading = isCampaignLoading || isPreviewLoading;
  const settings = campaignData?.settings_override;
  const accessPin = settings?.access_pin;
  const pinDigits = accessPin ? accessPin.split("") : ["-", "-", "-", "-"];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleCopyPin = async () => {
    if (!accessPin) return;
    try {
      await navigator.clipboard.writeText(accessPin);
      toast.success("PIN copied to clipboard!");
    } catch {
      toast.error("Failed to copy PIN");
    }
  };

  return (
    <Card className="border-none bg-card">
      <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-4 flex-1 w-full">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-2xl">
              <IconLibrary name="globe" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Public Report Link</h3>
              <p className="text-xs text-muted-foreground">
                Share this link with anyone you want to see your campaign&apos;s progress, no
                account needed.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
            <div className="flex items-center gap-2 bg-muted/50 border border-border p-2 rounded-xl flex-1 min-w-0">
              <IconLibrary name="link" className="w-4 h-4 text-muted-foreground ml-2 shrink-0" />
              <Input
                readOnly
                value={publicUrl}
                className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm text-foreground truncate h-auto py-1 flex-1 min-w-0"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                className="gap-1 border-primary/30 text-primary hover:bg-primary/10 flex-1 sm:flex-none h-10 sm:h-11 px-4 font-semibold rounded-xl"
                onClick={handleCopyLink}
              >
                <IconLibrary name="copy" className="w-3.5 h-3.5" /> Copy Link
              </Button>
              <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                <DialogTrigger
                  render={
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1 bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none h-10 sm:h-11 px-4 font-semibold rounded-xl"
                      disabled={!publicUrl || isLoading}
                    >
                      <IconLibrary name="share" className="w-3.5 h-3.5" /> Share
                    </Button>
                  }
                />

                <DialogContent className="sm:max-w-lg">
                  <DialogHeader className="items-center space-y-3 text-center relative">
                    <SiteLogo variant="icon" href={null} logoClassName="w-12 h-12 text-primary" />
                    <div className="space-y-1">
                      <DialogTitle className="text-xl font-bold">Share Campaign Report</DialogTitle>
                      <p className="text-sm text-muted-foreground">
                        Anyone with this link can view the report
                      </p>
                    </div>
                  </DialogHeader>

                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-2 bg-muted/50 border border-border p-2 rounded-xl">
                      <IconLibrary
                        name="link"
                        className="w-4 h-4 text-muted-foreground ml-2 shrink-0"
                      />
                      <Input
                        readOnly
                        value={isLoading ? "Loading link..." : publicUrl}
                        className="text-sm text-foreground truncate"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 border-primary/30 text-primary hover:bg-primary/10 shrink-0"
                        onClick={handleCopyLink}
                        disabled={!publicUrl || isLoading}
                      >
                        <IconLibrary name="copy" className="w-3.5 h-3.5" /> Copy Link
                      </Button>
                    </div>

                    <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-3 rounded-xl">
                      <span className="text-sm font-medium text-foreground">
                        This link is protected by a PIN
                      </span>
                      <span className="text-xs font-bold bg-primary/15 text-primary px-3 py-1.5 rounded-lg tracking-wider">
                        PIN : {accessPin || "----"}
                      </span>
                    </div>

                    <hr className="border-border" />

                    <div className="space-y-3">
                      <span className="text-sm font-semibold text-foreground">Share via</span>
                      <div className="flex gap-6">
                        <Button
                          variant="ghost"
                          className="flex flex-col items-center gap-2 h-auto p-2 bg-transparent hover:bg-transparent group"
                          onClick={() => {
                            const text = `Check out the "${campaignData?.title}" campaign report: ${publicUrl}`;
                            window.open(
                              `https://wa.me/?text=${encodeURIComponent(text)}`,
                              "_blank",
                            );
                          }}
                        >
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <IconLibrary name="message-circle" className="w-5 h-5" />
                          </div>
                          <span className="text-xs text-muted-foreground">WhatsApp</span>
                        </Button>

                        <Button
                          variant="ghost"
                          className="flex flex-col items-center gap-2 h-auto p-2 bg-transparent hover:bg-transparent group"
                          onClick={() => {
                            const subject = `${campaignData?.title} – Campaign Report`;
                            const body = `Check out the "${campaignData?.title}" campaign report:\n\n${publicUrl}`;
                            window.open(
                              `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
                            );
                          }}
                        >
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <IconLibrary name="mail" className="w-5 h-5" />
                          </div>
                          <span className="text-xs text-muted-foreground">Email</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end justify-center shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-8">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">Access PIN</span>
            {accessPin && (
              <button
                type="button"
                onClick={handleCopyPin}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Copy PIN"
              >
                <IconLibrary name="copy" className="w-3 h-3" />
              </button>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground mb-3">
            View campaign report with this pin
          </span>

          <div className="flex items-center gap-2">
            {pinDigits.map((digit, index) => (
              <div
                key={`pin-${index}-${digit}`}
                className="w-10 h-10 rounded-xl border border-border bg-background flex items-center justify-center font-bold text-foreground shadow-xs"
              >
                {digit}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicReportLinkCard;
