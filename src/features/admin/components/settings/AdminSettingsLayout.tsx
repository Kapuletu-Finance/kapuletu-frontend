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

      <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        <TabsList className="flex flex-row md:flex-col h-auto w-full md:w-64 bg-transparent space-x-2 md:space-x-0 md:space-y-1 items-start p-0 overflow-x-auto md:overflow-visible scrollbar-hide shrink-0 pb-2 md:pb-0">
          <TabsTrigger
            value="profile"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground whitespace-nowrap md:whitespace-normal"
          >
            Personal Profile
          </TabsTrigger>
          <TabsTrigger
            value="platform"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground whitespace-nowrap md:whitespace-normal"
          >
            Platform Operations
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground whitespace-nowrap md:whitespace-normal"
          >
            Global Security
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground whitespace-nowrap md:whitespace-normal"
          >
            Integrations
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground whitespace-nowrap md:whitespace-normal"
          >
            Billing Rules
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground whitespace-nowrap md:whitespace-normal"
          >
            Data & Privacy
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground whitespace-nowrap md:whitespace-normal"
          >
            Global Alerts
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-w-0 w-full max-w-3xl bg-card border border-border shadow-sm rounded-2xl p-5 md:p-8">
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
