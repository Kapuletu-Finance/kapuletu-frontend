import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsScreenshotSequence } from '@/features/docs/components/DocsScreenshotSequence';
import { DocsCallout } from '@/features/docs/components/DocsCallout';

export default function TimeBasedReportsPage() {
  const steps = [
    { title: "Open Reports", description: "Navigate to the 'Reports & Analytics' tab." },
    { title: "Select Report Type", description: "Choose 'Daily', 'Weekly', or 'Monthly' Treasury Report from the templates." },
    { title: "Set the Date Range", description: "Select the specific day, week, or month you want to generate the report for." },
    { title: "Generate Report", description: "Click 'Generate'. KapuLetu will compile all approved contributions and expenses for that period." }
  ];

  return (
    <DocsArticle 
      title="Generating Time-Based Reports"
      description="How to generate daily, weekly, or monthly financial summaries."
      difficulty="Beginner"
    >
      <p>
        Time-based reports give you a snapshot of all financial activity within a specific window. These are perfect for presenting at group meetings or sharing in your WhatsApp group at the end of the week.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for generating time-based reports" />

      <DocsCallout type="important" title="Unapproved Contributions">
        Reports ONLY calculate contributions that have been explicitly Approved from your Inbox. Pending contributions will not appear in the final report!
      </DocsCallout>
    </DocsArticle>
  );
}
