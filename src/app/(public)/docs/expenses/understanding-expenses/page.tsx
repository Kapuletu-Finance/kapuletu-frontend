import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsScreenshotSequence } from '@/features/docs/components/DocsScreenshotSequence';
import { DocsCallout } from '@/features/docs/components/DocsCallout';

export default function RecordingExpensePage() {
  const steps = [
    { title: "Open Expenses", description: "Navigate to the 'Expenses' tab on your dashboard." },
    { title: "Click 'Record Expense'", description: "Click the button to open the expense creation form." },
    { title: "Enter Financial Details", description: "Input the amount spent, the date, and the payee/vendor." },
    { title: "Categorize and Attach Evidence", description: "Select the correct expense category and optionally upload a photo of the receipt." },
    { title: "Save Expense", description: "Click 'Save'. This expense will now be deducted from your Gross Collections in the financial summary." }
  ];

  return (
    <DocsArticle 
      title="Understanding & Recording Expenses"
      description="How to track money leaving your treasury."
      difficulty="Beginner"
    >
      <p>
        KapuLetu tracks both money coming in (Contributions) and money going out (Expenses). Accurately recording your expenses is crucial for generating correct net balances and treasury statements.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for recording an expense" />

      <DocsCallout type="tip" title="Receipts">
        Always attach a photo of the physical receipt or a screenshot of the payment confirmation. This makes monthly reconciliation significantly easier!
      </DocsCallout>
    </DocsArticle>
  );
}
