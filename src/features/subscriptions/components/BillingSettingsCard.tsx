import type React from "react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  useCancelSubscriptionMutation,
  useUpdateBillingSettingsMutation,
} from "@/features/auth/services/mutations";
import type { BillingSettings } from "@/features/auth/types";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface Props {
  billingSettings?: BillingSettings;
  isActivePlan: boolean;
}

export const BillingSettingsCard: React.FC<Props> = ({ billingSettings, isActivePlan }) => {
  const [autoRenew, setAutoRenew] = useState(billingSettings?.auto_renew_subscription ?? true);
  const updateSettings = useUpdateBillingSettingsMutation();
  const cancelSubscription = useCancelSubscriptionMutation();

  const handleToggle = (checked: boolean) => {
    setAutoRenew(checked);
    updateSettings.mutate({
      auto_renew_subscription: checked,
      billing_email: billingSettings?.billing_email || null,
    });
  };

  const handleCancel = () => {
    cancelSubscription.mutate();
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Billing Settings</CardTitle>
        <CardDescription>Manage your subscription renewal and payment settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Auto-Renew Subscription</h4>
            <p className="text-sm text-muted-foreground">
              Automatically renew your subscription at the end of the billing cycle.
            </p>
          </div>
          <Switch
            checked={autoRenew}
            onCheckedChange={handleToggle}
            disabled={updateSettings.isPending || !isActivePlan}
          />
        </div>

        {isActivePlan && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-destructive">Cancel Subscription</h4>
              <p className="text-sm text-muted-foreground">
                Turn off auto-renew immediately. You will retain access until the end of your
                billing cycle.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-9 px-4 py-2">
                <IconLibrary name="close" className="w-4 h-4 mr-2" />
                Cancel Plan
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will disable auto-renewal for your subscription. Your plan will downgrade
                    to Free at the end of the current billing cycle, and you may lose access to
                    premium features.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, cancel it
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
