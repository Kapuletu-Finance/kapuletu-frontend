"use client";

import { Loader2 } from "lucide-react";
import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralProfileTab } from "@/features/auth/components/settings/tabs/GeneralProfileTab";
import { useUpdateSystemConfigMutation } from "../../services/mutations";
import { useSystemConfigQuery } from "../../services/queries";
import { BillingRulesTab } from "./tabs/BillingRulesTab";
import { DataRetentionTab } from "./tabs/DataRetentionTab";
import { GlobalNotificationsTab } from "./tabs/GlobalNotificationsTab";
import { GlobalSecurityTab } from "./tabs/GlobalSecurityTab";
import { IntegrationsTab } from "./tabs/IntegrationsTab";
import { PlatformOpsTab } from "./tabs/PlatformOpsTab";

export const AdminSettingsLayout: React.FC = () => {
  const { data: config, isLoading, isError } = useSystemConfigQuery();
  const updateMutation = useUpdateSystemConfigMutation();

  const handleUpdate = async (key: string, value: unknown) => {
    await updateMutation.mutateAsync([{ key, value }]);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !config) {
    return (
      <div className="flex h-64 items-center justify-center text-destructive">
        Failed to load platform configurations.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Platform Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your personal profile and global platform configurations.
        </p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col gap-6 w-full">
        <TabsList className="flex h-auto w-full bg-transparent items-center justify-start p-0 overflow-x-auto scrollbar-hide border-b border-border rounded-none shrink-0 gap-6">
          <TabsTrigger
            value="profile"
            className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
          >
            Personal Profile
          </TabsTrigger>
          <TabsTrigger
            value="platform"
            className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
          >
            Platform Operations
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
          >
            Global Security
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
          >
            Integrations
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
          >
            Billing Rules
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
          >
            Data & Privacy
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
          >
            Global Alerts
          </TabsTrigger>
        </TabsList>

        <div className="w-full bg-card border border-border shadow-sm rounded-2xl p-5 md:p-8 min-h-[400px]">
          <TabsContent value="profile" className="mt-0 outline-none">
            <GeneralProfileTab />
          </TabsContent>
          <TabsContent value="platform" className="mt-0 outline-none">
            <PlatformOpsTab
              config={config}
              onUpdate={handleUpdate}
              isLoading={updateMutation.isPending}
            />
          </TabsContent>
          <TabsContent value="security" className="mt-0 outline-none">
            <GlobalSecurityTab
              config={config}
              onUpdate={handleUpdate}
              isLoading={updateMutation.isPending}
            />
          </TabsContent>
          <TabsContent value="integrations" className="mt-0 outline-none">
            <IntegrationsTab
              config={config}
              onUpdate={handleUpdate}
              isLoading={updateMutation.isPending}
            />
          </TabsContent>
          <TabsContent value="billing" className="mt-0 outline-none">
            <BillingRulesTab
              config={config}
              onUpdate={handleUpdate}
              isLoading={updateMutation.isPending}
            />
          </TabsContent>
          <TabsContent value="privacy" className="mt-0 outline-none">
            <DataRetentionTab
              config={config}
              onUpdate={handleUpdate}
              isLoading={updateMutation.isPending}
            />
          </TabsContent>
          <TabsContent value="notifications" className="mt-0 outline-none">
            <GlobalNotificationsTab
              config={config}
              onUpdate={handleUpdate}
              isLoading={updateMutation.isPending}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
