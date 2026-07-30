"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import IconLibrary from "@/features/shared/components/IconLibrary";

const WhatsappUpdatePreviewCard = () => {
  return (
    <Card className="rounded-3xl border-none shadow-sm bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b border-border">
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
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2 font-semibold"
          >
            <IconLibrary name="copy" className="w-4 h-4" /> Copy message
          </Button>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 rounded-xl gap-2 font-semibold"
          >
            <IconLibrary name="share" className="w-4 h-4" /> Share
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 font-mono text-xs md:text-sm text-foreground space-y-4 max-w-2xl mx-auto leading-relaxed">
          <div>
            <p className="font-bold underline">Medical Fund Update</p>
            <p className="text-muted-foreground">
              Raising funds to support John Doe’s medical treatment and recovery.
            </p>
          </div>

          <div>
            <p>Raised so far: Ksh 20,000 of Ksh 50,000</p>
            <p className="font-bold">
              PAYBILL:{" "}
              <span className="bg-background px-1.5 py-0.5 rounded border border-border">
                123456
              </span>{" "}
              ACCOUNT:{" "}
              <span className="bg-background px-1.5 py-0.5 rounded border border-border">John</span>
            </p>
          </div>

          <div className="space-y-1">
            <p>1. John Doe - Ksh 5,000 ✓</p>
            <p>2. Jane Doe - Ksh 6,000 ✓</p>
            <p>3. Samuel M. - Ksh 900 ✓</p>
            <p>4. Joan Doe - Ksh 500 ✓</p>
            <p>5. John Doe - Ksh 500 ✓</p>
            <p className="text-muted-foreground">6.</p>
            <p className="text-muted-foreground">7.</p>
            <p className="text-muted-foreground">8.</p>
            <p className="text-muted-foreground">9.</p>
            <p className="text-muted-foreground">10.</p>
          </div>

          <div>
            <p>We still need Ksh 30,000 to reach our goal. Every contribution counts.</p>
            <p>
              View the full report at:{" "}
              <a
                href="https://app.kapuletu.co.ke/report/medical-fund"
                className="text-refined-blue underline"
              >
                app.kapuletu.co.ke/report/medical-fund
              </a>
            </p>
          </div>

          <div className="pt-2 font-sans font-bold text-xs text-muted-foreground">
            Powered by KapuLetu
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsappUpdatePreviewCard;
