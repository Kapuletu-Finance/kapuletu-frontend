"use client";

import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { EngineControlTab } from "./EngineControlTab";
import { FeedbackQueueTab } from "./FeedbackQueueTab";
import { TrainingPoolTab } from "./TrainingPoolTab";

export const AdminAIGovernancePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Governance</h2>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          Manage the Kapuletu continuous learning NLP engine. Review treasurer corrections, inject
          synthetic ground truth data, and orchestrate model retraining jobs.
        </p>
      </div>

      <Tabs defaultValue="queue" className="space-y-6">
        <TabsList className="bg-muted border border-border">
          <TabsTrigger value="queue" className="gap-2">
            <IconLibrary name="feedback" className="h-4 w-4" /> Feedback Queue
          </TabsTrigger>
          <TabsTrigger value="pool" className="gap-2">
            <IconLibrary name="brain" className="h-4 w-4" /> Training Pool
          </TabsTrigger>
          <TabsTrigger value="engine" className="gap-2">
            <IconLibrary name="settings" className="h-4 w-4" /> Engine Control
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="m-0">
          <FeedbackQueueTab />
        </TabsContent>

        <TabsContent value="pool" className="m-0">
          <TrainingPoolTab />
        </TabsContent>

        <TabsContent value="engine" className="m-0">
          <EngineControlTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
