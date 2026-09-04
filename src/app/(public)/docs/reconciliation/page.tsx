import Link from "next/link";
import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export default function ReconciliationIndexPage() {
  const guides = [
    {
      title: "What is reconciliation? & When should I reconcile?",
      link: "/docs/reconciliation/what-is-reconciliation",
    },
    { title: "Preparing for reconciliation", link: "/docs/reconciliation/preparing" },
    {
      title: "Reconciling M-Pesa, cash, and bank",
      link: "/docs/reconciliation/reconciling-accounts",
    },
    {
      title: "Identifying discrepancies & Handling missing/duplicate transactions",
      link: "/docs/reconciliation/identifying-discrepancies",
    },
    { title: "Handling incorrect amounts", link: "/docs/reconciliation/incorrect-amounts" },
    {
      title: "Reconciliation checklist (End-of-day, Monthly)",
      link: "/docs/reconciliation/checklist",
    },
  ];

  const steps = [
    {
      title: "Gather Records",
      description: "Collect your M-Pesa statement, bank statement, and physical cash counts.",
    },
    {
      title: "Compare with Ledger",
      description: "Open KapuLetu Reconciliation view and compare against your external records.",
    },
    {
      title: "Identify Differences",
      description: "Spot missing transactions or mismatched amounts.",
    },
    {
      title: "Investigate & Correct",
      description: "Fix the ledger by adding missing items or correcting errors.",
    },
  ];

  return (
    <DocsArticle
      title="Reconciliation"
      description="Ensure your KapuLetu ledger perfectly matches your real-world bank and M-Pesa accounts."
      difficulty="Advanced"
    >
      <DocsCallout type="tip" title="Best Practice">
        We recommend performing reconciliation at least once a month, or at the end of every active
        fundraising day.
      </DocsCallout>

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2">
        The Reconciliation Process
      </h2>
      <DocsScreenshotSequence steps={steps} alt="Reconciliation process flow" />

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2">
        Reconciliation Guides
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {guides.map((guide, idx) => (
          <Link
            key={idx}
            href={guide.link}
            className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors shadow-sm"
          >
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>
    </DocsArticle>
  );
}
