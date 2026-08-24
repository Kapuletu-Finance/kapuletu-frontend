"use client";

import Link from "next/link";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetMySubscriptionQuery } from "@/features/auth/services/queries";
import { useInitiateCheckoutMutation } from "@/features/finance/services/mutations";
import {
  useGetAvailablePlansQuery,
  useGetPaymentStatusQuery,
} from "@/features/finance/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { getTierStyles } from "@/features/shared/utils/pricing";
import { formatCurrency } from "@/lib/formatters";

const PricingPaymentModal = () => {
  const [rawTier] = useQueryState("tier", { defaultValue: "professional" });
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [hasAddons, setHasAddons] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

  const { data: plans, isLoading: isPlansLoading } = useGetAvailablePlansQuery();
  const { data: paymentStatus } = useGetPaymentStatusQuery(checkoutId);
  const initiateCheckout = useInitiateCheckoutMutation();
  const { refetch: refetchSubscription } = useGetMySubscriptionQuery();

  const isValidTier = plans?.some((p) => p.name.toLowerCase() === rawTier.toLowerCase());
  const tier = isValidTier && rawTier ? rawTier.toLowerCase() : "professional";

  const tierName = tier.toUpperCase();
  const capitalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1);
  const styles = getTierStyles(tier);
  const selectedPricing = plans?.find((p) => p.name.toLowerCase() === tier) || plans?.[1];

  const monthlyPrice = selectedPricing?.price || 0;
  const annualPrice = monthlyPrice * 11;
  const addonPrice = 200;

  const basePrice = billingCycle === "annual" ? annualPrice : monthlyPrice;
  const totalPrice = basePrice + (hasAddons ? addonPrice : 0);

  useEffect(() => {
    if (paymentStatus?.status === "success") {
      toast.success("Payment successful! Your plan has been upgraded.");
      refetchSubscription();
      setCheckoutId(null);
    } else if (paymentStatus?.status === "failed") {
      toast.error("Payment failed. Please try again.");
      setCheckoutId(null);
    }
  }, [paymentStatus, refetchSubscription]);

  const handleUpgrade = async () => {
    if (!phoneNumber) {
      toast.error("Please enter your M-Pesa phone number");
      return;
    }
    if (!selectedPricing) {
      toast.error("Plan not found");
      return;
    }

    try {
      const response = await initiateCheckout.mutateAsync({
        plan_id: selectedPricing.id,
        provider: "mpesa",
        phone_number: phoneNumber,
        email: "user@example.com", // Assume current user email is available in context/token, using placeholder for now
        name: "KapuLetu User",
      });
      setCheckoutId(response.checkout_id);
    } catch (_error) {
      toast.error("Failed to initiate checkout");
    }
  };

  if (isPlansLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (checkoutId && paymentStatus?.status === "pending") {
    return (
      <div className="max-w-md mx-auto p-8 bg-background border border-border shadow-lg rounded-3xl text-center space-y-6">
        <div className="animate-pulse bg-primary/10 p-6 rounded-full inline-block">
          <IconLibrary
            name="smartphone"
            className="h-12 w-12 text-primary mx-auto animate-bounce"
          />
        </div>
        <h2 className="text-2xl font-bold">Waiting for Payment</h2>
        <p className="text-muted-foreground">
          We've sent an M-Pesa STK prompt to your phone ({phoneNumber}). Please enter your PIN to
          authorize the payment of Ksh. {formatCurrency(totalPrice)}.
        </p>
        <div className="pt-4 flex justify-center">
          <div className="h-2 w-48 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress rounded-full"></div>
          </div>
        </div>
        <Button variant="outline" onClick={() => setCheckoutId(null)} className="mt-4">
          Cancel
        </Button>
      </div>
    );
  }

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
                <div className="text-sm text-muted-foreground">
                  Ksh. {formatCurrency(monthlyPrice)} / Month
                </div>
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
                <div className="text-sm text-muted-foreground">
                  Ksh. {formatCurrency(annualPrice)} / Year
                </div>
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
                  <div className="text-sm text-muted-foreground">
                    Ksh. {formatCurrency(addonPrice)} / Month
                  </div>
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
          <Input
            placeholder="M-Pesa Phone (e.g. 254712345678)"
            className="bg-muted/50 border-none"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <Card className={`border-2 ${styles.borderColor} bg-accent/5`}>
            <CardContent className="space-y-6">
              <h3 className="font-bold text-center">Payment Details</h3>

              <div className="flex items-center gap-2 bg-background p-2 rounded-lg border">
                <IconLibrary name="smartphone" className={`h-6 w-6 ${styles.titleColor}`} />
                <Input
                  placeholder="254712345678"
                  className="border-none shadow-none focus-visible:ring-0"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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

              <Button
                className={`w-full py-6 ${styles.btnClass}`}
                onClick={handleUpgrade}
                disabled={initiateCheckout.isPending || !phoneNumber}
              >
                {initiateCheckout.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Initiating...
                  </div>
                ) : (
                  `Upgrade to ${capitalizedTier}`
                )}
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
