import type { Metadata } from "next";
import Link from "next/link";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";

export const metadata: Metadata = {
  title: "Groups Management | KapuLetu Docs",
  description: "Learn how to create, manage, and configure groups to host your campaigns.",
};

export default function GroupsIndexPage() {
  const guides = [
    { title: "What is a Group?", link: "/docs/groups/what-is-a-group" },
    { title: "Creating a Group", link: "/docs/groups/creating-a-group" },
    { title: "Setting up a Group", link: "/docs/groups/setting-up-a-group" },
    { title: "Group branding & Group settings", link: "/docs/groups/group-settings" },
    { title: "Deleting/archiving a group", link: "/docs/groups/deleting-a-group" },
    { title: "Viewing group history", link: "/docs/groups/viewing-history" },
  ];

  return (
    <DocsArticle
      title="Groups"
      description="Manage the organizations and ecosystems that host your campaigns."
      difficulty="Beginner"
    >
      <DocsCallout type="info">
        Groups are the foundational unit in KapuLetu. Every campaign and fundraising activity
        belongs to a specific group, allowing you to organize related activities together.
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
