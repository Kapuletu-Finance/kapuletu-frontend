import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export default function DeletingAGroupPage() {
  const steps = [
    {
      title: "Navigate to Danger Zone",
      description:
        "In 'Group Settings', scroll all the way to the bottom to find the 'Danger Zone'.",
      image: "/docs/groups/delete-step-1.png",
    },
    {
      title: "Select Archive or Delete",
      description:
        "Choose 'Archive Group' if you simply want to hide it from your active list, or 'Delete Group' if you want to permanently erase it.",
      image: "/docs/groups/delete-step-2.png",
    },
    {
      title: "Confirm the Action",
      description:
        "A confirmation modal will appear. You must type the name of the group exactly as it appears to confirm the deletion.",
      image: "/docs/groups/delete-step-3.png",
    },
    {
      title: "Finalize",
      description:
        "Click the final confirmation button. The group and all its underlying campaigns will be handled accordingly.",
      image: "/docs/groups/delete-step-4.png",
    },
  ];

  return (
    <DocsArticle
      title="Deleting or Archiving a Group"
      description="Manage the lifecycle of your groups when they are no longer needed."
      difficulty="Advanced"
    >
      <p className="mb-4">
        When a community or organization is no longer active, you can clean up your workspace by
        either archiving or permanently deleting the group.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for archiving or deleting a group" />

      <DocsCallout type="warning" title="Permanent Deletion">
        Deleting a group is an irreversible action. It will permanently destroy all campaigns,
        contributions, and historical records associated with that group. Proceed with extreme
        caution!
      </DocsCallout>
    </DocsArticle>
  );
}
