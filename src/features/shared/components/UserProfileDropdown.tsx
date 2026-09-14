"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import type React from "react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AUTH_EVENTS, AUTH_LOCAL_STORAGE_KEYS } from "@/features/auth/keys";
import { useLogoutMutation } from "@/features/auth/services/mutations";
import { useGetMeQuery } from "@/features/auth/services/queries";
import type { UserRole } from "@/features/auth/utils";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface UserProfileDropdownProps {
  role: UserRole;
}

const ThemeDropdownItem = () => {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <IconLibrary name="sun" className="w-4 h-4 mr-2" />
      ) : (
        <IconLibrary name="moon" className="w-4 h-4 mr-2" />
      )}
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </DropdownMenuItem>
  );
};

const SignOutDropdownItem = () => {
  const logoutMutation = useLogoutMutation();
  return (
    <DropdownMenuItem
      className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? (
        <IconLibrary name="loading" className="w-4 h-4 mr-2" />
      ) : (
        <IconLibrary name="log-out" className="w-4 h-4 mr-2" />
      )}
      Sign Out
    </DropdownMenuItem>
  );
};

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ role }) => {
  const { data: user } = useGetMeQuery();
  const [isAlertDismissed, setIsAlertDismissed] = useState(true);

  useEffect(() => {
    setIsAlertDismissed(
      localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.VERIFY_EMAIL_ALERT_DISMISSED) === "true",
    );

    const handleEvent = () =>
      setIsAlertDismissed(
        localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.VERIFY_EMAIL_ALERT_DISMISSED) === "true",
      );
    window.addEventListener(AUTH_EVENTS.VERIFY_EMAIL_DISMISSED, handleEvent);
    return () => window.removeEventListener(AUTH_EVENTS.VERIFY_EMAIL_DISMISSED, handleEvent);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="h-10 w-10 rounded-md bg-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/30 transition-colors relative overflow-hidden border border-border shrink-0">
          <IconLibrary name="member" className="size-5 text-primary" />
          {user && !user.email_verified && isAlertDismissed && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-burnt-amber rounded-full border-2 border-background" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="bottom" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal p-0">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted overflow-hidden relative">
                <IconLibrary name="member" className="size-4 text-muted-foreground" />
                {user && !user.email_verified && isAlertDismissed && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-burnt-amber rounded-full border-2 border-background" />
                )}
              </div>
              <div className="flex flex-col flex-1 leading-none overflow-hidden text-left">
                <span className="font-semibold truncate">
                  {user ? `${user.first_name} ${user.last_name}` : "My Account"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user ? user.email : <span className="capitalize">{role} User</span>}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user && !user.email_verified && (
            <DropdownMenuItem>
              <Link
                href="/verify-email"
                className="cursor-pointer flex items-center w-full text-burnt-amber"
              >
                <IconLibrary name="audit" className="w-4 h-4 mr-2" />
                Verify Email
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Link href="/subscriptions" className="cursor-pointer flex items-center w-full">
              <IconLibrary name="credit-card" className="w-4 h-4 mr-2" />
              Billing & Subscriptions
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings" className="cursor-pointer flex items-center w-full">
              <IconLibrary name="settings" className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>
          <ThemeDropdownItem />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <SignOutDropdownItem />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
