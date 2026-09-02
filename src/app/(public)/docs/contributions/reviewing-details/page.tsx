import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsScreenshotSequence } from '@/features/docs/components/DocsScreenshotSequence';
import { DocsCallout } from '@/features/docs/components/DocsCallout';

export default function ReviewingDetailsPage() {
  const steps = [
    { title: "Open the Inbox", description: "Navigate to the 'Contributions' tab and click on the 'Inbox' view." },
    { title: "Select a Pending Contribution", description: "Click on any contribution in the 'Needs Review' list to open its details panel." },
    { title: "Verify the Match", description: "Check that the extracted Member Name matches the sender of the M-Pesa message." },
    { title: "Check the Target Activity", description: "Ensure the contribution is assigned to the correct fundraising activity." }
  ];

  return (
    <DocsArticle 
      title="Reviewing Contribution Details"
      description="How to inspect pending contributions in your Inbox."
      difficulty="Intermediate"
    >
      <p>
        When M-Pesa messages are forwarded to KapuLetu, the bot extracts the information and places a pending record in your Inbox. It is your job as the treasurer to review these details for accuracy before accepting the money into the ledger.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for reviewing a contribution" />

      <DocsCallout type="important" title="Unrecognized Numbers">
        If the sender's phone number doesn't match any member in your group, the contributor field will be blank. You must manually assign the member during your review!
      </DocsCallout>
    </DocsArticle>
  );
}
