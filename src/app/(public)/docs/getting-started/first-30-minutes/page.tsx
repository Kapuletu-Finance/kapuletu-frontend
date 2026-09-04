import Link from "next/link";
import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsFeedback } from "@/features/docs/components/DocsFeedback";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";
import IconLibrary from "@/features/shared/components/IconLibrary";

export default function First30MinutesPage() {
  const setupSteps = [
    {
      title: "Create your group",
      description:
        "Navigate to Groups and click 'Create Group'. Enter your community's name and details.",
    },
    {
      title: "Add members",
      description:
        "Inside your new group, go to the Members tab and add a few test members (or yourself).",
    },
    {
      title: "Create a fundraising activity",
      description:
        "Go to Activities and set up a new campaign (e.g., 'Monthly Contributions') with a target.",
    },
    {
      title: "Add a test contribution",
      description:
        "Go to Contributions, click 'Add Manual Contribution', and record a test cash payment.",
    },
    {
      title: "Approve the contribution",
      description:
        "Review the contribution in your Inbox and click 'Approve' to commit it to the Ledger.",
    },
    {
      title: "Generate your first report",
      description:
        "Go to Reports, select your group, and generate a daily summary to see your approved test contribution.",
    },
  ];

  return (
    <DocsArticle
      title="Your First 30 Minutes With KapuLetu"
      description="A guided step-by-step checklist to complete your first end-to-end treasury workflow."
      difficulty="Beginner"
      estimatedTime="30 min"
    >
      <p className="text-lg mb-8 text-muted-foreground">
        The best way to learn KapuLetu is to use it. In this guide, we will walk you through a
        complete cycle: from creating a group to generating a financial report.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">
        The 6-Step Workflow
      </h2>

      <DocsScreenshotSequence steps={setupSteps} alt="First 30 minutes workflow steps" />

      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 p-8 rounded-xl text-center mt-12 mb-8">
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2 flex items-center justify-center gap-2">
          <IconLibrary name="badge-check" className="w-8 h-8 text-green-600 dark:text-green-400" />{" "}
          Congratulations!
        </h3>
        <p className="text-green-700 dark:text-green-500 mb-6">
          You have completed your first treasury workflow.
        </p>

        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm font-medium text-green-800 dark:text-green-400 mb-1">
            <span>Progress</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-green-200 dark:bg-green-900/50 rounded-full h-2.5">
            <div
              className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full"
              style={{ width: "100%" }}
            ></div>
          </div>
          <p className="text-xs text-green-700 dark:text-green-500 mt-2">6 / 6 steps completed</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-border bg-card rounded-xl">
          <h4 className="font-bold mb-2">Want to automate this?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Learn how to connect WhatsApp so you don't have to add contributions manually.
          </p>
          <Link href="/docs/whatsapp" className="text-primary text-sm font-medium hover:underline">
            Read the WhatsApp Guide &rarr;
          </Link>
        </div>
        <div className="p-6 border border-border bg-card rounded-xl">
          <h4 className="font-bold mb-2">Need to invite your team?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Learn how to add Assistant Treasurers to help you manage the workload.
          </p>
          <Link
            href="/docs/groups/members"
            className="text-primary text-sm font-medium hover:underline"
          >
            Manage Permissions &rarr;
          </Link>
        </div>
      </div>

      <DocsFeedback />
    </DocsArticle>
  );
}
