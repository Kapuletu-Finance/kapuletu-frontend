import type { Metadata } from "next";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export const metadata: Metadata = {
  title: "Group Branding & Settings | KapuLetu Docs",
  description: "Personalize your group with a name, description, and official logo.",
  openGraph: {
    title: "Group Branding & Settings | KapuLetu Docs",
    description: "Personalize your group with a name, description, and official logo.",
  },
  twitter: {
    title: "Group Branding & Settings | KapuLetu Docs",
    description: "Personalize your group with a name, description, and official logo.",
  },
};

export default function GroupSettingsPage() {
  const steps = [
    {
      title: "Access Group Settings",
      description: "Click on 'Group Settings' at the bottom of the main sidebar.",
      image: "/docs/groups/settings-step-1.png",
    },
    {
      title: "Edit Branding Details",
      description:
        "Locate the 'Branding' section. Here you can update the Group Name and the description that appears on reports.",
      image: "/docs/groups/settings-step-2.png",
    },
    {
      title: "Upload a Logo",
      description:
        "Click on the logo placeholder to upload a high-quality emblem or logo for your organization. This logo will appear on all exported PDF reports.",
      image: "/docs/groups/settings-step-3.png",
    },
    {
      title: "Apply Changes",
      description:
        "Hit the 'Save Changes' button. The updated branding will instantly reflect across your entire dashboard.",
      image: "/docs/groups/settings-step-4.png",
    },
  ];

  return (
    <DocsArticle
      title="Group Branding & Settings"
      description="Personalize your group with a name, description, and official logo."
      difficulty="Beginner"
    >
      <p className="mb-4">
        Customizing your group's branding gives it a professional appearance. This is especially
        useful because the group name and logo are automatically placed on the headers of your
        generated financial reports.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for editing group branding" />

      <DocsCallout type="tip" title="Logo Format">
        For the best results on PDF reports, use a PNG image with a transparent background.
      </DocsCallout>
    </DocsArticle>
  );
}
