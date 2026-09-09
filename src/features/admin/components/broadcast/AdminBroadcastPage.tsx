"use client";

import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import { BroadcastForm } from "./BroadcastForm";
import { BroadcastHistory } from "./BroadcastHistory";

export const AdminBroadcastPage: React.FC = () => {
  return (
    <PageLayout
      title="Broadcast & Notifications"
      subtitle="Send system-wide announcements and manage platform communications."
    >
      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="compose">Compose Broadcast</TabsTrigger>
          <TabsTrigger value="history">Broadcast History</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="mt-0">
          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <div className="md:col-span-1">
              <BroadcastForm />
            </div>
            <div>
              <div className="bg-card text-card-foreground border rounded-lg p-4 shadow-sm sticky top-6">
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <IconLibrary name="info" className="h-5 w-5 text-primary" />
                  <span>Broadcast Guidelines</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Keep messages direct and concise.</p>
                  <p>• Avoid AI marketing language.</p>
                  <p>• SMS incurs higher costs, use only for urgent alerts.</p>
                  <p>• In-App notifications are free and instantly visible.</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <BroadcastHistory />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};
