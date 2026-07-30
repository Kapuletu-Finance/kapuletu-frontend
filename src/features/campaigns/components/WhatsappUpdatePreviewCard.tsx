"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaignReportPreviewQuery } from "@/features/campaigns/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

const WhatsappUpdatePreviewCard = () => {
  const params = useParams();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";
  const { data: preview, isLoading } = useCampaignReportPreviewQuery(campaignSlug);

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
          >
            <IconLibrary name="copy" className="w-4 h-4" /> Copy message
          </Button>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 gap-2 font-semibold"
          >
            <IconLibrary name="share" className="w-4 h-4" /> Share
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
