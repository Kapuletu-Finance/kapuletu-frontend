import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export default function CreatingAGroupPage() {
  const steps = [
    {
      title: "Open the Groups Tab",
      description: "Navigate to the Groups section on the left-hand sidebar of your dashboard.",
    },
    {
      title: "Click 'Create Group'",
      description:
        "Locate and click the primary button labeled 'Create Group' in the top right corner.",
    },
    {
      title: "Enter Group Details",
      description:
        "Fill in the basic information including the Group Name, Description, and Base Currency.",
    },
    {
      title: "Save and Finalize",
      description:
        "Click 'Save' to create the group. You will automatically be set as the Lead Treasurer.",
    },
  ];

  return (
    <DocsArticle
      title="Creating a Group"
      description="Step-by-step instructions for establishing a new group in KapuLetu."
      difficulty="Beginner"
    >
      <p>
        Groups are the foundational organizational unit in KapuLetu. Every member, contribution, and
        fundraising activity must belong to a specific group.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for creating a group" />

      <DocsCallout type="tip" title="Pro Tip">
        If you manage multiple organizations, you can create multiple groups using the same KapuLetu
        account and easily switch between them using the Group Switcher.
      </DocsCallout>
    </DocsArticle>
  );
}
