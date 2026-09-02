import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsCallout } from '@/features/docs/components/DocsCallout';
import { DocsFeedback } from '@/features/docs/components/DocsFeedback';
import Link from 'next/link';
import IconLibrary from '@/features/shared/components/IconLibrary';

export default function DocsPage() {
  return (
    <DocsArticle 
      title="How can we help you?"
      description="Welcome to the KapuLetu Learning Centre. Search for a topic or browse our popular guides below."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 mb-12">
        <Link href="/docs/getting-started/welcome" className="group p-6 border border-border bg-card hover:bg-muted/30 rounded-xl transition-colors shadow-sm">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors flex items-center gap-2"><IconLibrary name="info" className="w-5 h-5 text-primary" /> I'm new to KapuLetu</h3>
          <p className="text-sm text-muted-foreground">Learn how KapuLetu works and get started.</p>
        </Link>
        <Link href="/docs/contributions" className="group p-6 border border-border bg-card hover:bg-muted/30 rounded-xl transition-colors shadow-sm">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors flex items-center gap-2"><IconLibrary name="contribution" className="w-5 h-5 text-primary" /> Record a contribution</h3>
          <p className="text-sm text-muted-foreground">Learn how to add and approve contributions.</p>
        </Link>
        <Link href="/docs/whatsapp" className="group p-6 border border-border bg-card hover:bg-muted/30 rounded-xl transition-colors shadow-sm">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors flex items-center gap-2"><IconLibrary name="smartphone" className="w-5 h-5 text-primary" /> I want to use WhatsApp</h3>
          <p className="text-sm text-muted-foreground">Learn how to send and process contribution messages.</p>
        </Link>
        <Link href="/docs/reports" className="group p-6 border border-border bg-card hover:bg-muted/30 rounded-xl transition-colors shadow-sm">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors flex items-center gap-2"><IconLibrary name="analytics" className="w-5 h-5 text-primary" /> Generate a report</h3>
          <p className="text-sm text-muted-foreground">Learn how to create and share treasury reports.</p>
        </Link>
        <Link href="/docs/groups" className="group p-6 border border-border bg-card hover:bg-muted/30 rounded-xl transition-colors shadow-sm">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors flex items-center gap-2"><IconLibrary name="users" className="w-5 h-5 text-primary" /> Manage my group</h3>
          <p className="text-sm text-muted-foreground">Members, assistants, permissions and settings.</p>
        </Link>
        <Link href="/docs/reconciliation" className="group p-6 border border-border bg-card hover:bg-muted/30 rounded-xl transition-colors shadow-sm">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors flex items-center gap-2"><IconLibrary name="inbox" className="w-5 h-5 text-primary" /> Reconcile my funds</h3>
          <p className="text-sm text-muted-foreground">Compare M-Pesa, cash, bank and ledger records.</p>
        </Link>
      </div>

      <DocsCallout type="tip" title="Looking for something specific?">
        Try using the search bar at the top or browse our <Link href="/docs/where-is" className="text-primary font-medium hover:underline">"Where do I find...?"</Link> reference guide.
      </DocsCallout>

      <DocsFeedback />
    </DocsArticle>
  );
}
