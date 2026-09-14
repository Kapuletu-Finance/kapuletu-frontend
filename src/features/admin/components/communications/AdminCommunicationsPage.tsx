"use client";

import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import { AccessControlsPanel } from "./AccessControlsPanel";
import { BroadcastForm } from "./BroadcastForm";
import { BroadcastHistory } from "./BroadcastHistory";
import { CommunicationLogs } from "./CommunicationLogs";
import { InvitesPanel } from "./InvitesPanel";

export const AdminCommunicationsPage: React.FC = () => {
  return (
    <PageLayout
      title="Communications Hub"
      subtitle="Central nerve center for outbound messaging, tester invites, and system access controls."
    >
      <Tabs defaultValue="broadcasts" className="flex flex-col gap-6 w-full">
        <div className="w-full border-b border-border overflow-x-auto">
          <TabsList className="flex h-auto w-max bg-transparent items-center justify-start p-0 rounded-none shrink-0 gap-6 min-w-full">
            <TabsTrigger
              value="broadcasts"
              className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
            >
              Broadcasts
            </TabsTrigger>
            <TabsTrigger
              value="invites"
              className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
            >
              VIP Invites
            </TabsTrigger>
            <TabsTrigger
              value="access"
              className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
            >
              Access Controls
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="px-1 py-3 -mb-[1px] border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent rounded-none text-[13px] font-medium text-muted-foreground data-[state=active]:text-foreground transition-all whitespace-nowrap hover:text-foreground"
            >
              Delivery Logs
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Area */}
        <div className="w-full bg-card border border-border shadow-sm rounded-2xl p-5 md:p-8 min-h-[400px]">
          <TabsContent
              value="broadcasts"
              className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Mass Broadcasts</h3>
                  <p className="text-sm text-muted-foreground">
                    Draft and send announcements via Email, SMS, or In-App.
                  </p>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                  <div className="lg:col-span-1 border border-border rounded-xl bg-card p-1 shadow-sm">
                    <BroadcastForm />
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center gap-2 font-semibold mb-3 text-primary">
                        <IconLibrary name="info" className="h-5 w-5" />
                        <span>Best Practices</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-2.5">
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          Keep subject lines direct and action-oriented.
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          SMS incurs higher per-message costs. Use strictly for urgent alerts.
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          In-App notifications are free and visually persistent.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm flex flex-col">
                  <div className="p-0">
                    <BroadcastHistory />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="invites"
              className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <InvitesPanel />
            </TabsContent>

            <TabsContent
              value="access"
              className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <AccessControlsPanel />
            </TabsContent>

            <TabsContent
              value="logs"
              className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold tracking-tight">Delivery Logs</h3>
                <p className="text-sm text-muted-foreground">
                  Historical ledger of all communications sent from the platform.
                </p>
              </div>
              <CommunicationLogs />
            </TabsContent>
        </div>
      </Tabs>
    </PageLayout>
  );
};
