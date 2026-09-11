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
      <div className="bg-card border-border border rounded-2xl shadow-xs overflow-hidden">
        <Tabs defaultValue="broadcasts" className="w-full flex flex-col sm:flex-row">
          {/* Vertical Sidebar for Tabs on Desktop, Horizontal on Mobile */}
          <div className="sm:w-64 shrink-0 border-b sm:border-b-0 sm:border-r border-border bg-muted/20 p-4 sm:min-h-[calc(100vh-14rem)]">
            <TabsList className="flex sm:flex-col h-auto w-full bg-transparent gap-2 p-0">
              <TabsTrigger
                value="broadcasts"
                className="w-full justify-start gap-3 py-2.5 px-3 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-border data-[state=active]:border transition-all duration-300"
              >
                <IconLibrary name="megaphone" className="size-4" />
                <span className="font-medium">Broadcasts</span>
              </TabsTrigger>
              <TabsTrigger
                value="invites"
                className="w-full justify-start gap-3 py-2.5 px-3 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-border data-[state=active]:border transition-all duration-300"
              >
                <IconLibrary name="mail" className="size-4" />
                <span className="font-medium">VIP Invites</span>
              </TabsTrigger>
              <TabsTrigger
                value="access"
                className="w-full justify-start gap-3 py-2.5 px-3 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-border data-[state=active]:border transition-all duration-300"
              >
                <IconLibrary name="shield-check" className="size-4" />
                <span className="font-medium">Access Controls</span>
              </TabsTrigger>
              <div className="h-px w-full bg-border my-2 hidden sm:block" />
              <TabsTrigger
                value="logs"
                className="w-full justify-start gap-3 py-2.5 px-3 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-border data-[state=active]:border transition-all duration-300 text-muted-foreground"
              >
                <IconLibrary name="list" className="size-4" />
                <span className="font-medium">Delivery Logs</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-background/50">
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
      </div>
    </PageLayout>
  );
};
