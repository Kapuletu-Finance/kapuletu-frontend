"use client";

import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/features/auth/services/mutations";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const SignOutButton = () => {
  const logoutMutation = useLogoutMutation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => logoutMutation.mutate()}
      isLoading={logoutMutation.isPending}
      className="text-muted-foreground hover:text-foreground"
    >
      <IconLibrary name="log-out" className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  );
};
