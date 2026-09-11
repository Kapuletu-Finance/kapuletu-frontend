import type { Metadata } from "next";
import { CommunicationLogs } from "@/features/admin/components/communications/CommunicationLogs";

export const metadata: Metadata = {
  title: "Communication Logs | Kapuletu Admin",
  description: "View and manage all outgoing communications.",
};

export default function CommunicationsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CommunicationLogs />
    </div>
  );
}
