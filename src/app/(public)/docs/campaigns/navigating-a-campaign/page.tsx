import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export default function NavigatingACampaignPage() {
  const steps = [
    {
      title: "Overview",
      description:
        "The Overview tab provides a high-level summary of your campaign's performance, including total amount raised against your target, recent activity, and a quick glance at the deadline.",
      image: "/docs/campaigns/navigating-step-1.png",
    },
    {
      title: "Contributions",
      description:
        "The Contributions tab lists all the individual payments made towards this campaign. You can view, search, and verify transactions here.",
      image: "/docs/campaigns/navigating-step-2.png",
    },
    {
      title: "Reports",
      description:
        "Under the Reports tab, you can generate detailed summaries and breakdowns of the campaign's finances to share with your members or stakeholders.",
      image: "/docs/campaigns/navigating-step-3.png",
    },
    {
      title: "Settings",
      description:
        "The Settings tab allows you to adjust the campaign's details, such as the target amount or deadline, and manage other configurations.",
      image: "/docs/campaigns/navigating-step-4.png",
    },
  ];

  return (
    <DocsArticle
      title="Navigating a Campaign"
      description="Learn about the different sections within a campaign dashboard."
      difficulty="Beginner"
    >
      <p className="mb-4">
        Once you've created a campaign, you'll spend most of your time managing it through its
        dedicated dashboard. Here's what you will find inside:
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for navigating a campaign" />

      <DocsCallout type="info" title="Quick Navigation">
        You can always jump back to your Group to view other campaigns or to see the combined
        overview of all fundraising activities.
      </DocsCallout>
    </DocsArticle>
  );
}
