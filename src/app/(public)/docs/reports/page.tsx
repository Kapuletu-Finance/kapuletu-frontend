import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsCallout } from '@/features/docs/components/DocsCallout';
import { DocsScreenshotSequence } from '@/features/docs/components/DocsScreenshotSequence';
import Link from 'next/link';

export default function ReportsIndexPage() {
  const reportTypes = [
    { title: "Daily, Weekly, and Monthly Reports", link: "/docs/reports/time-based" },
    { title: "Fundraising Activity Report", link: "/docs/reports/activity-report" },
    { title: "Group & Contribution Reports", link: "/docs/reports/group-reports" },
    { title: "Expense & Treasury Statements", link: "/docs/reports/statements" },
    { title: "Reconciliation Report & Financial Summary", link: "/docs/reports/financial-summary" },
  ];

  const sharingGuides = [
    { title: "Downloading PDF Reports", link: "/docs/reports/downloading-pdfs" },
    { title: "WhatsApp-ready Reports", link: "/docs/reports/whatsapp-reports" },
    { title: "Sharing & Printing", link: "/docs/reports/sharing" },
    { title: "Customizing Date Ranges", link: "/docs/reports/customizing-dates" },
  ];

  const reportSteps = [
    { title: "Navigate to Reports", description: "Select the Reports module from the main sidebar." },
    { title: "Select Report Type", description: "Choose the type of report you want to generate (e.g., Daily Summary)." },
    { title: "Set Date Range", description: "Use the calendar picker to select your desired date range." },
    { title: "Generate & Export", description: "Click Generate, then choose whether to download as PDF or share directly." }
  ];

  return (
    <DocsArticle 
      title="Reports & Analytics"
      description="Learn how to generate, understand, and share professional treasury reports."
      difficulty="Beginner"
    >
      <DocsCallout type="tip" title="Automatic Formatting">
        KapuLetu automatically formats reports to look great on both A4 PDFs and standard WhatsApp messages.
      </DocsCallout>

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2">Generating a Report</h2>
      <DocsScreenshotSequence steps={reportSteps} alt="Generating a report workflow" />

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2">Report Types</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {reportTypes.map((guide, idx) => (
          <Link key={idx} href={guide.link} className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2">Sharing & Customizing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {sharingGuides.map((guide, idx) => (
          <Link key={idx} href={guide.link} className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>
    </DocsArticle>
  );
}
