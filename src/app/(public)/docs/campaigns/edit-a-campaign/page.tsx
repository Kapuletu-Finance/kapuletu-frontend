import type { Metadata } from "next";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export const metadata: Metadata = {
  title: "Edit Campaign Details | KapuLetu Docs",
  description: "Learn how to update and manage your campaign's configurations.",
  openGraph: {
    title: "Edit Campaign Details | KapuLetu Docs",
    description: "Learn how to update and manage your campaign's configurations.",
  },
  twitter: {
    title: "Edit Campaign Details | KapuLetu Docs",
    description: "Learn how to update and manage your campaign's configurations.",
  },
};

export default function CampaignSettingsPage() {
  const steps = [
    {
      title: "Locate the Settings Tab",
      description:
        "Inside your chosen campaign, click on the 'Settings' tab located in the campaign navigation menu.",
      image: "/docs/campaigns/edit-a-campaign-step-1.png",
    },
    {
      title: "Edit Campaign Details",
      description: "Find the 'Campaign Details' section and click on the 'Edit' button.",
      image: "/docs/campaigns/edit-a-campaign-step-2.png",
    },
    {
      title: "Adjust Information",
      description:
        "Make the necessary changes to your campaign. You can update the name, description, target amount, or extend the deadline.",
      image: "/docs/campaigns/edit-a-campaign-step-3.png",
    },
    {
      title: "Save Changes",
      description:
        "Once you have adjusted the details, click the 'Save Changes' button to apply the updates immediately.",
      image: "/docs/campaigns/edit-a-campaign-step-4.png",
    },
  ];

  return (
    <DocsArticle
      title="Campaign Settings & Editing"
      description="Learn how to update and manage your campaign's configurations."
      difficulty="Beginner"
    >
      <p className="mb-4">
        As your fundraising progresses, you might need to adjust your goals, extend a deadline, or
        clarify the payment instructions. Here is how you can edit your campaign details.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for editing a campaign" />

      <DocsCallout type="warning" title="Note on Targets">
        While you can lower your target amount, doing so below the currently raised amount may cause
        discrepancies in your reports. Always communicate major changes to your members.
      </DocsCallout>
    </DocsArticle>
  );
}
