import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsCallout } from '@/features/docs/components/DocsCallout';
import { DocsFeedback } from '@/features/docs/components/DocsFeedback';
import Link from 'next/link';

export default function ContributionFlowPage() {
  return (
    <DocsArticle 
      title="How Contributions Flow"
      description="Understand the lifecycle of a KapuLetu contribution from receipt to the final ledger."
      difficulty="Beginner"
      estimatedTime="4 min"
    >
      
      <p>
        The most important concept to understand in KapuLetu is the <strong>Contribution Lifecycle</strong>. 
        Unlike traditional accounting software where you type a number and it instantly appears on a balance sheet, 
        KapuLetu uses an "Inbox & Approval" model to ensure 100% accuracy and trust.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">The Lifecycle</h2>
      
      <div className="bg-muted/30 p-8 rounded-lg border border-border my-8 overflow-x-auto text-center font-mono text-sm leading-loose">
        <pre className="text-muted-foreground">
{`    1. Received (Via WhatsApp or Manual Entry)
           ↓
    2. Detected & Parsed (KapuLetu AI)
           ↓
    3. Inbox (Awaiting Review)
           ↓
    4. Reviewed (By Treasurer)
           ↓
    5. Assigned (To a Fundraising Activity)
           ↓
    6. Approved (Locked in)
           ↓
    7. Ledger (Official Record)
           ↓
    8. Reports (Visible to group)`}
        </pre>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-3">Why the Inbox matters</h3>
      <p className="mb-4">
        When an M-Pesa message is forwarded to KapuLetu, the system automatically detects the amount, the sender's phone number, 
        and the transaction code. However, it places this transaction in your <strong>Inbox</strong> rather than directly into your total balance.
      </p>
      
      <DocsCallout type="info" title="The Golden Rule of the Inbox">
        Money in the Inbox is considered "Pending". It will not appear in your Dashboard totals, and it will not appear on your PDF reports until you explicitly click <strong>Approve</strong>.
      </DocsCallout>

      <h3 className="text-xl font-bold mt-8 mb-3">The Approval Process</h3>
      <p className="mb-4">
        As a treasurer, your job is to look at the Inbox, verify that the system correctly parsed the message, ensure the money is assigned to the correct Fundraising Activity (e.g., "December Welfare" vs "Jane's Wedding"), and then Approve it.
      </p>

      <p className="mb-4">
        Once approved, the contribution is permanently written to the <strong>Ledger</strong>. It cannot be silently deleted. If a mistake was made, it must be officially edited, which leaves an audit trail. This is how KapuLetu builds financial trust within your group.
      </p>

      <div className="mt-12 flex justify-between items-center border-t border-border pt-6">
        <Link href="/docs/conceptual" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          &larr; Back to Conceptual Guides
        </Link>
        <Link href="/docs/whatsapp" className="text-sm font-medium text-primary hover:underline">
          Next: How WhatsApp integration works &rarr;
        </Link>
      </div>

      <DocsFeedback />
    </DocsArticle>
  );
}
