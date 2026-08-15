"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import { Textarea } from "@/components/ui/textarea";
import DisableCampaignAccessPinDialog from "@/features/campaigns/components/DisableCampaignAccessPinDialog";
import EditCampaignSettingsDialog from "@/features/campaigns/components/EditCampaignSettingsDialog";
import {
  useRegenerateCampaignPinMutation,
  useUpdateCampaignMutation,
} from "@/features/campaigns/services/mutations";
import { useCampaignQuery } from "@/features/campaigns/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

const CampaignTemplateCard = () => {
  const params = useParams();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";
  const { data: campaignData } = useCampaignQuery(campaignSlug);
  const updateCampaign = useUpdateCampaignMutation(campaignSlug);
  const regeneratePin = useRegenerateCampaignPinMutation(campaignSlug);

  const settings = campaignData?.settings_override;
  const reportTitle = settings?.report_title ?? "Campaign Update";
  const reportFooter = settings?.report_footer ?? "Thank you for your support.";
  const blankSlots = settings?.blank_slots ?? 3;
  const removeWatermark = settings?.remove_watermark ?? false;
  const paidIndicator = settings?.paid_indicator ?? "\u2713";
  const requirePin = settings?.require_pin ?? true;
  const accessPin = settings?.access_pin;

  const pinDigits = accessPin ? accessPin.split("") : ["-", "-", "-", "-"];

  const handleRegeneratePin = () => {
    regeneratePin.mutate();
  };

  const handleUpdateSetting = (newSettings: Partial<NonNullable<typeof settings>>) => {
    updateCampaign.mutate({ settings: newSettings });
  };

  return (
    <Card className="border-none bg-card space-y-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-bold text-foreground text-xl">Campaign Template</h2>
          <p className="text-xs text-muted-foreground">
            Customize how your campaign updates and reports appear.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-secondary gap-2 font-semibold"
          >
            <IconLibrary name="rotate-ccw" className="w-4 h-4" /> Reset to default
          </Button>
          <EditCampaignSettingsDialog
            campaignSlug={campaignSlug}
            initialTitle={reportTitle}
            initialFooter={reportFooter}
          >
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold">
              <IconLibrary name="edit" className="w-4 h-4" /> Edit
            </Button>
          </EditCampaignSettingsDialog>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Report Title</Label>
            <p className="text-xs text-muted-foreground">
              This title will appear at the top of your WhatsApp updates and reports
            </p>
            <Input readOnly value={reportTitle} className="border-border bg-background py-5" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Report Footer</Label>
            <p className="text-xs text-muted-foreground">
              This title will appear at the bottom of your WhatsApp updates
            </p>
            <Textarea
              readOnly
              value={reportFooter}
              className="border-border bg-background min-h-22.5 resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold text-foreground">Blank Slots</Label>
              <p className="text-xs text-muted-foreground">
                Adds numbered empty lines to motivate more people to contribute.
              </p>
            </div>
            <div className="flex items-center gap-2 border border-primary rounded-full px-2 py-1 text-primary">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary hover:bg-primary/10 hover:text-primary rounded-full shrink-0"
                onClick={() => handleUpdateSetting({ blank_slots: Math.max(0, blankSlots - 1) })}
                disabled={updateCampaign.isPending}
              >
                <IconLibrary name="minus" className="w-4 h-4" />
              </Button>
              <input
                key={blankSlots}
                type="number"
                min="0"
                className="w-8 text-center bg-transparent font-bold text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                defaultValue={blankSlots}
                onBlur={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!Number.isNaN(val) && val !== blankSlots) {
                    handleUpdateSetting({ blank_slots: Math.max(0, val) });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
                disabled={updateCampaign.isPending}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary hover:bg-primary/10 hover:text-primary rounded-full shrink-0"
                onClick={() => handleUpdateSetting({ blank_slots: blankSlots + 1 })}
                disabled={updateCampaign.isPending}
              >
                <IconLibrary name="add" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1 pr-4">
              <Label className="text-sm font-semibold text-foreground">
                Include KapuLetu watermark
              </Label>
              <p className="text-xs text-muted-foreground">
                Includes a "Powered by KapuLetu" watermark across all public updates and reports.
              </p>
            </div>
            <LabeledSwitch
              checked={!removeWatermark}
              onCheckedChange={(checked) => handleUpdateSetting({ remove_watermark: !checked })}
              disabled={updateCampaign.isPending}
              labelOn="YES"
              labelOff="NO"
            />
          </div>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-foreground">Paid Status Indicator</Label>
              <p className="text-xs text-muted-foreground">
                Choose an emoji, a preset word, or type your own custom indicator to mark paid
                contributions.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["\u2713", "\u2705", "\ud83d\udcaf", "[PAID]", "(Received)"].map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={paidIndicator === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUpdateSetting({ paid_indicator: preset })}
                  disabled={updateCampaign.isPending}
                  className={`h-8 rounded-full px-3 text-xs font-semibold ${
                    paidIndicator === preset
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {preset}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Input
                key={`input-${paidIndicator}`}
                placeholder="Type custom text or emoji..."
                className="max-w-xs border-border bg-background h-9 text-sm"
                defaultValue={paidIndicator}
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  if (val && val !== paidIndicator) {
                    handleUpdateSetting({ paid_indicator: val });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
                disabled={updateCampaign.isPending}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-dashed border-primary/40 bg-primary/5 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-foreground">Access PIN</h4>
              <p className="text-xs text-muted-foreground">This protects your campaign data.</p>
            </div>

            <div className="flex flex-col gap-4 pt-1">
              <div className="flex items-center gap-2">
                {pinDigits.map((digit, index) => (
                  <div
                    key={`pin-${index}-${digit}`}
                    className="w-12 h-12 rounded-xl border border-border bg-background flex items-center justify-center font-bold text-foreground shadow-xs text-lg"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-semibold h-9 rounded-full px-4"
                  onClick={handleRegeneratePin}
                  isLoading={regeneratePin.isPending}
                >
                  <IconLibrary name="refresh" className="w-3.5 h-3.5" /> Regenerate PIN
                </Button>
                {requirePin && (
                  <DisableCampaignAccessPinDialog campaignSlug={campaignSlug}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs font-semibold h-9 rounded-full px-4 border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      <IconLibrary name="lock" className="w-3.5 h-3.5" /> Disable PIN
                    </Button>
                  </DisableCampaignAccessPinDialog>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignTemplateCard;
