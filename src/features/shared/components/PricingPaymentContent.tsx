"use client";

import Link from "next/link";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getTierStyles } from "@/features/shared/utils/pricing";

const PricingPaymentModal = () => {
  const [tier] = useQueryState("tier", { defaultValue: "bronze" });
  const tierName = tier ? tier.toUpperCase() : "BRONZE";
  const capitalizedTier = tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : "Bronze";
  const styles = getTierStyles(tier || "bronze");

  return (
    <div className="max-w-4xl mx-auto p-8 bg-background border border-border shadow-lg rounded-3xl">
      <h2 className="text-2xl font-bold text-center mb-8">Complete your subscription</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Selection */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-medium">Membership Type :</Label>
            <span className={`${styles.titleColor} font-bold`}>{tierName}</span>
          </div>

          <RadioGroup defaultValue="annual" className="space-y-4">
            <div className="flex items-center space-x-3 border border-border p-4 rounded-xl hover:bg-accent transition-colors">
              <RadioGroupItem value="monthly" id="monthly" className={styles.radioClass} />
              <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                <div className="font-semibold">Pay Monthly</div>
                <div className="text-sm text-muted-foreground">Ksh. 500 / Month</div>
              </Label>
            </div>

            <div
              className={`flex items-center space-x-3 border-2 ${styles.borderColor} p-4 rounded-xl bg-accent/20`}
            >
              <RadioGroupItem value="annual" id="annual" className={styles.radioClass} />
              <Label htmlFor="annual" className="flex-1 cursor-pointer">
                <div className="font-semibold">Pay Annually</div>
                <div className="text-sm text-muted-foreground">Ksh. 5500 / Month</div>
              </Label>
            </div>
          </RadioGroup>

          <div className="pt-4">
            <Label className="mb-2 block">Add ons</Label>
            <div className="border border-border p-4 rounded-xl">
              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="addons"
                  id="addons"
                  className={`mt-1 ${styles.radioClass}`}
                />
                <Label htmlFor="addons" className="cursor-pointer">
                  <div className="font-semibold">Need More Campaigns?</div>
                  <div className="text-sm text-muted-foreground">Ksh. 200 / Month</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Get an extra campaign for any group.
                  </div>
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payment */}
        <div className="space-y-4">
          <Label>Account Details</Label>
          <Input placeholder="0712345678" className="bg-muted/50 border-none" />

          <Card className={`border-2 ${styles.borderColor} bg-accent/5 shadow-sm rounded-2xl`}>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-bold text-center">Payment Details</h3>

              <div className="flex items-center gap-2 bg-background p-2 rounded-lg border">
                <span className={`font-bold ${styles.titleColor}`}>m-pesa</span>
                <Input
                  placeholder="0712345678"
                  className="border-none shadow-none focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{tierName} - Annual</span>
                  <span>Ksh. 5500</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between font-bold">
                  <span>TOTAL :</span>
                  <span>Ksh. 5500</span>
                </div>
              </div>

              <Button className={`rounded-xl py-6 ${styles.btnClass}`}>
                Upgrade to {capitalizedTier}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        By clicking subscribing, you agree to our{" "}
        <Link href="#" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default PricingPaymentModal;
