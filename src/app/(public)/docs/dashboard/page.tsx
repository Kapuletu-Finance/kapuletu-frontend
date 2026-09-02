import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsCallout } from '@/features/docs/components/DocsCallout';
import Link from 'next/link';

export default function DashboardIndexPage() {
  const guides = [
    { title: "Understanding the Dashboard overview", link: "/docs/dashboard/overview" },
    { title: "Understanding balances", link: "/docs/dashboard/balances" },
    { title: "Understanding contribution statistics", link: "/docs/dashboard/statistics" },
    { title: "Understanding expenses & fundraising progress", link: "/docs/dashboard/progress" },
    { title: "Understanding financial summaries", link: "/docs/dashboard/summaries" },
    { title: "Filtering dashboard data and date ranges", link: "/docs/dashboard/filtering" },
    { title: "Dashboard troubleshooting", link: "/docs/dashboard/troubleshooting" },
  ];

  return (
    <DocsArticle 
      title="Dashboard Guides"
      description="Learn how to read and interpret your treasury's financial overview."
      difficulty="Beginner"
    >
      <DocsCallout type="info">
        The dashboard is the nerve center of KapuLetu, providing an at-a-glance summary of your group's financial health.
      </DocsCallout>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        {guides.map((guide, idx) => (
          <Link key={idx} href={guide.link} className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>
    </DocsArticle>
  );
}
