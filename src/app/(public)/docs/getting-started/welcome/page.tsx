import type { Metadata } from "next";
import Link from "next/link";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsFeedback } from "@/features/docs/components/DocsFeedback";
import { DocsVideo } from "@/features/docs/components/DocsVideo";

export const metadata: Metadata = {
  title: "Welcome to KapuLetu",
  description: "Everything you need to know to get started with your new treasury workspace.",
  openGraph: {
    title: "Welcome to KapuLetu",
    description: "Everything you need to know to get started with your new treasury workspace.",
  },
  twitter: {
    title: "Welcome to KapuLetu",
    description: "Everything you need to know to get started with your new treasury workspace.",
  },
};

export default function WelcomePage() {
  return (
    <DocsArticle
      title="Welcome to KapuLetu"
      description="Everything you need to know to get started with your new treasury workspace."
      difficulty="Beginner"
      estimatedTime="5 min"
    >
      <p>
        KapuLetu is a secure, intelligent treasury assistant designed to eliminate the chaos of
        scattered payment messages, manual spreadsheets, and weekend reconciliations for community
        finance groups. Managing welfare and community funds shouldn't require a second full-time
        job; we help you lead with transparency, accountability, and total peace of mind.
      </p>

      <DocsVideo title="Introduction to KapuLetu" duration="2:15" />

      <div className="mt-10 mb-10 p-6 bg-primary/5 border border-primary/20 rounded-xl">
        <p className="font-bold text-lg mb-4 text-foreground">
          KapuLetu transforms community finance management:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-medium text-sm">
          <div className="flex items-center gap-2 p-3 bg-background border border-border rounded-md">
            <span className="text-muted-foreground line-through">Manual</span> &rarr;{" "}
            <span className="text-primary font-bold">Structured</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-background border border-border rounded-md">
            <span className="text-muted-foreground line-through">Stressful</span> &rarr;{" "}
            <span className="text-primary font-bold">Assisted</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-background border border-border rounded-md">
            <span className="text-muted-foreground line-through">Uncertain</span> &rarr;{" "}
            <span className="text-primary font-bold">Auditable</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-background border border-border rounded-md">
            <span className="text-muted-foreground line-through">Fragmented</span> &rarr;{" "}
            <span className="text-primary font-bold">Centralized</span>
          </div>
        </div>
        <p className="font-bold text-primary mt-5 text-center">
          We embed trust directly into the system.
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">
        The Transformation
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-10">
        <div className="p-5 border border-destructive/20 rounded-lg bg-destructive/5">
          <h4 className="font-bold text-foreground mb-3 border-b border-destructive/20 pb-2">
            The Old Way
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
            <li>Fragmented SMS and WhatsApp payment messages.</li>
            <li>Manual data entry into error-prone spreadsheets.</li>
            <li>Disputed cash records and unverified contributions.</li>
            <li>Time-consuming, late-night reporting fatigue.</li>
          </ul>
        </div>
        <div className="p-5 border border-primary/20 rounded-lg bg-primary/5">
          <h4 className="font-bold text-foreground mb-3 border-b border-primary/20 pb-2">
            The KapuLetu Way
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
            <li>Centralized smart inbox for all financial evidence.</li>
            <li>Automated transaction parsing and structuring.</li>
            <li>Immutable, transparent ledgers ensuring financial integrity.</li>
            <li>Instant, one-click report generation.</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">
        Core Capabilities
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-10">
        <Link
          href="/docs/contributions"
          className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
        >
          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            Smart Capture{" "}
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </h4>
          <p className="text-sm text-muted-foreground leading-snug">
            Extract details automatically from forwarded M-Pesa and SMS messages.
          </p>
        </Link>
        <Link
          href="/docs/whatsapp"
          className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
        >
          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            WhatsApp AI{" "}
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </h4>
          <p className="text-sm text-muted-foreground leading-snug">
            Manage your entire treasury workflow seamlessly through our intelligent chatbot.
          </p>
        </Link>
        <Link
          href="/docs/contributions"
          className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
        >
          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            Review Inbox{" "}
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </h4>
          <p className="text-sm text-muted-foreground leading-snug">
            Verify every incoming payment before it enters the official group records.
          </p>
        </Link>
        <Link
          href="/docs/getting-started/workspace"
          className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
        >
          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            Consistent Records{" "}
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </h4>
          <p className="text-sm text-muted-foreground leading-snug">
            Maintain permanent, tamper-proof ledgers for complete financial transparency.
          </p>
        </Link>
        <Link
          href="/docs/contributions"
          className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
        >
          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            Split Payments{" "}
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </h4>
          <p className="text-sm text-muted-foreground leading-snug">
            Allocate a single lump-sum contribution into multiple distinct allocations effortlessly.
          </p>
        </Link>
        <Link
          href="/docs/campaigns"
          className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
        >
          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            Campaign Tracking{" "}
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </h4>
          <p className="text-sm text-muted-foreground leading-snug">
            Set targets and monitor progress for specific fundraising goals.
          </p>
        </Link>
        <Link
          href="/docs/campaigns"
          className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
        >
          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            Public Links{" "}
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </h4>
          <p className="text-sm text-muted-foreground leading-snug">
            Share a live, read-only page for members to track campaign progress online.
          </p>
        </Link>
        <Link
          href="/docs/reports"
          className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
        >
          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            Versatile Reports{" "}
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </h4>
          <p className="text-sm text-muted-foreground leading-snug">
            Export data instantly as PDF statements, WhatsApp-ready text, or Excel files.
          </p>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">
        Core Terminology
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Link
          href="/docs/groups"
          className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
        >
          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            Group{" "}
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </h4>
          <p className="text-sm text-muted-foreground">
            The community, organization, or family you are managing funds for.
          </p>
        </Link>

        <Link
          href="/docs/campaigns"
          className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
        >
          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            Campaign{" "}
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </h4>
          <p className="text-sm text-muted-foreground">
            A specific fundraising activity or financial goal.
          </p>
        </Link>
        <Link
          href="/docs/contributions"
          className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
        >
          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            Inbox{" "}
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </h4>
          <p className="text-sm text-muted-foreground">
            The holding area for unverified transactions awaiting your approval.
          </p>
        </Link>
        <Link
          href="/docs/getting-started/workspace"
          className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
        >
          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            Ledger{" "}
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </h4>
          <p className="text-sm text-muted-foreground">
            The official, permanent, and auditable record of all approved finances.
          </p>
        </Link>
        <Link
          href="/docs/reconciliation"
          className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors group"
        >
          <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            Reconciliation{" "}
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </h4>
          <p className="text-sm text-muted-foreground">
            The process of matching app records against your actual bank or M-Pesa balances.
          </p>
        </Link>
      </div>

      <div className="mt-12 p-6 border border-primary/20 bg-primary/5 rounded-xl flex flex-col items-center text-center">
        <h3 className="text-xl font-bold mb-2">Ready to start?</h3>
        <p className="text-muted-foreground mb-6">
          Continue to the next guide to learn how to securely set up your account.
        </p>
        <Link
          href="/docs/getting-started/account-setup"
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Next: Account Setup &rarr;
        </Link>
      </div>

      <DocsFeedback />
    </DocsArticle>
  );
}
