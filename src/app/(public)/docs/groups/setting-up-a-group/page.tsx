import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export default function SettingUpAGroupPage() {
  const steps = [
    {
      title: "Navigate to Group Setup",
      description:
        "After creating your group, click on 'Group Settings' in the bottom left of your sidebar.",
      image: "/docs/groups/setup-step-1.png",
    },
    {
      title: "Configure Base Currency",
      description:
        "Select the primary currency (e.g., KES, USD) that will be used for all reporting across the campaigns in this group.",
      image: "/docs/groups/setup-step-2.png",
    },
    {
      title: "Set Timezone",
      description:
        "Ensure the group's timezone matches your local time so that contribution timestamps and deadlines are perfectly aligned.",
      image: "/docs/groups/setup-step-3.png",
    },
    {
      title: "Save Configuration",
      description:
        "Click 'Save Changes'. Your group is now fully configured and ready to host your campaigns.",
      image: "/docs/groups/setup-step-4.png",
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
    </DocsArticle>
  );
}
