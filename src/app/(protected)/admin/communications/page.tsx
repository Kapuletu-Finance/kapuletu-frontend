import type { Metadata } from "next";
import { AdminCommunicationsPage } from "@/features/admin/components/communications/AdminCommunicationsPage";

export const metadata: Metadata = {
  title: "Communications Hub | Kapuletu Admin",
  description: "Centralized hub for all outgoing communications and platform access controls.",
};

export default function CommunicationsPage() {
  return <AdminCommunicationsPage />;
}
