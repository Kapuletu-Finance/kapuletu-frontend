import type { Metadata } from "next";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export const metadata: Metadata = {
  title: "Assigning & Splitting Contributions | KapuLetu Docs",
  description: "Learn how to properly allocate funds to your campaigns.",
  openGraph: {
    title: "Assigning & Splitting Contributions | KapuLetu Docs",
    description: "Learn how to properly allocate funds to your campaigns.",
  },
  twitter: {
    title: "Assigning & Splitting Contributions | KapuLetu Docs",
    description: "Learn how to properly allocate funds to your campaigns.",
  },
};

export default function AssigningContributionsPage() {
  const steps = [
    {
      title: "View Unassigned Contributions",
      description:
        "Incoming payments usually land in the Inbox if the system doesn't know which campaign they belong to.",
      image: "/docs/campaigns/assigning-step-1.png",
    },
    {
      title: "Assign to a Campaign",
      description:
        "Click on an unassigned contribution and select the destination campaign from the dropdown.",
      image: "/docs/campaigns/assigning-step-2.png",
    },
    {
      title: "Reassigning a Contribution",
      description:
        "If a contribution was allocated incorrectly, find it in the Contributions tab, click 'Edit', and assign it to the correct campaign.",
      image: "/docs/campaigns/assigning-step-3.png",
    },
    {
      title: "Splitting a Contribution",
      description:
        "Sometimes a single payment covers multiple campaigns (e.g., $100 total: $50 for Building Fund, $50 for Welfare). Use the 'Split' function on the contribution to divide the amount across multiple campaigns.",
      image: "/docs/campaigns/assigning-step-4.png",
    },
  ];

  return (
    <DocsArticle
      title="Assigning & Splitting Contributions"
      description="Learn how to properly allocate funds to your campaigns."
      difficulty="Advanced"
    >
      <p>
        Ensuring that every dollar is accounted for in the correct campaign is crucial for accurate
        reporting. KapuLetu provides powerful tools to assign, reassign, and split incoming
        payments.
      </p>

      <DocsScreenshotSequence
        steps={steps}
        alt="Guided steps for assigning and splitting contributions"
      />

      <DocsCallout type="warning" title="Splitting Restrictions">
        You can only split a contribution if the sum of the splits perfectly equals the total
        original contribution amount.
      </DocsCallout>
    </DocsArticle>
  );
}
