import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsScreenshotSequence } from '@/features/docs/components/DocsScreenshotSequence';
import { DocsCallout } from '@/features/docs/components/DocsCallout';

export default function ReconcilingAccountsPage() {
  const steps = [
    { title: "Open the Reconciliation Tool", description: "Navigate to the 'Reconciliation' tab in your dashboard menu." },
    { title: "Select the Period", description: "Choose whether you are doing an End-of-Day or Monthly reconciliation." },
    { title: "Input External Balances", description: "Look at your actual M-Pesa statement and Bank statement, and enter the closing balances." },
    { title: "Compare with KapuLetu", description: "The system will compare your inputs against the KapuLetu Ledger." },
    { title: "Resolve Discrepancies", description: "If there is a difference (Surplus or Deficit), you must locate the missing or duplicate transaction in your Inbox or Ledger." }
  ];

  return (
    <DocsArticle 
      title="Reconciling Accounts"
      description="How to ensure your KapuLetu ledger perfectly matches your real-world bank and M-Pesa statements."
      difficulty="Advanced"
    >
      <p>
        Reconciliation is the most important duty of a treasurer. It is the process of comparing the money KapuLetu <i>thinks</i> you have against the money you <i>actually</i> have in your bank or M-Pesa accounts.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for reconciling accounts" />

      <DocsCallout type="warning" title="When to Reconcile">
        We highly recommend performing a quick End-of-Day reconciliation whenever you have active fundraising, and a mandatory Monthly reconciliation to close your books.
      </DocsCallout>
    </DocsArticle>
  );
}
