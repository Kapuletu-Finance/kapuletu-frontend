"use client";

import { useRouter } from "next/navigation";
import ButtonWithIcon from "@/features/shared/components/ButtonWithIcon";

const ReviewInboxButton = () => {
  const router = useRouter();

  return (
    <ButtonWithIcon
      label="Review Contributions"
      description="Approve pending contributions"
      onClick={() => router.push("/treasurer/inbox")}
      iconName="check-circle"
    />
  );
};

export default ReviewInboxButton;
