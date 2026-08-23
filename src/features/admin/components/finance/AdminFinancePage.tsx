import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { ManualOverrideTab } from "./ManualOverrideTab";
import { PaymentsTab } from "./PaymentsTab";
import { PlansTab } from "./PlansTab";

export const AdminFinancePage: React.FC = () => {
  return (
    <PageLayout
      title="Finance Management"
      subtitle="Manage subscription plans, view payments, and override billing."
    >
      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="override">Override</TabsTrigger>
        </TabsList>
        <TabsContent value="plans">
          <PlansTab />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentsTab />
        </TabsContent>
        <TabsContent value="override">
          <ManualOverrideTab />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};
