"use client";

import { Loader2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettingsForm } from "@/features/auth/components/ProfileSettingsForm";
import { useUpdateSystemConfigMutation } from "../../services/mutations";
import { useSystemConfigQuery } from "../../services/queries";
import {
  BillingRulesTab,
  DataRetentionTab,
  GlobalNotificationsTab,
  GlobalSecurityTab,
  IntegrationsTab,
  PlatformOpsTab,
} from "./AdminTabs";

export const AdminSettingsLayout: React.FC = () => {
  const { data: config, isLoading, isError } = useSystemConfigQuery();
  const updateMutation = useUpdateSystemConfigMutation();

  const handleUpdate = async (key: string, value: any) => {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal profile and global platform configurations.
        </p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-6">
        <TabsList className="flex flex-col h-auto w-full md:w-64 bg-transparent space-y-1 items-start p-0">
          <TabsTrigger
            value="profile"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md"
          >
            Personal Profile
          </TabsTrigger>
          <TabsTrigger
            value="platform"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md"
          >
            Platform Operations
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md"
          >
            Global Security
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md"
          >
            Integrations
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md"
          >
            Billing Rules
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md"
          >
            Data & Privacy
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md"
          >
            Global Alerts
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 w-full max-w-4xl">
          <TabsContent value="profile" className="mt-0 outline-none">
            <ProfileSettingsForm />
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
