import type { Metadata } from "next";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export const metadata: Metadata = {
  title: "Targets & Member Expectations | KapuLetu Docs",
  description: "Manage overall goals and individual contribution requirements.",
  openGraph: {
    title: "Targets & Member Expectations | KapuLetu Docs",
    description: "Manage overall goals and individual contribution requirements.",
  },
  twitter: {
    title: "Targets & Member Expectations | KapuLetu Docs",
    description: "Manage overall goals and individual contribution requirements.",
  },
};

export default function TargetsAndExpectationsPage() {
  const steps = [
    {
      title: "Set a Campaign Target",
      description:
        "When creating or editing a campaign, you can set an overall financial goal. This is optional but helps track overall progress.",
      image: "/docs/campaigns/targets-step-1.png",
    },
    {
      title: "Define Per-Member Expectations",
      description:
        "If you expect every member to contribute a specific fixed amount, enter this in the 'Member Expectation' field.",
      image: "/docs/campaigns/targets-step-2.png",
    },
    {
      title: "Track Arrears",
      description:
        "Once expectations are set, KapuLetu automatically calculates who is in arrears based on their actual contributions versus the expectation.",
      image: "/docs/campaigns/targets-step-3.png",
    },
  ];

  return (
    <DocsArticle
      title="Targets & Member Expectations"
      description="Manage overall goals and individual contribution requirements."
      difficulty="Intermediate"
    >
      <p>
        Campaigns often have a total fundraising goal, but sometimes they also come with specific
        rules on how much each member should contribute. KapuLetu allows you to track both.
      </p>

      <DocsScreenshotSequence
        steps={steps}
        alt="Guided steps for setting targets and expectations"
      />

      <DocsCallout type="tip" title="Optional vs Required">
        Overall campaign targets are purely visual and help motivate the group. Per-member
        expectations are stricter and are used to generate 'Arrears' reports for members who haven't
        met their quota.
      </DocsCallout>
    </DocsArticle>
  );
}
