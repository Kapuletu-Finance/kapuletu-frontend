import type { Metadata } from "next";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export const metadata: Metadata = {
  title: "Statistics & Closing a Campaign | KapuLetu Docs",
  description: "Analyze your campaign's performance and finalize the activity.",
};

export default function StatisticsAndClosingPage() {
  const steps = [
    {
      title: "View Campaign Statistics",
      description:
        "Navigate to the 'Overview' or 'Reports' tab of your campaign to see detailed analytics such as highest contributors, recent activity, and total sum raised.",
      image: "/docs/campaigns/statistics-step-1.png",
    },
    {
      title: "Assess Goal Completion",
      description:
        "Compare the total raised against your target amount. Use the charts to understand your fundraising trajectory.",
      image: "/docs/campaigns/statistics-step-2.png",
    },
    {
      title: "Close the Campaign",
      description:
        "Once the deadline has passed or the goal is met, go to 'Settings' and change the campaign status to 'Closed'.",
      image: "/docs/campaigns/statistics-step-3.png",
    },
    {
      title: "Archived Status",
      description:
        "A closed campaign will no longer accept new contributions, but all historical data and reports will remain accessible.",
      image: "/docs/campaigns/statistics-step-4.png",
    },
  ];

  return (
    <DocsArticle
      title="Statistics & Closing a Campaign"
      description="Analyze your campaign's performance and finalize the activity."
      difficulty="Intermediate"
    >
      <p>
        KapuLetu provides rich insights into how your campaigns are performing. When a campaign has
        run its course, you can safely close it to preserve its history.
      </p>

      <DocsScreenshotSequence
        steps={steps}
        alt="Guided steps for viewing statistics and closing a campaign"
      />

      <DocsCallout type="info" title="Reopening Campaigns">
        If you closed a campaign by mistake, you can always reopen it from the Settings tab by
        changing its status back to 'Active'.
      </DocsCallout>
    </DocsArticle>
  );
}
