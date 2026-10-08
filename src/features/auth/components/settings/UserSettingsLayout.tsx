"use client";

import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutomationTab } from "./tabs/AutomationTab";
import { CommunicationsTab } from "./tabs/CommunicationsTab";
import { GeneralProfileTab } from "./tabs/GeneralProfileTab";
import { ReportingBillingTab } from "./tabs/ReportingBillingTab";
import { SecurityTab } from "./tabs/SecurityTab";

const TABS = ["profile", "security", "automation", "reporting", "communications"];

export const UserSettingsLayout: React.FC = () => {
  // Deep links such as /settings?tab=communications (used by the unsubscribe page)
  const requested = useSearchParams().get("tab");
  const initialTab = requested && TABS.includes(requested) ? requested : "profile";
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Workspace Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your personal profile, security, and workspace operations.
        </p>
      </div>

      <Tabs defaultValue={initialTab} className="flex flex-col gap-6 w-full">
        <ScrollArea orientation="horizontal" className="w-full border-b border-border">
          <TabsList className="flex h-auto w-full bg-transparent items-center justify-start p-0 rounded-none shrink-0 gap-6">
            <TabsTrigger
              value="profile"
              className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
            >
              Personal Profile
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
            >
              Security & Access
            </TabsTrigger>
            <TabsTrigger
              value="automation"
              className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
            >
              Automation & AI
            </TabsTrigger>
            <TabsTrigger
              value="reporting"
              className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
            >
              Reporting & Billing
            </TabsTrigger>
            <TabsTrigger
              value="communications"
              className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
            >
              Communications
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        <div className="w-full bg-card border border-border shadow-sm rounded-2xl p-5 md:p-8 min-h-[400px]">
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
          <TabsContent value="communications" className="mt-0 outline-none">
            <CommunicationsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
