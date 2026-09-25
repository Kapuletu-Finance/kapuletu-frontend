import type { Metadata } from "next";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export const metadata: Metadata = {
  title: "Viewing Group History | KapuLetu Docs",
  description: "Track the comprehensive audit log of actions across all campaigns in your group.",
  openGraph: {
    title: "Viewing Group History | KapuLetu Docs",
    description: "Track the comprehensive audit log of actions across all campaigns in your group.",
  },
  twitter: {
    title: "Viewing Group History | KapuLetu Docs",
    description: "Track the comprehensive audit log of actions across all campaigns in your group.",
  },
};

export default function ViewingHistoryPage() {
  const steps = [
    {
      title: "Open Group Dashboard",
      description:
        "Ensure you have the correct group selected via the Group Switcher, then navigate to the dashboard homepage.",
      image: "/docs/groups/history-step-1.png",
    },
    {
      title: "Locate the Audit Log",
      description: "Click on the 'Audit Log' or 'History' tab within the main group navigation.",
      image: "/docs/groups/history-step-2.png",
    },
    {
      title: "Filter by Event",
      description:
        "Use the filter options to narrow down the history (e.g., filter by 'Campaign Created', 'Settings Changed', or 'Contribution Added').",
      image: "/docs/groups/history-step-3.png",
    },
    {
      title: "Review Details",
      description:
        "Click on any log entry to see exactly who made the change, when it occurred, and what the previous values were.",
      image: "/docs/groups/history-step-4.png",
    },
  ];

  return (
    <DocsArticle
      title="Viewing Group History"
      description="Track the comprehensive audit log of actions across all campaigns in your group."
      difficulty="Intermediate"
    >
      <p className="mb-4">
        Transparency and accountability are critical when handling community finances. The Group
        History provides a chronological ledger of every major action taken within the group,
        serving as a reliable audit trail.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for viewing group history" />

      <DocsCallout type="info" title="System Logs">
        Certain actions, such as automated WhatsApp contribution processing, will show 'System' as
        the actor instead of a specific user.
      </DocsCallout>
    </DocsArticle>
  );
}
