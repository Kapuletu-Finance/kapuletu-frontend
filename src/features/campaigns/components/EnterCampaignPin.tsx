"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useVerifyCampaignPinMutation } from "@/features/campaigns/services/mutations";
import IconLibrary from "@/features/shared/components/IconLibrary";

const EnterCampaignPin = () => {
  const [pin, setPin] = useState("");
  const params = useParams();
  const router = useRouter();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const groupId = typeof params.groupId === "string" ? params.groupId : "";

  const verifyMutation = useVerifyCampaignPinMutation(workspaceId, groupId, campaignSlug);

  const handleVerify = () => {
    if (pin.length !== 4) return;
    verifyMutation.mutate(pin, {
      onSuccess: () => {
        sessionStorage.setItem(`campaign_pin_${campaignSlug}`, pin);
        router.push(`/report/w/${workspaceId}/g/${groupId}/c/${campaignSlug}`);
      },
    });
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="max-w-md w-full rounded-[2rem] border border-border/60 shadow-xl p-8 bg-card text-center space-y-6">
        <CardContent className="p-0 space-y-6">
          {/* Lock Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <IconLibrary name="lock" className="w-8 h-8" strokeWidth={2} />
          </div>

          {/* Heading and Description */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Enter campaign PIN</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              A 4-digit PIN provided by the treasurer is required to access this campaign report
            </p>
          </div>

          {/* PIN Input Boxes */}
          <div className="w-full flex justify-center py-2">
            <InputOTP maxLength={4} value={pin} onChange={(value) => setPin(value)}>
              <InputOTPGroup className="gap-3 sm:gap-4">
                <InputOTPSlot
                  index={0}
                  className="w-14 h-16 sm:w-16 sm:h-20 text-2xl sm:text-3xl rounded-xl sm:rounded-2xl border-border bg-background shadow-sm"
                />
                <InputOTPSlot
                  index={1}
                  className="w-14 h-16 sm:w-16 sm:h-20 text-2xl sm:text-3xl rounded-xl sm:rounded-2xl border-border bg-background shadow-sm"
                />
                <InputOTPSlot
                  index={2}
                  className="w-14 h-16 sm:w-16 sm:h-20 text-2xl sm:text-3xl rounded-xl sm:rounded-2xl border-border bg-background shadow-sm"
                />
                <InputOTPSlot
                  index={3}
                  className="w-14 h-16 sm:w-16 sm:h-20 text-2xl sm:text-3xl rounded-xl sm:rounded-2xl border-border bg-background shadow-sm"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Action Button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 font-semibold text-base shadow-sm"
            onClick={handleVerify}
            disabled={pin.length !== 4 || verifyMutation.isPending}
          >
            {verifyMutation.isPending ? "Verifying..." : "View Report"}
          </Button>

          {/* Footer Help */}
          <div className="flex items-start justify-center gap-2 pt-4 text-xs text-muted-foreground">
            <IconLibrary name="help" className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex flex-col text-left">
              <span>Don&apos;t have the PIN?</span>
              <span className="font-medium text-foreground">
                Please contact your campaign treasurer.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterCampaignPin;
