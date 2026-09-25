import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";

export default function ProfileImagePage() {
  const steps = [
    {
      title: "Navigate to Campaign Settings",
      description: "Open the campaign and click on the 'Settings' tab.",
      image: "/docs/campaigns/profile-step-1.png",
    },
    {
      title: "Locate Profile Image Section",
      description: "Scroll down to the 'Campaign Image' section.",
      image: "/docs/campaigns/profile-step-2.png",
    },
    {
      title: "Upload Image",
      description:
        "Click 'Upload' and select a suitable image from your device. This could be a picture of the project, event, or beneficiary.",
      image: "/docs/campaigns/profile-step-3.png",
    },
    {
      title: "Save Changes",
      description:
        "The image will automatically save and appear as the cover photo for the campaign.",
      image: "/docs/campaigns/profile-step-4.png",
    },
  ];

  return (
    <DocsArticle
      title="Adding a Profile Image"
      description="Personalize your campaign with a cover photo."
      difficulty="Beginner"
    >
      <p>
        Adding a profile image to your campaign makes it more recognizable and engaging for your
        members, especially when sharing reports or payment links.
      </p>

      <DocsScreenshotSequence steps={steps} alt="Guided steps for adding a profile image" />

      <DocsCallout type="info" title="Image Recommendations">
        For best results, use a high-quality square or landscape image. The file size should not
        exceed 5MB.
      </DocsCallout>
    </DocsArticle>
  );
}
