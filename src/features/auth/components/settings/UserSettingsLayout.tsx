"use client";

import type * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutomationTab } from "./tabs/AutomationTab";
import { GeneralProfileTab } from "./tabs/GeneralProfileTab";
import { ReportingBillingTab } from "./tabs/ReportingBillingTab";
import { SecurityTab } from "./tabs/SecurityTab";

export const UserSettingsLayout: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Workspace Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your personal profile, security, and workspace operations.
        </p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8">
        <TabsList className="flex flex-col h-auto w-full md:w-64 bg-transparent space-y-1 items-start p-0">
          <TabsTrigger
            value="profile"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground"
          >
            Personal Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground"
          >
            Security & Access
          </TabsTrigger>
          <TabsTrigger
            value="automation"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground"
          >
            Automation & AI
          </TabsTrigger>
          <TabsTrigger
            value="reporting"
            className="w-full justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 rounded-md text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground"
          >
            Reporting & Billing
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 w-full max-w-3xl bg-card border border-border shadow-sm rounded-2xl p-6 md:p-8">
          <TabsContent value="profile" className="mt-0 outline-none">
            <GeneralProfileTab />
          </TabsContent>
          <TabsContent value="security" className="mt-0 outline-none">
            <SecurityTab />
          </TabsContent>
          <TabsContent value="automation" className="mt-0 outline-none">
            <AutomationTab />
          </TabsContent>
          <TabsContent value="reporting" className="mt-0 outline-none">
            <ReportingBillingTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
