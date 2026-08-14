"use client";

import Link from "next/link";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { formatCurrency } from "@/lib/formatters";
import { getTierStyles, pricings } from "@/features/shared/utils/pricing";

const PricingPaymentModal = () => {
  const [rawTier] = useQueryState("tier", { defaultValue: "bronze" });
  const isValidTier = pricings.some((p) => p.id === rawTier);
  const tier = isValidTier && rawTier ? rawTier : "bronze";

  const [billingCycle, setBillingCycle] = useState("annual");
  const [hasAddons, setHasAddons] = useState(false);

  const tierName = tier.toUpperCase();
  const capitalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1);
  const styles = getTierStyles(tier);
  const selectedPricing = pricings.find((p) => p.id === tier) || pricings[1];

  const monthlyPrice = selectedPricing.price;
  const annualPrice = monthlyPrice * 11;
  const addonPrice = 200;

  const basePrice = billingCycle === "annual" ? annualPrice : monthlyPrice;
  const totalPrice = basePrice + (hasAddons ? addonPrice : 0);

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

          <RadioGroup value={billingCycle} onValueChange={setBillingCycle} className="space-y-4">
            <div
              className={`flex items-center space-x-3 p-4 rounded-xl transition-colors ${
                billingCycle === "monthly"
                  ? `border-2 ${styles.borderColor} bg-accent/20`
                  : "border border-border hover:bg-accent"
              }`}
            >
              <RadioGroupItem value="monthly" id="monthly" className={styles.radioClass} />
              <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                <div className="font-semibold">Pay Monthly</div>
                <div className="text-sm text-muted-foreground">Ksh. {formatCurrency(monthlyPrice)} / Month</div>
              </Label>
            </div>

            <div
              className={`flex items-center space-x-3 p-4 rounded-xl transition-colors ${
                billingCycle === "annual"
                  ? `border-2 ${styles.borderColor} bg-accent/20`
                  : "border border-border hover:bg-accent"
              }`}
            >
              <RadioGroupItem value="annual" id="annual" className={styles.radioClass} />
              <Label htmlFor="annual" className="flex-1 cursor-pointer">
                <div className="font-semibold">Pay Annually</div>
                <div className="text-sm text-muted-foreground">Ksh. {formatCurrency(annualPrice)} / Year</div>
              </Label>
            </div>
          </RadioGroup>

          <div className="pt-4">
            <Label className="mb-2 block">Add ons</Label>
            <div className="border border-border p-4 rounded-xl">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="addons"
                  checked={hasAddons}
                  onCheckedChange={(checked) => setHasAddons(checked === true)}
                  className={`mt-1 ${styles.radioClass}`}
                />
                <Label htmlFor="addons" className="cursor-pointer">
                  <div className="font-semibold">Need More Campaigns?</div>
                  <div className="text-sm text-muted-foreground">Ksh. {formatCurrency(addonPrice)} / Month</div>
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

          <Card className={`border-2 ${styles.borderColor} bg-accent/5`}>
            <CardContent className="space-y-6">
              <h3 className="font-bold text-center">Payment Details</h3>

              <div className="flex items-center gap-2 bg-background p-2 rounded-lg border">
                <IconLibrary name="smartphone" className={`h-6 w-6 ${styles.titleColor}`} />
                <Input
                  placeholder="0712345678"
                  className="border-none shadow-none focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>
                    {tierName} - {billingCycle === "annual" ? "Annual" : "Monthly"}
                  </span>
                  <span>Ksh. {formatCurrency(basePrice)}</span>
                </div>
                {hasAddons && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Add ons</span>
                    <span>Ksh. {formatCurrency(addonPrice)}</span>
                  </div>
                )}
                <hr className="border-border" />
                <div className="flex justify-between font-bold">
                  <span>TOTAL :</span>
                  <span>Ksh. {formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <Button className={`w-full py-6 ${styles.btnClass}`}>
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
