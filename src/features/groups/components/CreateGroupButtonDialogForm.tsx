"use client";

import type * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetMySubscriptionQuery } from "@/features/auth/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { LimitBouncerModal } from "@/features/shared/components/LimitBouncerModal";
import CreateGroupDialogForm from "./CreateGroupDialogForm";

const CreateGroupButtonDialogForm: React.FC = () => {
  const { data: subscription } = useGetMySubscriptionQuery();
  const [showLimitBouncer, setShowLimitBouncer] = useState(false);

  // Parse usage "1/5"
  const groupUsage = subscription?.usage?.groups || "0/1";
  const [currentGroupsStr, maxGroupsStr] = groupUsage.split("/");
  const currentGroups = parseInt(currentGroupsStr, 10);
  const maxGroups = parseInt(maxGroupsStr, 10);
  const isLimitReached = currentGroups >= maxGroups;

  const handleCreateClick = (e: React.MouseEvent) => {
    if (isLimitReached) {
      e.preventDefault();
      e.stopPropagation();
      setShowLimitBouncer(true);
    }
  };

  return (
    <>
      <CreateGroupDialogForm>
        <Button
          className="h-11 bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:text-base"
          onClick={handleCreateClick}
        >
          <IconLibrary name="add" className="mr-1.5 h-5 w-5" /> Create New Group
        </Button>
      </CreateGroupDialogForm>

      <LimitBouncerModal
        isOpen={showLimitBouncer}
        onClose={() => setShowLimitBouncer(false)}
        limitType="groups"
      />
    </>
  );
};

export default CreateGroupButtonDialogForm;
