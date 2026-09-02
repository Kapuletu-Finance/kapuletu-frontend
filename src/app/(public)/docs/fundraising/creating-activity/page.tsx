import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsScreenshotSequence } from '@/features/docs/components/DocsScreenshotSequence';
import { DocsCallout } from '@/features/docs/components/DocsCallout';

export default function CreatingActivityPage() {
  const steps = [
    { title: "Open Fundraising Activities", description: "Go to the 'Fundraising' tab on your dashboard menu." },
    { title: "Click 'New Activity'", description: "Select the 'New Activity' button to launch the creation wizard." },
    { title: "Define the Goal", description: "Give your activity a clear name (e.g., 'December Retreat Fund') and set an optional financial target." },
    { title: "Set Timelines", description: "Set the start and end dates for the fundraising period. Contributions outside this window will be flagged." },
    { title: "Launch Activity", description: "Click 'Launch'. Your activity is now active and ready to receive contributions." }
  ];

  return (
    <DocsArticle 
      title="Creating a Fundraising Activity"
      description="How to set up a new campaign or collection pool."
      difficulty="Beginner"
    >
      <p>
        A fundraising activity represents a specific reason or purpose for which money is being collected (e.g., Monthly Dues, Building Fund, Welfare). You must have at least one active activity to assign contributions to.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for creating a fundraising activity" />

      <DocsCallout type="tip" title="Contribution Expectations">
        If every member is expected to contribute a fixed amount, you can set a 'Per Member Expectation' during setup. This allows you to track who is in arrears later!
      </DocsCallout>
    </DocsArticle>
  );
}
