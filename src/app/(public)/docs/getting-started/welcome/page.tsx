import Link from "next/link";
import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsFeedback } from "@/features/docs/components/DocsFeedback";
import { DocsVideo } from "@/features/docs/components/DocsVideo";

export default function WelcomePage() {
  return (
    <DocsArticle
      title="Welcome to KapuLetu"
      description="Everything you need to know to get started with your new treasury workspace."
      difficulty="Beginner"
      estimatedTime="5 min"
    >
      <p>
        KapuLetu is a secure group finance platform designed specifically for treasurers and
        fundraising committees. It replaces manual spreadsheets, confusing WhatsApp groups, and
        messy record-keeping by providing a single, transparent ledger for all your group's money.
      </p>

      <DocsVideo title="Introduction to KapuLetu" duration="2:15" />

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">
        What problem does KapuLetu solve?
      </h2>
      <p>
        Managing group money is hard. As a treasurer, you are often expected to track M-Pesa
        messages, cash payments, and bank transfers simultaneously. This leads to:
      </p>
      <ul className="list-disc pl-6 space-y-2 mt-4 mb-6">
        <li>Lost records and forgotten contributions</li>
        <li>Difficulty proving exactly who sent what</li>
        <li>Time-consuming manual reporting</li>
        <li>Loss of trust among group members</li>
      </ul>
      <p>
        KapuLetu solves this by automating the recording process (especially with our WhatsApp
        integration) and providing instant, professional reporting.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">
        Core Terminology
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 border border-border rounded-lg bg-card">
          <h4 className="font-bold text-foreground mb-1">Group</h4>
          <p className="text-sm text-muted-foreground">
            The community, organization, or family you are managing funds for.
          </p>
        </div>
        <div className="p-4 border border-border rounded-lg bg-card">
          <h4 className="font-bold text-foreground mb-1">Fundraising Activity</h4>
          <p className="text-sm text-muted-foreground">
            A specific campaign or reason you are collecting money (e.g., "Wedding Committee").
          </p>
        </div>
        <div className="p-4 border border-border rounded-lg bg-card">
          <h4 className="font-bold text-foreground mb-1">Inbox</h4>
          <p className="text-sm text-muted-foreground">
            Where new, unverified contributions wait for your review and approval.
          </p>
        </div>
        <div className="p-4 border border-border rounded-lg bg-card">
          <h4 className="font-bold text-foreground mb-1">Ledger</h4>
          <p className="text-sm text-muted-foreground">
            The official, permanent record of approved contributions.
          </p>
        </div>
      </div>

      <div className="mt-12 p-6 border border-primary/20 bg-primary/5 rounded-xl flex flex-col items-center text-center">
        <h3 className="text-xl font-bold mb-2">Ready to start?</h3>
        <p className="text-muted-foreground mb-6">
          Continue to the next guide to learn your way around the workspace.
        </p>
        <Link
          href="/docs/getting-started/workspace"
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Next: Understanding the Workspace &rarr;
        </Link>
      </div>

      <DocsFeedback />
    </DocsArticle>
  );
}
