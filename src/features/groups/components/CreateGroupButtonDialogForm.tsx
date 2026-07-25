"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import IconLibrary from "@/features/shared/components/IconLibrary";
import CreateGroupDialogForm from "./CreateGroupDialogForm";

const CreateGroupButtonDialogForm: React.FC = () => {
  return (
    <CreateGroupDialogForm>
      <Button className="h-11 bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:text-base">
        <IconLibrary name="add" className="mr-1.5 h-5 w-5" /> Create New Group
      </Button>
    </CreateGroupDialogForm>
  );
};

export default CreateGroupButtonDialogForm;
