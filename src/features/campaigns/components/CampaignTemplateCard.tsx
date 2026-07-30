"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RotateCcw, Edit, Plus, Minus, RefreshCw } from "lucide-react";

const CampaignTemplateCard = () => {
  const pinDigits = ["7", "1", "1", "5"];

  return (
    <Card className="rounded-3xl border-none shadow-sm p-8 bg-card space-y-8">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <div className="space-y-1">
          <h2 className="font-bold text-foreground text-xl">Campaign Template</h2>
          <p className="text-xs text-muted-foreground">
            Customize how your campaign updates and reports appear.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-secondary rounded-xl gap-2 font-semibold"
          >
            <RotateCcw className="w-4 h-4" /> Reset to default
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2 font-semibold">
            <Edit className="w-4 h-4" /> Edit
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Report Title</Label>
            <p className="text-xs text-muted-foreground">
              This title will appear at the top of your WhatsApp updates and reports
            </p>
            <Input
              readOnly
              value="Medical Bill"
              className="rounded-xl border-border bg-background py-5"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Report Footer</Label>
            <p className="text-xs text-muted-foreground">
              This title will appear at the bottom of your WhatsApp updates
            </p>
            <Textarea
              readOnly
              value="We still need Ksh 30,000 to reach our goal. Every contribution counts. View full report at: app.kapuletu.co.ke/report/medical-fund"
              className="rounded-xl border-border bg-background min-h-[90px] resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold text-foreground">Blank Slots</Label>
              <p className="text-xs text-muted-foreground">
                Adds numbered empty lines to motivate more people to contribute.
              </p>
            </div>
            <div className="flex items-center gap-3 border border-border rounded-xl px-2 py-1 bg-secondary/30">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-bold text-foreground text-sm w-4 text-center">3</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Toggles & Access PIN Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background">
            <div className="space-y-0.5 pr-4">
              <Label className="text-sm font-semibold text-foreground">
                Include KapuLetu watermark
              </Label>
              <p className="text-xs text-muted-foreground">
                Includes a &quot;Powered by KapuLetu&quot; watermark across all public updates and
                reports.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded uppercase">
                YES
              </span>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background">
            <div className="space-y-0.5 pr-4">
              <Label className="text-sm font-semibold text-foreground">Require PIN to view</Label>
              <p className="text-xs text-muted-foreground">
                Members will need a 4-digit PIN to access the campaign report.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded uppercase">
                YES
              </span>
              <Switch defaultChecked />
            </div>
          </div>

          {/* Access PIN Box */}
          <div className="p-5 rounded-2xl border border-dashed border-primary/40 bg-primary/5 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-foreground">Access PIN</h4>
              <p className="text-xs text-muted-foreground">This protects you campaign data.</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                {pinDigits.map((digit, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-xl border border-border bg-background flex items-center justify-center font-bold text-foreground shadow-xs text-lg"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-semibold h-9"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate PIN
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignTemplateCard;
