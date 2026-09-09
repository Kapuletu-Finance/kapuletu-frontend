import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export default function AddingMembersPage() {
  const steps = [
    {
      title: "Navigate to the Members Tab",
      description:
        "Inside your active group, click on the 'Members' tab in the top navigation bar.",
    },
    {
      title: "Click 'Add Member'",
      description:
        "Click the 'Add Member' button. To add multiple people at once, you can select 'Import from CSV' instead.",
    },
    {
      title: "Enter Member Details",
      description: "Provide the member's full name, phone number, and email address (optional).",
    },
    {
      title: "Assign a Role (Optional)",
      description:
        "If this member is assisting you with treasury duties, you can assign them an 'Assistant Treasurer' role here.",
    },
  ];

  return (
    <DocsArticle
      title="Adding Members"
      description="How to add individuals to your group's roster."
      difficulty="Beginner"
    >
      <p>
        Before you can start receiving and tracking contributions accurately, you need to add your
        group's members to the system. This allows KapuLetu to automatically match M-Pesa payments
        to the correct person via their phone number.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for adding members" />

      <DocsCallout type="important" title="Phone Numbers are Critical">
        Ensure you enter the correct phone number (including country code) for each member. KapuLetu
        uses this number to automatically identify who sent an M-Pesa contribution.
      </DocsCallout>
    </DocsArticle>
  );
}
