import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsCallout } from '@/features/docs/components/DocsCallout';
import Link from 'next/link';

export default function GlossaryIndexPage() {
  const terms = [
    { term: "Group", definition: "The community, organization, or family you are managing funds for." },
    { term: "Fundraising Activity", definition: "A specific fundraising purpose or campaign (e.g., 'December Welfare')." },
    { term: "Contribution", definition: "Money received by the group from a member or external party." },
    { term: "Pledge", definition: "A promised contribution that has not yet been paid." },
    { term: "Ledger", definition: "The official, immutable financial record of all approved transactions." },
    { term: "Inbox", definition: "A staging area for contributions and messages awaiting your review and approval." },
    { term: "Reconciliation", definition: "The process of comparing KapuLetu records with M-Pesa or bank statements to verify accuracy." },
    { term: "Approval", definition: "Your confirmation that a transaction in the Inbox is valid and ready to be committed to the Ledger." },
  ];

  return (
    <DocsArticle 
      title="KapuLetu Glossary"
      description="Definitions for the core terminology used throughout KapuLetu."
      difficulty="Beginner"
    >
      <DocsCallout type="tip">
        Understanding these terms will make it much easier to use KapuLetu's advanced treasury features.
      </DocsCallout>

      <div className="overflow-x-auto my-8 border border-border rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium w-1/3">Term</th>
              <th className="px-6 py-4 font-medium">Meaning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {terms.map((item, idx) => (
              <tr key={idx} className="bg-card hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 font-bold text-foreground">{item.term}</td>
                <td className="px-6 py-4 text-muted-foreground">{item.definition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </DocsArticle>
  );
}
