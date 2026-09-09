import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export default function AddingContributionManuallyPage() {
  const steps = [
    {
      title: "Click 'Record Contribution'",
      description:
        "From the dashboard or contributions tab, click the 'Record Contribution' button.",
    },
    {
      title: "Select the Contributor",
      description: "Search for and select the member who made the payment.",
    },
    {
      title: "Enter the Amount & Method",
      description:
        "Input the financial amount and select the payment method (e.g., Cash, Bank Transfer).",
    },
    {
      title: "Assign to an Activity",
      description: "Select which fundraising activity this money is meant for.",
    },
    {
      title: "Submit for Review",
      description:
        "Click 'Save'. The contribution is now securely logged in your Inbox awaiting final approval.",
    },
  ];

  return (
    <DocsArticle
      title="Adding a Contribution Manually"
      description="How to record cash, bank transfers, or un-forwarded M-Pesa payments."
      difficulty="Beginner"
    >
      <p>
        While KapuLetu automates M-Pesa processing via WhatsApp, you will often need to record
        payments made in cash or via direct bank transfer. You do this by manually adding the
        contribution.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for manually adding a contribution" />

      <DocsCallout type="warning" title="Manual vs Automated">
        Manually added contributions still go to your Inbox first! They must be explicitly approved
        before they affect your balances.
      </DocsCallout>
    </DocsArticle>
  );
}
