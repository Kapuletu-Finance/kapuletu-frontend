import type { Metadata } from "next";
import Link from "next/link";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";

export const metadata: Metadata = {
  title: "Campaigns Management | KapuLetu Docs",
  description: "Learn how to create, manage, and configure individual fundraising campaigns.",
  openGraph: {
    title: "Campaigns Management | KapuLetu Docs",
    description: "Learn how to create, manage, and configure individual fundraising campaigns.",
  },
  twitter: {
    title: "Campaigns Management | KapuLetu Docs",
    description: "Learn how to create, manage, and configure individual fundraising campaigns.",
  },
};

export default function CampaignsIndexPage() {
  const guides = [
    { title: "What is a Campaign?", link: "/docs/campaigns/what-is-a-campaign" },
    { title: "Creating a Campaign", link: "/docs/campaigns/creating-a-campaign" },
    { title: "Navigating a Campaign", link: "/docs/campaigns/navigating-a-campaign" },
    { title: "Edit Campaign Details", link: "/docs/campaigns/edit-a-campaign" },
    { title: "Targets & Member Expectations", link: "/docs/campaigns/targets-and-expectations" },
    { title: "Adding a Profile Image", link: "/docs/campaigns/profile-image" },
    {
      title: "Assigning & Splitting Contributions",
      link: "/docs/campaigns/assigning-contributions",
    },
    { title: "Statistics & Closing a Campaign", link: "/docs/campaigns/statistics-and-closing" },
  ];

  return (
    <DocsArticle
      title="Campaigns"
      description="Manage the fundraising activities and campaigns within your groups."
      difficulty="Beginner"
    >
      <DocsCallout type="info">
        A campaign is a specific fundraising activity that belongs to a group. Groups come in handy
        especially when a treasurer is handling multiple campaigns or fundraising activities inside
        a related ecosystem.
      </DocsCallout>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        {guides.map((guide, idx) => (
          <Link
            key={idx}
            href={guide.link}
            className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors"
          >
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>
    </DocsArticle>
  );
}
