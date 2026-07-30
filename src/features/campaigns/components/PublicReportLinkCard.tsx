"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Link as LinkIcon, Copy } from "lucide-react";

const PublicReportLinkCard = () => {
  const pinDigits = ["7", "1", "1", "5"];

  return (
    <Card className="rounded-3xl border-none shadow-sm p-6 bg-card">
      <CardContent className="p-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Side: Info & URL Input */}
        <div className="space-y-4 flex-1 w-full">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-2xl">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Public Report Link</h3>
              <p className="text-xs text-muted-foreground">
                Share this link with anyone you want to see your campaign&apos;s progress, no account needed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-muted/50 border border-border p-2 rounded-xl w-full">
            <LinkIcon className="w-4 h-4 text-muted-foreground ml-2 shrink-0" />
            <Input 
              readOnly 
              value="https://app.kapuletu.co.ke/report/medical-fund" 
              className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm text-foreground truncate h-auto py-1"
            />
            <Button size="sm" variant="outline" className="rounded-lg gap-1 border-primary/30 text-primary hover:bg-primary/10 shrink-0 h-9 px-4 font-semibold">
              <Copy className="w-3.5 h-3.5" /> Copy Link
            </Button>
          </div>
        </div>

        {/* Right Side: Access PIN */}
        <div className="flex flex-col items-center md:items-end justify-center shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-8">
          <span className="text-xs font-bold text-foreground">Access PIN</span>
          <span className="text-[11px] text-muted-foreground mb-3">View campaign report with this pin</span>
          
          <div className="flex items-center gap-2">
            {pinDigits.map((digit, index) => (
              <div 
                key={index} 
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