import type { Metadata } from "next";
import Link from "next/link";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsFeedback } from "@/features/docs/components/DocsFeedback";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const metadata: Metadata = {
  title: "Your First 5 Minutes With KapuLetu",
  description:
    "A guided step-by-step checklist to complete your first end-to-end treasury workflow.",
  openGraph: {
    title: "Your First 5 Minutes With KapuLetu",
    description:
      "A guided step-by-step checklist to complete your first end-to-end treasury workflow.",
  },
  twitter: {
    title: "Your First 5 Minutes With KapuLetu",
    description:
      "A guided step-by-step checklist to complete your first end-to-end treasury workflow.",
  },
};

export default function First5MinutesPage() {
  const setupSteps = [
    {
      title: "Create Your Group",
      description: (
        <span>
          Navigate to{" "}
          <Link href="/docs/groups" className="text-primary hover:underline font-medium">
            Groups
          </Link>{" "}
          and click{" "}
          <Link href="/docs/groups#create" className="text-primary hover:underline font-medium">
            <strong>'Create Group'</strong>
          </Link>
          . Enter your community's name. This acts as the main umbrella for all your treasury
          activities.
        </span>
      ),
      image: "/docs/getting-started/5min-create-group.png",
    },
    {
      title: "Create a Campaign",
      description: (
        <span>
          Inside your new group,{" "}
          <Link href="/docs/campaigns#create" className="text-primary hover:underline font-medium">
            create a Campaign
          </Link>
          . A campaign is a specific fundraising activity with a defined goal, like 'Monthly
          Welfare' or 'Church Roof'.
        </span>
      ),
      image: "/docs/getting-started/5min-create-campaign.png",
    },
    {
      title: "Click 'Add Contribution'",
      description: (
        <span>
          Open your campaign and click the{" "}
          <Link
            href="/docs/contributions#add-manual"
            className="text-primary hover:underline font-medium"
          >
            <strong>'Add Contribution'</strong>
          </Link>{" "}
          button to start recording a test cash payment manually.
        </span>
      ),
      image: "/docs/getting-started/5min-add-contribution-button.png",
    },
    {
      title: "Fill the Contribution Form",
      description: (
        <span>
          Enter the contributor's details, the amount, and the date. This structured form ensures
          you capture all necessary evidence for a clean audit trail.
        </span>
      ),
      image: "/docs/getting-started/5min-add-contribution-form.png",
    },
    {
      title: "Contribution Logged",
      description: (
        <span>
          Once submitted, the system securely logs the payment. Now click on the contributions tab
          inside the campaign to check on your contributions.
        </span>
      ),
      image: "/docs/getting-started/5min-add-contribution-success.png",
    },
    {
      title: "The WhatsApp Assistant (Pro Tip)",
      description: (
        <span>
          Once your account is active, you don't need to add contributions manually! You can simply
          forward M-Pesa payment messages directly to the KapuLetu WhatsApp Assistant, which will
          instantly queue them in your Inbox. We'll deep-dive into this in the{" "}
          <Link href="/docs/whatsapp" className="text-primary hover:underline font-medium">
            WhatsApp Guide
          </Link>
          .
        </span>
      ),
      image: "/docs/getting-started/5min-whatsapp.jpeg",
    },
    {
      title: "Inbox Approval & Splitting",
      description: (
        <span>
          Go to your{" "}
          <Link href="/docs/contributions" className="text-primary hover:underline font-medium">
            Inbox
          </Link>{" "}
          to review unverified contributions. Here, when you click the approve button you will be
          able to <strong>'Split'</strong> a single bulk payment (e.g., receiving KES 5000 and
          allocating 1000 to yourself, 2000 to Family, and 2000 to James) before clicking{" "}
          <strong>'Approve'</strong> to commit it to the official report.
        </span>
      ),
      image: "/docs/getting-started/5min-inbox-split.png",
    },
    {
      title: "1. WhatsApp-Ready Reports",
      description: (
        <span>
          Navigate to{" "}
          <Link href="/docs/reports" className="text-primary hover:underline font-medium">
            Reports
          </Link>
          . You can instantly preview a beautifully formatted text summary and share it directly to
          your WhatsApp group with one click.
        </span>
      ),
      image: "/docs/getting-started/5min-report-whatsapp.png",
      secondaryImage: "/docs/getting-started/5min-report-whatsapp-result.png",
    },
    {
      title: "2. Official PDF Statements",
      description: (
        <span>
          Need something formal for a meeting? Click <strong>Download PDF</strong> to generate a
          branded, official document summarizing the campaign's progress and member balances.
        </span>
      ),
      image: "/docs/getting-started/5min-report-pdf.png",
      secondaryImage: "/docs/getting-started/5min-report-pdf-result.png",
    },
    {
      title: "3. Detailed Excel Exports",
      description: (
        <span>
          For deep-dive auditing, generate an <strong>Excel Report</strong>. This gives you a raw,
          spreadsheet-ready breakdown of every single transaction and member contribution.
        </span>
      ),
      image: "/docs/getting-started/5min-report-excel.png",
      secondaryImage: "/docs/getting-started/5min-report-excel-result.png",
    },
    {
      title: "4. Public View Online Link",
      description: (
        <span>
          Don't want to keep downloading reports? Generate a <strong>Public Link</strong> and share
          it with your members. They can visit this live URL anytime to track the campaign's
          progress themselves! Note: This link is pin protected , so you will have to share the pin
          with your members so that they can access the report. You can always regenerate this pin
          anytime in your campaign settings.
        </span>
      ),
      image: "/docs/getting-started/5min-report-public.png",
      secondaryImage: "/docs/getting-started/5min-report-public-result.png",
    },
  ];

  return (
    <DocsArticle
      title="Your First 5 Minutes With KapuLetu"
      description="A guided step-by-step checklist to complete your first end-to-end treasury workflow."
      difficulty="Beginner"
      estimatedTime="5 min"
    >
      <p className="text-lg mb-8 text-muted-foreground">
        The best way to learn KapuLetu is to use it. In this guide, we will walk you through a
        complete cycle: from creating a group to generating a financial report.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-border pb-2">
        The 6-Step Workflow
      </h2>

      <DocsScreenshotSequence steps={setupSteps} alt="First 5 minutes workflow steps" />

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
          <p className="text-xs text-green-700 dark:text-green-500 mt-2">11 / 11 steps completed</p>
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
          <h4 className="font-bold mb-2">Explore Your Dashboard</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Learn how to read your financial overview and track campaign progress at a glance.
          </p>
          <Link href="/docs/dashboard" className="text-primary text-sm font-medium hover:underline">
            View Dashboard Guide &rarr;
          </Link>
        </div>
      </div>

      <DocsFeedback />
    </DocsArticle>
  );
}
