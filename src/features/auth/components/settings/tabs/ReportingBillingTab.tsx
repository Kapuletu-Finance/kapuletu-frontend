import { Diamond, Loader2, MessageCircle } from "lucide-react";
import * as React from "react";
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import { Separator } from "@/components/ui/separator";
import { useUpdateReportingSettingsMutation } from "@/features/auth/services/mutations";
import { useGetSettingsQuery } from "@/features/auth/services/queries";

export const ReportingBillingTab: React.FC = () => {
  const { data: settings, isLoading: isSettingsLoading } = useGetSettingsQuery();
  const updateReportingMutation = useUpdateReportingSettingsMutation();
  const [subscriptionsEnabled, setSubscriptionsEnabled] = React.useState(false);

  if (isSettingsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Diamond className="w-4 h-4" />
        </div>
        <h3 className="font-semibold text-lg text-foreground tracking-tight">
          Reporting & Billing
        </h3>
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-foreground">Subscriptions</h4>
            <p className="text-xs text-muted-foreground">
              Automatically renew your subscription when it expires
            </p>
          </div>
        </div>
        <LabeledSwitch checked={subscriptionsEnabled} onCheckedChange={setSubscriptionsEnabled} />
      </div>

      <Separator className="w-full" />

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hidden">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-foreground">WhatsApp Reporting</h4>
            <p className="text-xs text-muted-foreground">
              Allow retrieving interactive campaign reports via WhatsApp
            </p>
          </div>
        </div>
        <LabeledSwitch
          checked={settings?.reporting?.allow_whatsapp_reports ?? false}
          onCheckedChange={(checked) => {
            if (settings) {
              updateReportingMutation.mutate({
                ...settings.reporting,
                allow_whatsapp_reports: checked,
              });
            }
          }}
          disabled={updateReportingMutation.isPending}
        />
      </div>
    </div>
  );
};
