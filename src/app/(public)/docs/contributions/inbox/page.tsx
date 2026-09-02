import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsScreenshotSequence } from '@/features/docs/components/DocsScreenshotSequence';
import { DocsFeedback } from '@/features/docs/components/DocsFeedback';

export default function InboxGuidePage() {
  const inboxSteps = [
    {
      title: "Open the Inbox",
      description: "Navigate to Contributions in the sidebar, and click on the 'Inbox' tab. This shows all unverified transactions."
    },
    {
      title: "Select a Pending Contribution",
      description: "Click on any pending M-Pesa or Cash entry to open the review panel on the right side."
    },
    {
      title: "Verify Extracted Details",
      description: "Check that the sender's phone number, name, and amount match your expectations. Edit if necessary."
    },
    {
      title: "Assign the Activity",
      description: "Select which Fundraising Activity (e.g., 'Welfare Fund') this money belongs to from the dropdown."
    },
    {
      title: "Approve",
      description: "Click the green 'Approve' button. The contribution is now locked into the ledger and will appear on reports."
    }
  ];

  return (
    <DocsArticle 
      title="Understanding the Contribution Inbox"
      description="How to review, correct, and verify incoming money before it hits the ledger."
      difficulty="Beginner"
      estimatedTime="3 min"
    >
      <p>
        The Inbox is your staging area. When WhatsApp forwards an M-Pesa message, or when an Assistant Treasurer adds a manual cash record, it lands here first. It is your responsibility to verify its accuracy.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">The Review Workflow</h2>
      
      <DocsScreenshotSequence steps={inboxSteps} alt="Reviewing a contribution in the inbox" />

      <h3 className="text-xl font-bold mt-8 mb-3">Common Inbox Issues</h3>
      
      <div className="space-y-4 my-6">
        <div className="border border-border p-4 rounded-lg bg-card">
          <h4 className="font-semibold text-foreground mb-1">Masked Phone Numbers</h4>
          <p className="text-sm text-muted-foreground">If a number is masked (e.g., +254712***789), you will need to manually link it to a member from the dropdown during review.</p>
        </div>
        <div className="border border-border p-4 rounded-lg bg-card">
          <h4 className="font-semibold text-foreground mb-1">Duplicate Transactions</h4>
          <p className="text-sm text-muted-foreground">If two members forwarded the same M-Pesa message, KapuLetu will flag it in the Inbox. You should reject the duplicate.</p>
        </div>
      </div>

      <DocsFeedback />
    </DocsArticle>
  );
}
