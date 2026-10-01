import type { Metadata } from "next";
import Link from "next/link";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsFeedback } from "@/features/docs/components/DocsFeedback";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export const metadata: Metadata = {
  title: "Understanding the Workspace | KapuLetu Docs",
  description: "A quick tour of the KapuLetu interface and where to find key treasury tools.",
  openGraph: {
    title: "Understanding the Workspace | KapuLetu Docs",
    description: "A quick tour of the KapuLetu interface and where to find key treasury tools.",
  },
  twitter: {
    title: "Understanding the Workspace | KapuLetu Docs",
    description: "A quick tour of the KapuLetu interface and where to find key treasury tools.",
  },
};

export default function WorkspacePage() {
  const workspaceSteps = [
    {
      title: "Dashboard",
      description:
        "Your financial overview. See total collections, recent activity, and quick stats for your selected group.",
      image: "/docs/getting-started/workspace-dashboard.png",
    },
    {
      title: "Groups Navigation",
      description:
        "Switch between different communities or organizations you serve using the sidebar or header switcher.",
      image: "/docs/getting-started/workspace-groups.png",
    },
    {
      title: "Contributions Inbox",
      description:
        "Review, approve, and manage incoming contributions before they are added to the official ledger.",
      image: "/docs/getting-started/workspace-inbox.png",
    },
    {
      title: "Notifications",
      description:
        "Stay updated on recent approvals, system alerts, and group activities directly from the sidebar.",
      image: "/docs/getting-started/workspace-notifications.png",
    },
    {
      title: "Help Center",
      description:
        "Access support tickets, read knowledge base articles, and contact the KapuLetu support team.",
      image: "/docs/getting-started/workspace-help-center.png",
    },
    {
      title: "Settings",
      description:
        "Configure your profile, update security preferences, and manage your account details.",
      image: "/docs/getting-started/workspace-settings.png",
    },
    {
      title: "Appearance (Dark / Light Mode)",
      description:
        "Switch between Light and Dark mode to suit your preferences. You can toggle this effortlessly from your profile menu or at the bottom of the navigation sidebar.",
      image: "/docs/getting-started/workspace-appearance.png",
    },
  ];

  return (
    <DocsArticle
      title="Understanding the Workspace"
      description="A quick tour of the KapuLetu interface and where to find key treasury tools."
      difficulty="Beginner"
      estimatedTime="3 min"
    >
      <p>
        The KapuLetu workspace is designed around the natural workflow of a treasurer. Instead of
        hunting through menus, everything is organized into a logical flow from left to right, top
        to bottom.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">
        The Interface Layout
      </h2>

      <p>Click through the steps below to explore the main areas of your dashboard:</p>

      <DocsScreenshotSequence steps={workspaceSteps} alt="KapuLetu Workspace Layout Overview" />

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">Navigation Map</h2>
      <p className="mb-6">Here is how the core tools are organized in your workspace sidebar:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border border-primary/20 bg-card rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-primary/5 px-5 py-3 border-b border-primary/10">
            <h4 className="font-bold text-primary text-sm uppercase tracking-wider">
              Core Treasury
            </h4>
          </div>
          <div className="p-5 flex flex-col gap-2 flex-1">
            <Link
              href="/docs/dashboard"
              className="flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-all group"
            >
              <span className="font-medium text-foreground min-w-[100px] group-hover:text-primary transition-colors">
                Dashboard
              </span>
              <span className="text-sm text-muted-foreground flex-1">
                Your primary financial overview
              </span>
              <span className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                &rarr;
              </span>
            </Link>
            <Link
              href="/docs/groups"
              className="flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-all group"
            >
              <span className="font-medium text-foreground min-w-[100px] group-hover:text-primary transition-colors">
                Groups
              </span>
              <span className="text-sm text-muted-foreground flex-1">
                Manage communities and campaigns
              </span>
              <span className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                &rarr;
              </span>
            </Link>
            <Link
              href="/docs/contributions"
              className="flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-all group"
            >
              <span className="font-medium text-foreground min-w-[100px] group-hover:text-primary transition-colors">
                Inbox
              </span>
              <span className="text-sm text-muted-foreground flex-1">
                Process incoming unverified contributions
              </span>
              <span className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                &rarr;
              </span>
            </Link>
          </div>
        </div>

        <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-muted px-5 py-3 border-b border-border">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">
              Account & Utilities
            </h4>
          </div>
          <div className="p-5 flex flex-col gap-2 flex-1">
            <Link
              href="/docs/getting-started/workspace#notifications"
              className="flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-all group"
            >
              <span className="font-medium text-foreground min-w-[100px] group-hover:text-foreground transition-colors">
                Notifications
              </span>
              <span className="text-sm text-muted-foreground flex-1">
                System alerts and activity updates
              </span>
              <span className="text-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                &rarr;
              </span>
            </Link>
            <Link
              href="/docs/faq"
              className="flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-all group"
            >
              <span className="font-medium text-foreground min-w-[100px] group-hover:text-foreground transition-colors">
                Help Center
              </span>
              <span className="text-sm text-muted-foreground flex-1">
                Support tickets and documentation
              </span>
              <span className="text-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                &rarr;
              </span>
            </Link>
            <Link
              href="/docs/security"
              className="flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-all group"
            >
              <span className="font-medium text-foreground min-w-[100px] group-hover:text-foreground transition-colors">
                Settings
              </span>
              <span className="text-sm text-muted-foreground flex-1">
                Profile, security, and preferences
              </span>
              <span className="text-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 border border-primary/20 bg-primary/5 rounded-xl flex flex-col items-center text-center">
        <h3 className="text-xl font-bold mb-2">Ready to set things up?</h3>
        <p className="text-muted-foreground mb-6">
          Now that you know your way around, let's complete your first treasury workflow.
        </p>
        <Link
          href="/docs/getting-started/first-5-minutes"
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Next: Your First 5 Minutes &rarr;
        </Link>
      </div>

      <DocsFeedback />
    </DocsArticle>
  );
}
