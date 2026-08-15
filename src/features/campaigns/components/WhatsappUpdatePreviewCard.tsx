"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCampaignQuery,
  useCampaignReportPreviewQuery,
} from "@/features/campaigns/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const WhatsappUpdatePreviewCard = () => {
  const params = useParams();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";
  const { data: preview, isLoading } = useCampaignReportPreviewQuery(campaignSlug);
  const { data: campaignData } = useCampaignQuery(campaignSlug);
  const [shareOpen, setShareOpen] = useState(false);

  const publicUrl = preview?.public_url ?? "";
  const accessPin = campaignData?.settings_override?.access_pin;
  const blankSlotsCount = campaignData?.settings_override?.blank_slots ?? 3;

  const handleCopyMessage = async () => {
    if (!preview) return;
    const lines: string[] = [
      preview.title,
      "",
      preview.description ?? "",
      "",
      `Raised so far: Ksh ${preview.raised.toLocaleString("en-KE")} of Ksh ${preview.target.toLocaleString("en-KE")}`,
      `PAYBILL: ${preview.payment_instructions?.split(",")[0]?.trim() ?? "------"} ACCOUNT: ${preview.payment_instructions?.split(",")[1]?.trim() ?? "------"}`,
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
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast.success("Message copied to clipboard!");
    } catch {
      toast.error("Failed to copy message");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
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

          <Dialog open={shareOpen} onOpenChange={setShareOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 gap-2 font-semibold"
                  disabled={!publicUrl || isLoading}
                >
                  <IconLibrary name="share" className="w-4 h-4" /> Share
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
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
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
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 font-mono text-xs md:text-sm text-foreground space-y-4 max-w-2xl mx-auto leading-relaxed">
            <div>
              <p className="font-bold underline">{preview.title}</p>
              <p className="text-muted-foreground">{preview.description}</p>
            </div>

            <div>
              <p>
                Raised so far: Ksh {preview.raised.toLocaleString("en-KE")} of Ksh{" "}
                {preview.target.toLocaleString("en-KE")}
              </p>
              <p className="font-bold">
                PAYBILL:{" "}
                <span className="bg-background px-1.5 py-0.5 rounded border border-border">
                  {preview.payment_instructions?.split(",")[0]?.trim() || "------"}
                </span>{" "}
                ACCOUNT:{" "}
                <span className="bg-background px-1.5 py-0.5 rounded border border-border">
                  {preview.payment_instructions?.split(",")[1]?.trim() || "------"}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              {preview.contributors.map((c, i) => (
                <p key={`contrib-${i}-${c.name}`}>
                  {i + 1}. {c.name} - Ksh {c.amount.toLocaleString("en-KE")} ✓
                </p>
              ))}
              {Array.from({ length: blankSlotsCount }).map((_, i) => (
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
