import { Loader2, MessageCircle } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import { Separator } from "@/components/ui/separator";
import { useUpdateAutomationSettingsMutation } from "@/features/auth/services/mutations";
import { useGetSettingsQuery } from "@/features/auth/services/queries";
import { CampaignSelect } from "@/features/contributions/components/CampaignSelect";
import { GroupSelect } from "@/features/contributions/components/GroupSelect";

export const AutomationTab: React.FC = () => {
  const { data: settings, isLoading: isSettingsLoading } = useGetSettingsQuery();
  const updateAutomationMutation = useUpdateAutomationSettingsMutation();

  const [showAutoApproveWarning, setShowAutoApproveWarning] = React.useState(false);
  const [pendingGroupId, setPendingGroupId] = React.useState<string | undefined>(undefined);
  const [pendingCampaignId, setPendingCampaignId] = React.useState<string | undefined>(undefined);

  const handleOpenAutoApproveDialog = () => {
    setPendingGroupId(settings?.automation?.auto_approve_group_id || undefined);
    setPendingCampaignId(settings?.automation?.auto_approve_campaign_id || undefined);
    setShowAutoApproveWarning(true);
  };

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
          <MessageCircle className="w-4 h-4" />
        </div>
        <h3 className="font-semibold text-lg text-foreground tracking-tight">Automation & AI</h3>
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-foreground">WhatsApp Approvals</h4>
            <p className="text-xs text-muted-foreground">
              Instantly approve forwarded transactions via WhatsApp
            </p>
          </div>
        </div>
        <LabeledSwitch
          checked={settings?.automation?.allow_whatsapp_approvals ?? false}
          onCheckedChange={(checked) => {
            if (settings) {
              updateAutomationMutation.mutate({
                ...settings.automation,
                allow_whatsapp_approvals: checked,
              });
            }
          }}
          disabled={updateAutomationMutation.isPending}
        />
      </div>

      <Separator className="w-full" />

      <div className="flex flex-col py-2 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-foreground">AI Auto-Approval</h4>
              <p className="text-xs text-muted-foreground">
                Automatically approve valid M-Pesa transactions to a designated campaign.
              </p>
            </div>
          </div>
          <LabeledSwitch
            checked={settings?.automation?.auto_approve_enabled ?? false}
            onCheckedChange={(checked) => {
              if (checked) {
                handleOpenAutoApproveDialog();
              } else if (settings) {
                updateAutomationMutation.mutate({
                  ...settings.automation,
                  auto_approve_enabled: false,
                  auto_approve_group_id: null,
                  auto_approve_campaign_id: null,
                });
              }
            }}
            disabled={updateAutomationMutation.isPending}
          />
        </div>

        {settings?.automation?.auto_approve_enabled && (
          <div className="bg-muted/30 p-4 rounded-xl border border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Transactions are auto-approved to the selected target.
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleOpenAutoApproveDialog();
              }}
            >
              Edit Target
            </Button>
          </div>
        )}
      </div>

      <Separator className="w-full" />

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-foreground">WhatsApp Creation</h4>
            <p className="text-xs text-muted-foreground">
              Create campaigns and groups interactively using Kapuletu AI via WhatsApp
            </p>
          </div>
        </div>
        <LabeledSwitch
          checked={settings?.automation?.allow_whatsapp_creation ?? false}
          onCheckedChange={(checked) => {
            if (settings) {
              updateAutomationMutation.mutate({
                ...settings.automation,
                allow_whatsapp_creation: checked,
              });
            }
          }}
          disabled={updateAutomationMutation.isPending}
        />
      </div>

      <Dialog open={showAutoApproveWarning} onOpenChange={setShowAutoApproveWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Auto-Approval Target</DialogTitle>
            <DialogDescription className="space-y-2">
              <p className="font-medium text-destructive">
                Are you sure you want to enable Auto-Approval? All incoming valid M-Pesa
                transactions will be instantly approved without your review. This action cannot be
                undone on a per-transaction basis.
              </p>
              <p>
                Select the Group and Campaign that incoming M-Pesa transactions should be instantly
                approved to.
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <FieldLabel className="text-sm font-semibold">Group</FieldLabel>
              <GroupSelect
                value={pendingGroupId}
                onChange={(val) => {
                  setPendingGroupId(val);
                  setPendingCampaignId(undefined);
                }}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel className="text-sm font-semibold">Campaign</FieldLabel>
              <CampaignSelect
                groupId={pendingGroupId || ""}
                value={pendingCampaignId}
                onChange={(val) => {
                  setPendingCampaignId(val);
                }}
                disabled={!pendingGroupId}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAutoApproveWarning(false)}>
              Cancel
            </Button>
            <Button
              disabled={!pendingGroupId || !pendingCampaignId}
              onClick={() => {
                setShowAutoApproveWarning(false);
                if (settings) {
                  updateAutomationMutation.mutate({
                    ...settings.automation,
                    auto_approve_enabled: true,
                    auto_approve_group_id: pendingGroupId,
                    auto_approve_campaign_id: pendingCampaignId,
                  });
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
