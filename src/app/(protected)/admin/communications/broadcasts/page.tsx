import { Suspense } from "react";
import { BroadcastsPage } from "@/features/admin/components/communications/BroadcastsPage";

export default function CommunicationsBroadcastsRoute() {
  return (
    <Suspense>
      <BroadcastsPage />
    </Suspense>
  );
}
