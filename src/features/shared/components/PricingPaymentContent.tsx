"use client";

import Link from "next/link";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetMySubscriptionQuery } from "@/features/auth/services/queries";
import {
  useActivateTrialMutation,
  useInitiateCheckoutMutation,
} from "@/features/finance/services/mutations";
import {
  useGetAvailablePlansQuery,
  useGetPaymentStatusQuery,
} from "@/features/finance/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { getTierStyles } from "@/features/shared/utils/pricing";
import { formatCurrency } from "@/lib/formatters";

const PricingPaymentModal = () => {
  const [rawTier] = useQueryState("tier", { defaultValue: "professional" });
  const [actionQuery, setActionQuery] = useQueryState("action");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [hasAddons, setHasAddons] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [skipTrial, setSkipTrial] = useState(false);

  // Trial Activation State
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [trialStep, setTrialStep] = useState<"idle" | "provisioning" | "success">("idle");
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [provisionText, setProvisionText] = useState("Initializing workspace...");

  const { data: plans, isLoading: isPlansLoading } = useGetAvailablePlansQuery();
  const { data: paymentStatus } = useGetPaymentStatusQuery(checkoutId);
  const initiateCheckout = useInitiateCheckoutMutation();
  const activateTrial = useActivateTrialMutation();
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
    if (actionQuery === "start_trial" && tier === "professional") {
      setIsTrialModalOpen(true);
      // Remove query param to prevent re-opening on reload
      setActionQuery(null);
    }
  }, [actionQuery, tier, setActionQuery]);

  useEffect(() => {
    if (paymentStatus?.status === "success") {
      toast.success("Payment successful! Your plan has been upgraded.");
      refetchSubscription();
      setIsSuccess(true);
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

  const handleActivateTrial = async () => {
    setIsTrialModalOpen(true);
    setTrialStep("provisioning");

    // Simulate provisioning stages
    setProvisionProgress(25);
    setProvisionText("Configuring premium features...");

    await new Promise((r) => setTimeout(r, 1000));
    setProvisionProgress(50);
    setProvisionText("Setting up analytics engine...");

    await new Promise((r) => setTimeout(r, 1000));
    setProvisionProgress(80);
    setProvisionText("Finalizing your account...");

    try {
      await activateTrial.mutateAsync();
      setProvisionProgress(100);
      setProvisionText("Success!");

      await new Promise((r) => setTimeout(r, 500));
      setTrialStep("success");

      // Close modal and refresh after short delay
      setTimeout(() => {
        setIsTrialModalOpen(false);
        setIsSuccess(true);
        refetchSubscription();
      }, 2000);
    } catch (error: unknown) {
      setTrialStep("idle");
      setIsTrialModalOpen(false);
      const message =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(message || "Failed to activate trial");
    }
  };

  if (isPlansLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto p-8 bg-background border border-border shadow-lg rounded-3xl text-center space-y-6">
        <div className="bg-green-500/10 p-6 rounded-full inline-block">
          <IconLibrary name="check-circle" className="h-12 w-12 text-green-500 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-500">
          Upgrade Successful!
        </h2>
        <p className="text-muted-foreground">
          Welcome to the <strong className={styles.titleColor}>{capitalizedTier}</strong> tier. Your
          new limits and features are now unlocked.
        </p>
        <div className="pt-4">
          <Link href="/subscriptions">
            <Button className="w-full">Return to Dashboard</Button>
          </Link>
        </div>
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
    <div className="max-w-4xl mx-auto p-8 bg-background border border-border shadow-lg rounded-3xl relative">
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
          {tier === "professional" && !skipTrial ? (
            <Card className={`border-2 ${styles.borderColor} bg-accent/5`}>
              <CardContent className="space-y-6 pt-6">
                <h3 className="font-bold text-center text-xl">Start Your 21-Day Free Trial</h3>
                <p className="text-center text-muted-foreground text-sm">
                  Experience all premium features of KapuLetu Professional for 21 days. No credit
                  card or M-Pesa required.
                </p>
                <Button
                  className={`w-full py-6 ${styles.btnClass}`}
                  onClick={() => setIsTrialModalOpen(true)}
                >
                  Activate Trial
                </Button>
                <div className="text-center pt-2">
                  <Button
                    variant="link"
                    onClick={() => setSkipTrial(true)}
                    className="text-sm text-muted-foreground"
                  >
                    Skip trial and pay directly
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Label>Account Details</Label>
              <Input
                placeholder="M-Pesa Phone (e.g. 254712345678)"
                className="bg-muted/50 border-none"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              <Card className={`border-2 ${styles.borderColor} bg-accent/5`}>
                <CardContent className="space-y-6">
                  <h3 className="font-bold text-center pt-6">Payment Details</h3>

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
            </>
          )}
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

      {/* Trial Activation Modal */}
      <Dialog
        open={isTrialModalOpen}
        onOpenChange={(open) => {
          if (!open && trialStep !== "provisioning") {
            setIsTrialModalOpen(false);
            setTrialStep("idle");
          }
        }}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background border-border shadow-2xl rounded-2xl">
          <div className="p-8 space-y-6">
            {trialStep === "idle" && (
              <div className="text-center space-y-6">
                <div
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 text-primary`}
                >
                  <IconLibrary name="star" className="h-8 w-8 fill-primary" />
                </div>
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-bold">Unlock Professional</DialogTitle>
                  <p className="text-muted-foreground">
                    You're about to start a 21-day free trial. Experience advanced analytics,
                    priority support, and unlimited groups.
                  </p>
                </div>
                <div className="pt-4 space-y-3">
                  <Button
                    className="w-full py-6 text-lg rounded-xl shadow-md transition-all hover:scale-[1.02]"
                    onClick={handleActivateTrial}
                  >
                    Start Provisioning
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setIsTrialModalOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {trialStep === "provisioning" && (
              <div className="text-center space-y-8 py-4">
                <DialogTitle className="sr-only">Provisioning Account</DialogTitle>
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                  <IconLibrary name="settings" className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold animate-pulse">{provisionText}</h3>
                  <Progress value={provisionProgress} className="h-2 w-full" />
                </div>
              </div>
            )}

            {trialStep === "success" && (
              <div className="text-center space-y-6 py-4">
                <DialogTitle className="sr-only">Success</DialogTitle>
                <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center scale-in-center">
                  <IconLibrary name="check-circle" className="h-10 w-10 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-green-600 dark:text-green-500">
                    Welcome to Pro!
                  </h3>
                  <p className="text-muted-foreground">
                    Your workspace has been successfully upgraded. Redirecting...
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PricingPaymentModal;
