import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsScreenshotSequence } from '@/features/docs/components/DocsScreenshotSequence';
import { DocsFeedback } from '@/features/docs/components/DocsFeedback';
import Link from 'next/link';

export default function WorkspacePage() {
  const workspaceSteps = [
    {
      title: "Dashboard",
      description: "Your financial overview. See total collections, recent activity, and quick stats for your selected group."
    },
    {
      title: "Groups Navigation",
      description: "Switch between different communities or organizations you serve using the sidebar or header switcher."
    },
    {
      title: "Activities & Campaigns",
      description: "Manage specific fundraising targets. This shows progress towards your current goals."
    },
    {
      title: "Contributions Inbox",
      description: "Review, approve, and manage incoming contributions before they are added to the official ledger."
    }
  ];

  return (
    <DocsArticle 
      title="Understanding the Workspace"
      description="A quick tour of the KapuLetu interface and where to find key treasury tools."
      difficulty="Beginner"
      estimatedTime="3 min"
    >
      
      <p>
        The KapuLetu workspace is designed around the natural workflow of a treasurer. Instead of hunting through menus, 
        everything is organized into a logical flow from left to right, top to bottom.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">The Interface Layout</h2>
      
      <p>Click through the steps below to explore the main areas of your dashboard:</p>
      
      <DocsScreenshotSequence steps={workspaceSteps} alt="KapuLetu Workspace Layout Overview" />

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">Navigation Map</h2>
      <p>
        Here is how the core tools relate to each other:
      </p>

      <div className="bg-muted/30 p-8 rounded-lg border border-border my-6 overflow-x-auto text-center font-mono text-sm">
        <pre className="text-muted-foreground">
{`                  DASHBOARD
                      │
       ┌──────────────┼──────────────┐
       │              │              │
     Groups       Activities     Contributions
       │              │              │
       └──────────────┼──────────────┘
                      │
                  Treasury
                      │
          ┌───────────┼───────────┐
          │           │           │
        Reports     Expenses     Ledger`}
        </pre>
      </div>

      <div className="mt-12 p-6 border border-primary/20 bg-primary/5 rounded-xl flex flex-col items-center text-center">
        <h3 className="text-xl font-bold mb-2">Ready to set things up?</h3>
        <p className="text-muted-foreground mb-6">Now that you know your way around, let's complete your first treasury workflow.</p>
        <Link 
          href="/docs/getting-started/first-30-minutes"
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Next: Your First 30 Minutes &rarr;
        </Link>
      </div>

      <DocsFeedback />
    </DocsArticle>
  );
}
