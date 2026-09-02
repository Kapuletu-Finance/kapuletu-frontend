import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsCallout } from '@/features/docs/components/DocsCallout';
import Link from 'next/link';

export default function ContributionsIndexPage() {
  const recordingGuides = [
    { title: "Adding a contribution manually", link: "/docs/contributions/adding-manually" },
    { title: "Recording M-Pesa, cash, and bank contributions", link: "/docs/contributions/recording-types" },
    { title: "Recording a pledge & partial payments", link: "/docs/contributions/recording-pledges" },
  ];

  const inboxGuides = [
    { title: "Understanding the contribution inbox", link: "/docs/contributions/inbox" },
    { title: "Opening a contribution & Reviewing details", link: "/docs/contributions/reviewing-details" },
    { title: "Checking contributor information", link: "/docs/contributions/checking-contributor" },
    { title: "Correcting information (Editing amount, changing activity)", link: "/docs/contributions/correcting-info" },
    { title: "Splitting contributions", link: "/docs/contributions/splitting-contributions" },
  ];

  const approvalGuides = [
    { title: "Approving a contribution", link: "/docs/contributions/approving" },
    { title: "Bulk approval & Bulk rejection", link: "/docs/contributions/bulk-approval" },
    { title: "Where approved contributions go", link: "/docs/contributions/after-approval" },
    { title: "Understanding the ledger", link: "/docs/contributions/understanding-ledger" },
  ];

  return (
    <DocsArticle 
      title="Contributions & Inbox"
      description="Record, review, and approve incoming money into your treasury."
      difficulty="Intermediate"
    >
      <DocsCallout type="warning" title="Important">
        Remember that contributions must be explicitly approved from your Inbox before they appear in your reports or overall balance.
      </DocsCallout>

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2">Recording</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {recordingGuides.map((guide, idx) => (
          <Link key={idx} href={guide.link} className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2">Reviewing (The Inbox)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {inboxGuides.map((guide, idx) => (
          <Link key={idx} href={guide.link} className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2">Approving</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {approvalGuides.map((guide, idx) => (
          <Link key={idx} href={guide.link} className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>
    </DocsArticle>
  );
}
