import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsCallout } from '@/features/docs/components/DocsCallout';
import IconLibrary from '@/features/shared/components/IconLibrary';
import Link from 'next/link';

export default function ResourcesIndexPage() {
  const resources = [
    { title: "Monthly Reconciliation Checklist", desc: "A printable PDF checklist to ensure your books balance at the end of the month.", icon: "file-text" },
    { title: "Group Constitution Template", desc: "A standard MS Word template for formalizing your group's financial rules.", icon: "file" },
    { title: "New Treasurer Handover Guide", desc: "A step-by-step PDF guide for transitioning KapuLetu ownership to a new treasurer.", icon: "users" },
    { title: "Member Welcome PDF", desc: "A quick flyer to send to your group explaining how KapuLetu handles their data.", icon: "info" },
  ];

  return (
    <DocsArticle 
      title="Resources & Downloads"
      description="Helpful templates, checklists, and guides to support your treasury."
      difficulty="Beginner"
    >
      <DocsCallout type="tip">
        These resources are completely free for all KapuLetu users to download and share with their groups.
      </DocsCallout>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {resources.map((res, idx) => (
          <div key={idx} className="p-6 border border-border rounded-xl bg-card hover:border-primary/50 transition-colors flex flex-col items-start shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <IconLibrary name="download" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">{res.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 flex-1">{res.desc}</p>
            <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              Download File
            </button>
          </div>
        ))}
      </div>

    </DocsArticle>
  );
}
