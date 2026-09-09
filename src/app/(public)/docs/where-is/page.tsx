import Link from "next/link";
import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsFeedback } from "@/features/docs/components/DocsFeedback";

export default function WhereIsPage() {
  const references = [
    { action: "Add a new member", location: "Groups → Members → Add Member", link: "/docs/groups" },
    {
      action: "Record a manual contribution",
      location: "Contributions → Add Contribution",
      link: "/docs/contributions",
    },
    {
      action: "Review a pending M-Pesa message",
      location: "Contributions → Inbox",
      link: "/docs/contributions",
    },
    {
      action: "Create a new fundraising goal",
      location: "Fundraising → Create Activity",
      link: "/docs/fundraising",
    },
    { action: "See total collected today", location: "Dashboard", link: "/docs/dashboard" },
    { action: "Generate a weekly report", location: "Reports → New Report", link: "/docs/reports" },
    {
      action: "Reconcile my M-Pesa balance",
      location: "Reconciliation",
      link: "/docs/reconciliation",
    },
    { action: "Change my password", location: "Settings → Security", link: "/docs/security" },
    {
      action: "Turn on WhatsApp forwarding",
      location: "Settings → WhatsApp",
      link: "/docs/whatsapp",
    },
  ];

  return (
    <DocsArticle
      title="Where do I find...?"
      description="A quick reference guide to finding exactly what you need in the KapuLetu workspace."
      difficulty="Beginner"
      estimatedTime="2 min"
    >
      <p>Use this reference table to quickly locate features within your treasury dashboard.</p>

      <div className="overflow-x-auto my-8 border border-border rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">I want to...</th>
              <th className="px-6 py-4 font-medium">Go here</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {references.map((ref, idx) => (
              <tr key={idx} className="bg-card hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{ref.action}</td>
                <td className="px-6 py-4">
                  <Link href={ref.link} className="text-primary hover:underline font-medium">
                    {ref.location}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DocsCallout type="info" title="Need more details?">
        Click on any of the locations above to read the full step-by-step guide on how to complete
        the action.
      </DocsCallout>

      <DocsFeedback />
    </DocsArticle>
  );
}
