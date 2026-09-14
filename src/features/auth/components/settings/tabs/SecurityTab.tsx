import { Loader2, Lock } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChangePasswordDialog } from "@/features/auth/components/ChangePasswordDialog";
import { useUpdateAuthSettingsMutation } from "@/features/auth/services/mutations";
import { useGetMeQuery } from "@/features/auth/services/queries";

export const SecurityTab: React.FC = () => {
  const { data: user, isLoading: isUserLoading } = useGetMeQuery();
  const updateAuthSettingsMutation = useUpdateAuthSettingsMutation();

  if (isUserLoading) {
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
          <Lock className="w-4 h-4" />
        </div>
        <h3 className="font-semibold text-lg text-foreground tracking-tight">Security & Access</h3>
      </div>

      <div className="flex flex-col py-2 gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-foreground">Two-factor Authentication</h4>
            <p className="text-xs text-muted-foreground">
              Adds an extra layer of security to your account
            </p>
          </div>
          <LabeledSwitch
            checked={user?.two_factor_enabled ?? false}
            onCheckedChange={(checked) => {
              updateAuthSettingsMutation.mutate({
                two_factor_enabled: checked,
              });
            }}
            disabled={updateAuthSettingsMutation.isPending}
          />
        </div>

        {user?.two_factor_enabled && (
          <div className="bg-muted/30 p-4 rounded-xl border border-border flex items-center justify-between mt-2">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-foreground">Authentication Channel</h4>
              <p className="text-xs text-muted-foreground">
                Where should we send your verification codes?
              </p>
            </div>
            <Select
              value={user?.two_factor_channel || "whatsapp"}
              onValueChange={(value) => {
                updateAuthSettingsMutation.mutate({
                  two_factor_channel: value,
                });
              }}
              disabled={updateAuthSettingsMutation.isPending}
            >
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-foreground">Password Authentication</h4>
            <p className="text-xs text-muted-foreground">
              Update your password to keep your account secure
            </p>
          </div>
          <ChangePasswordDialog>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </ChangePasswordDialog>
        </div>
      </div>
    </div>
  );
};
