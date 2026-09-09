"use client";

import ButtonWithIcon from "@/features/shared/components/ButtonWithIcon";
import CreateGroupDialogForm from "./CreateGroupDialogForm";

const CreateGroupButtonWithIcon = () => {
  return (
    <CreateGroupDialogForm>
      <ButtonWithIcon label="Create a group" description="Start a new group" iconName="group" />
    </CreateGroupDialogForm>
  );
};

export default CreateGroupButtonWithIcon;
