import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsCallout } from '@/features/docs/components/DocsCallout';
import Link from 'next/link';

export default function GroupsIndexPage() {
  const guides = [
    { title: "What is a Group?", link: "/docs/groups/what-is-a-group" },
    { title: "Creating a Group", link: "/docs/groups/creating-a-group" },
    { title: "Setting up a Group", link: "/docs/groups/setting-up-a-group" },
    { title: "Adding members", link: "/docs/groups/adding-members" },
    { title: "Importing members", link: "/docs/groups/importing-members" },
    { title: "Editing & Removing members", link: "/docs/groups/editing-members" },
    { title: "Member profiles, Contribution history, and Pledges", link: "/docs/groups/member-profiles" },
    { title: "Group branding & Group settings", link: "/docs/groups/group-settings" },
    { title: "Deleting/archiving a group", link: "/docs/groups/deleting-a-group" },
    { title: "Viewing group history", link: "/docs/groups/viewing-history" },
  ];

  return (
    <DocsArticle 
      title="Groups & Members"
      description="Manage the communities, organizations, and members you serve."
      difficulty="Beginner"
    >
      <DocsCallout type="info">
        Groups are the foundational unit in KapuLetu. Every fundraising activity, contribution, and report belongs to a specific group.
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
