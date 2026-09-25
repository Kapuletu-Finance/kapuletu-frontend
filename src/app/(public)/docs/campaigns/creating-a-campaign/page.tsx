import type { Metadata } from "next";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export const metadata: Metadata = {
  title: "Creating a Campaign | KapuLetu Docs",
  description: "Learn how to set up a new campaign or fundraising pool.",
  openGraph: {
    title: "Creating a Campaign | KapuLetu Docs",
    description: "Learn how to set up a new campaign or fundraising pool.",
  },
  twitter: {
    title: "Creating a Campaign | KapuLetu Docs",
    description: "Learn how to set up a new campaign or fundraising pool.",
  },
};

export default function CreatingACampaignPage() {
  const steps = [
    {
      title: "Prerequisite: Create a Group",
      description: "In order to create a campaign, you must first have created a group to host it.",
      image: "/docs/campaigns/creating-step-1.png",
    },
    {
      title: "Start a New Campaign",
      description: "Inside your group dashboard, click on the 'New Campaign' button.",
      image: "/docs/campaigns/creating-step-2.png",
    },
    {
      title: "Fill Campaign Details",
      description:
        "You will be required to fill in the campaign name, description, target amount, payment instructions (where people will be sending money), and the deadline.",
      image: "/docs/campaigns/creating-step-3.png",
    },
    {
      title: "Create Campaign",
      description: "After filling this information, click 'Create Campaign'.",
      image: "/docs/campaigns/creating-step-4.png",
    },
    {
      title: "Ready to Track",
      description:
        "This will take you to the created campaign, which is now ready to start tracking the contributions of that fundraising activity.",
      image: "/docs/campaigns/creating-step-5.png",
    },
  ];

  return (
    <DocsArticle
      title="Creating a Campaign"
      description="Step-by-step guide to setting up a new fundraising activity."
      difficulty="Beginner"
    >
      <p className="mb-4">
        Starting a new fundraising activity is simple. Follow these steps to set up your campaign
        and start tracking contributions.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for creating a campaign" />

      <DocsCallout type="tip" title="Payment Instructions">
        Be clear with your payment instructions (e.g., M-Pesa Paybill, Till Number, or Bank
        Account). Members will see this when they want to contribute.
      </DocsCallout>
    </DocsArticle>
  );
}
