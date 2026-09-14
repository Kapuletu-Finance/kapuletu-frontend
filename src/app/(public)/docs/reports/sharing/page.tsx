import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export default function SharingReportsPage() {
  const steps = [
    {
      title: "Generate a Report",
      description: "First, generate any report (e.g., Monthly Summary, Activity Report).",
    },
    {
      title: "Review the Data",
      description: "Ensure the generated data looks correct on your screen before sharing.",
    },
    {
      title: "Select Export Format",
      description:
        "Click the 'Export' button in the top right. Choose between 'Download PDF' or 'Copy WhatsApp Summary'.",
    },
    {
      title: "Share with Group",
      description:
        "If you chose WhatsApp, simply paste the perfectly formatted text directly into your WhatsApp group!",
    },
  ];

  return (
    <DocsArticle
      title="Sharing & Downloading Reports"
      description="How to export your financial data to share with your group."
      difficulty="Beginner"
    >
      <p>
        Transparency is key to a healthy group. KapuLetu makes it incredibly easy to take your
        complex ledger data and turn it into beautiful, easy-to-read reports for your members.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for sharing reports" />

      <DocsCallout type="tip" title="WhatsApp-Ready Formatting">
        The 'Copy WhatsApp Summary' option automatically formats your report with emojis, bold text,
        and bullet points so it looks perfect when pasted into a WhatsApp chat!
      </DocsCallout>
    </DocsArticle>
  );
}
