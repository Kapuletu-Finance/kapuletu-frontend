"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { AdminBlocklistTab } from "./AdminBlocklistTab";
import { AdminUserSettingsTab } from "./AdminUserSettingsTab";
import { AdminUsersTab } from "./AdminUsersTab";
import { AdminWaitlistHistoryTab } from "./AdminWaitlistHistoryTab";
import { AdminWaitlistTab } from "./AdminWaitlistTab";
import { AdminWhitelistTab } from "./AdminWhitelistTab";

export const AdminUsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage users, waitlist, testers, security, and settings.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none px-0 h-auto bg-transparent mb-6">
          <TabsTrigger
            value="users"
            className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
          >
            <IconLibrary name="users" className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="waitlist"
            className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
          >
            <IconLibrary name="list" className="h-4 w-4 mr-2" />
            Waitlist
          </TabsTrigger>
          <TabsTrigger
            value="whitelist"
            className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
          >
            <IconLibrary name="shield" className="h-4 w-4 mr-2" />
            Testers / Whitelist
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
          >
            <IconLibrary name="clock" className="h-4 w-4 mr-2" />
            Activity History
          </TabsTrigger>
          <TabsTrigger
            value="blocklist"
            className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
          >
            <IconLibrary name="lock" className="h-4 w-4 mr-2" />
            Blocked List
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-4 py-2"
          >
            <IconLibrary name="settings" className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="flex-1 mt-0 outline-none">
          <AdminUsersTab />
        </TabsContent>
        <TabsContent value="waitlist" className="flex-1 mt-0 outline-none">
          <AdminWaitlistTab />
        </TabsContent>
        <TabsContent value="whitelist" className="flex-1 mt-0 outline-none">
          <AdminWhitelistTab />
        </TabsContent>
        <TabsContent value="history" className="flex-1 mt-0 outline-none">
          <AdminWaitlistHistoryTab />
        </TabsContent>
        <TabsContent value="blocklist" className="flex-1 mt-0 outline-none">
          <AdminBlocklistTab />
        </TabsContent>
        <TabsContent value="settings" className="flex-1 mt-0 outline-none">
          <AdminUserSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
