import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsCallout } from '@/features/docs/components/DocsCallout';
import { DocsVideo } from '@/features/docs/components/DocsVideo';
import Link from 'next/link';

export default function FundraisingIndexPage() {
  const guides = [
    { title: "Understanding fundraising activities", link: "/docs/fundraising/understanding-activities" },
    { title: "Creating an activity & Setting a target", link: "/docs/fundraising/creating-activity" },
    { title: "Optional vs required targets", link: "/docs/fundraising/targets" },
    { title: "Setting contribution expectations", link: "/docs/fundraising/expectations" },
    { title: "Adding a profile image", link: "/docs/fundraising/profile-image" },
    { title: "Managing an activity & Viewing activity progress", link: "/docs/fundraising/managing-activity" },
    { title: "Editing activity details", link: "/docs/fundraising/editing-details" },
    { title: "Assigning, Reassigning, and Splitting contributions", link: "/docs/fundraising/assigning-contributions" },
    { title: "Viewing activity statistics & Closing an activity", link: "/docs/fundraising/activity-statistics" },
    { title: "Generating activity reports", link: "/docs/fundraising/activity-reports" },
  ];

  return (
    <DocsArticle 
      title="Fundraising Activities"
      description="Manage specific fundraising goals, campaigns, and welfare targets."
      difficulty="Beginner"
    >
      <DocsCallout type="info" title="What is an Activity?">
        A fundraising activity represents a specific reason or purpose for which money is being collected. For example: "December Welfare", "Jane's Wedding", or "Monthly Contributions".
      </DocsCallout>

      <DocsVideo title="How to manage fundraising activities" duration="3:45" />

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2">Activity Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {guides.map((guide, idx) => (
          <Link key={idx} href={guide.link} className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors shadow-sm">
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>
    </DocsArticle>
  );
}
