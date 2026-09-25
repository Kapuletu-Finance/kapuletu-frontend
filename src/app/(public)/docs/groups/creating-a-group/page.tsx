import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export default function CreatingAGroupPage() {
  const steps = [
    {
      title: "Open the Groups Tab",
      description: "Navigate to the Groups section on the left-hand sidebar of your dashboard.",
      image: "/docs/groups/creating-step-1.png",
    },
    {
      title: "Click 'Create Group'",
      description:
        "Locate and click the primary button labeled 'Create Group' in the top right corner.",
      image: "/docs/groups/creating-step-2.png",
    },
    {
      title: "Enter Group Details",
      description:
        "Fill in the basic information including the Group Name, Description, and Base Currency.",
      image: "/docs/groups/creating-step-3.png",
    },
    {
      title: "Save and Finalize",
      description:
        "Click 'Save' to create the group. You will automatically be taken to the group's management window, where you will be managing your campaigns.",
      image: "/docs/groups/creating-step-4.png",
    },
  ];

  return (
    <DocsArticle
      title="Creating a Group"
      description="Step-by-step instructions for establishing a new group in KapuLetu."
      difficulty="Beginner"
    >
      <p>
        Groups are the foundational organizational unit in KapuLetu. Every campaign and fundraising
        activity must belong to a specific group.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for creating a group" />

      <DocsCallout type="tip" title="Pro Tip">
        If you manage multiple organizations, you can create multiple groups using the same KapuLetu
        account and easily switch between them using the Group Switcher.
      </DocsCallout>
    </DocsArticle>
  );
}
