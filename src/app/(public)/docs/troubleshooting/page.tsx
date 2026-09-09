import Link from "next/link";
import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";

export default function TroubleshootingIndexPage() {
  const issues = [
    {
      title: "I can't log in",
      link: "/docs/troubleshooting/login-issues",
      desc: "Password resets and account recovery.",
    },
    {
      title: "My contribution wasn't detected",
      link: "/docs/troubleshooting/whatsapp-extraction",
      desc: "Troubleshooting WhatsApp extraction failures.",
    },
    {
      title: "My M-Pesa message isn't appearing",
      link: "/docs/troubleshooting/missing-messages",
      desc: "Fixing connection issues between WhatsApp and KapuLetu.",
    },
    {
      title: "The amount is wrong",
      link: "/docs/troubleshooting/wrong-amount",
      desc: "How to correct a mis-parsed contribution.",
    },
    {
      title: "I can't see a group",
      link: "/docs/troubleshooting/missing-group",
      desc: "Fixing permissions and access issues.",
    },
    {
      title: "My report is wrong",
      link: "/docs/troubleshooting/report-errors",
      desc: "Troubleshooting discrepancies in PDF generation.",
    },
  ];

  return (
    <DocsArticle
      title="Troubleshooting Hub"
      description="Something isn't working? Find solutions to common problems here."
      difficulty="Beginner"
    >
      <DocsCallout type="info">
        If you are experiencing a technical error, you can also search for the exact text of the
        error message you received to find our <strong>Error & Message Library</strong> solution.
      </DocsCallout>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">What happened?</h2>

      <div className="grid grid-cols-1 gap-4 my-8">
        {issues.map((issue, idx) => (
          <Link
            key={idx}
            href={issue.link}
            className="p-5 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors flex flex-col justify-center shadow-sm"
          >
            <h3 className="font-bold text-foreground text-lg mb-1">{issue.title}</h3>
            <p className="text-muted-foreground text-sm">{issue.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 border border-border bg-card rounded-xl text-center">
        <h3 className="font-bold mb-2">Still having trouble?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our support team is ready to help you resolve any complex issues.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </DocsArticle>
  );
}
