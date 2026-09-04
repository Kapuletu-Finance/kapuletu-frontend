import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export default function ApprovingContributionPage() {
  const steps = [
    {
      title: "Review the Details",
      description: "Ensure the member, amount, and assigned activity are 100% correct.",
    },
    {
      title: "Click 'Approve'",
      description: "Click the green 'Approve' button at the bottom of the details panel.",
    },
    {
      title: "Confirm Action",
      description: "If prompted, confirm that you want to move this money to the permanent ledger.",
    },
    {
      title: "Check the Ledger",
      description:
        "The contribution will disappear from the Inbox and now appear in your Ledger and Reports.",
    },
  ];

  return (
    <DocsArticle
      title="Approving a Contribution"
      description="How to finalize a contribution and commit it to the ledger."
      difficulty="Beginner"
    >
      <p>
        Approving a contribution is the final step in the collection lifecycle. By clicking approve,
        you are officially acknowledging receipt of the funds and locking the record into your
        group's financial history.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for approving a contribution" />

      <DocsCallout type="warning" title="Approval is Permanent">
        Once a contribution is approved, it is moved to the Ledger. While you can still edit it
        later with Admin privileges, all post-approval edits are permanently tracked in the audit
        log.
      </DocsCallout>
    </DocsArticle>
  );
}
