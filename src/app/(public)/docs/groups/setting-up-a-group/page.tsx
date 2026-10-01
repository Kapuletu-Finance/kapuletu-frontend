import type { Metadata } from "next";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsPagination } from "@/features/docs/components/DocsPagination";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export const metadata: Metadata = {
  title: "Setting up a Group | KapuLetu Docs",
  description: "Configure the initial operational settings for your new group.",
  openGraph: {
    title: "Setting up a Group | KapuLetu Docs",
    description: "Configure the initial operational settings for your new group.",
  },
  twitter: {
    title: "Setting up a Group | KapuLetu Docs",
    description: "Configure the initial operational settings for your new group.",
  },
};

export default function SettingUpAGroupPage() {
  const steps = [
    {
      title: "Navigate to Edit Group",
      description:
        "After creating your group, click on 'Edit Group' in the groups list to open the setup modal.",
      image: "/docs/groups/setup-step-1.png",
    },
    {
      title: "Adjust the Group's information",
      description:
        "Update the details of the group including the name, of the group, the description, status of the group.",
      image: "/docs/groups/setup-step-2.png",
    },
    {
      title: "Save Configuration",
      description:
        "Click 'Save Changes'. Your group is now fully configured and ready to host your campaigns.",
      image: "/docs/groups/setup-step-3.png",
    },
  ];

  return (
    <DocsArticle
      title="Setting up a Group"
      description="Configure the initial operational settings for your new group."
      difficulty="Beginner"
    >
      <p className="mb-4">
        Once you've created a group, it's important to establish its base settings before you begin
        launching campaigns. These settings dictate how financial data is processed and displayed.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for setting up a group" />

      <DocsCallout type="warning" title="Currency Locking">
        Once you have launched a campaign and received contributions, the base currency of the group
        will be locked to ensure reporting consistency. Make sure it is correct during setup!
      </DocsCallout>
      <DocsPagination
        prev={{ title: "Creating a Group", link: "/docs/groups/creating-a-group" }}
        next={{ title: "Group branding & Group settings", link: "/docs/groups/group-settings" }}
      />
    </DocsArticle>
  );
}
