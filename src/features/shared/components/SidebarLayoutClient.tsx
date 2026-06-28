"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRightLeft,
  BookOpen,
  ChevronDown,
  ChevronsUpDown,
  GalleryVerticalEnd,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Moon,
  Settings,
  ShieldAlert,
  Sun,
  User as UserIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import type React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogoutMutation } from "@/features/auth/services/mutations";
import { useGetMeQuery } from "@/features/auth/services/queries";
import type { UserRole } from "@/features/auth/utils";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import { VerifyEmailAlert } from "@/features/shared/components/VerifyEmailAlert";
import { cn } from "@/lib/utils";

const ADMIN_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/groups", icon: Users, label: "Groups" },
  { href: "/admin/audit/logs", icon: ShieldAlert, label: "Audit Logs" },
];

const TREASURER_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/treasurer/transactions", icon: ArrowRightLeft, label: "Transactions" },
  { href: "/treasurer/ledger", icon: BookOpen, label: "Ledger" },
  { href: "/treasurer/campaigns", icon: Megaphone, label: "Campaigns" },
  { href: "/treasurer/members", icon: Users, label: "Members" },
];

const WorkspaceSwitcher = () => (
  <div className="relative group hidden sm:block">
    <select
      className="appearance-none bg-muted/80 hover:bg-muted text-foreground text-sm font-medium pl-3 pr-8 py-1.5 rounded-md cursor-pointer outline-none transition-colors border border-transparent hover:border-border shadow-sm"
      aria-label="Select Workspace"
    >
      <option value="chama-1">Workspace Alpha</option>
      <option value="chama-2">Workspace Beta</option>
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none group-hover:text-foreground transition-colors" />
  </div>
);

const ThemeDropdownItem = () => {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
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
      <LogOut className="w-4 h-4 mr-2" />
      {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
    </DropdownMenuItem>
  );
};

const AppSidebar = ({
  role,
  links,
}: {
  role: UserRole;
  links: { href: string; label: string; icon: LucideIcon }[];
}) => {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { data: user } = useGetMeQuery();

  return (
    <Sidebar collapsible="icon" className="border-border">
      <SidebarHeader className="border-b border-border/50">
        <div className="flex flex-col items-start justify-center gap-0.5 px-6 py-6 transition-all duration-200 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:items-center h-20">
          <SiteLogo
            variant={isCollapsed && !isMobile ? "icon" : "full"}
            className="text-2xl"
            logoClassName={`w-auto object-contain transition-all duration-200 ${isCollapsed && !isMobile ? "h-10" : "h-7"}`}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    tooltip={link.label}
                    size="lg"
                    className={cn(
                      "transition-all duration-300 py-7 px-5 group-data-[collapsible=icon]:p-2 rounded-2xl group",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                        : "hover:bg-muted/80 text-muted-foreground hover:text-foreground",
                    )}
                    render={
                      <Link
                        href={link.href}
                        className="flex items-center gap-4 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0!"
                      >
                        <Icon
                          className={cn(
                            "size-6 transition-transform duration-300 group-hover:scale-110 shrink-0",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-primary",
                          )}
                        />
                        <span className="text-lg tracking-tight truncate group-data-[collapsible=icon]:hidden">
                          {link.label}
                        </span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2 w-full p-2 hover:bg-muted cursor-pointer rounded-md transition-colors group-data-[collapsible=icon]:justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0 overflow-hidden">
                <UserIcon className="size-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden flex-1 text-left">
                <span className="text-sm font-semibold text-foreground truncate leading-tight">
                  {user ? `${user.first_name} ${user.last_name}` : "My Account"}
                </span>
                <span className="text-xs text-muted-foreground truncate leading-tight">
                  {user ? user.email : <span className="capitalize">{role} User</span>}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden shrink-0" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--anchor-width] min-w-56"
            align="end"
            side="right"
            sideOffset={12}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal p-0">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted overflow-hidden">
                    <UserIcon className="size-4 text-muted-foreground" />
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
              <DropdownMenuItem>
                <Link href="/settings" className="cursor-pointer flex items-center w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <ThemeDropdownItem />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <SignOutDropdownItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export const SidebarLayoutClient = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) => {
  const isTreasurer = role === "treasurer";
  const links = role === "admin" ? ADMIN_LINKS : TREASURER_LINKS;

  return (
    <SidebarProvider>
      <AppSidebar role={role} links={links} />

      <SidebarInset className="bg-background flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md border-b border-border z-10 sticky top-0 transition-colors">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="font-semibold text-foreground tracking-tight text-sm hidden sm:block">
              {role === "admin" ? "Admin Dashboard" : "Treasurer Dashboard"}
            </div>
          </div>

          <div className="flex items-center space-x-4">{isTreasurer && <WorkspaceSwitcher />}</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-background transition-colors">
          <div className="max-w-6xl mx-auto space-y-4">
            <VerifyEmailAlert />
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
