import type { Metadata } from "next";
import { CommunicationsShell } from "@/features/admin/components/communications/CommunicationsShell";

export const metadata: Metadata = {
  title: "Communications | Kapuletu Admin",
  description: "Broadcasts, delivery, suppressions and email templates.",
};

export default function CommunicationsLayout({ children }: { children: React.ReactNode }) {
  return <CommunicationsShell>{children}</CommunicationsShell>;
}
