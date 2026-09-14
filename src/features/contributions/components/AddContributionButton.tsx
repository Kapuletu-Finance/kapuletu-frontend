"use client";

import AddContributionFormDialog from "@/features/contributions/components/AddContributionFormDialog";
import ButtonWithIcon from "@/features/shared/components/ButtonWithIcon";

const AddContributionButton = () => {
  return (
    <AddContributionFormDialog>
      <ButtonWithIcon
        label="Add a contribution"
        description="Record a new payment"
        iconName="add-circle"
      />
    </AddContributionFormDialog>
  );
};

export default AddContributionButton;
