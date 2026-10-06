"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewFeedbackCountQuery } from "@/features/admin/services/queries";
import { useGetMeQuery } from "@/features/auth/services/queries";
import type { UserRole } from "@/features/auth/utils";
import { useGetAdminCommentsQuery } from "@/features/blogs/services/queries";
import { usePendingInboxCountQuery } from "@/features/inbox/services/queries";
import AppBreadcrumb from "@/features/shared/components/AppBreadcrumb";
import CurrentPlanCard from "@/features/shared/components/CurrentPlanCard";
import { GlobalSearch } from "@/features/shared/components/GlobalSearch";
import { GroupsFlyoutPanel } from "@/features/shared/components/GroupsFlyout";
import type { IconName } from "@/features/shared/components/IconLibrary";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { KapuletuAssistant } from "@/features/shared/components/KapuletuAssistant";
import NotificationsDropdown from "@/features/shared/components/NotificationsDropdown";
import { SecurityNudgeModal } from "@/features/shared/components/SecurityNudgeModal";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";
import { TrialBanner } from "@/features/shared/components/TrialBanner";
import { UserProfileDropdown } from "@/features/shared/components/UserProfileDropdown";
import { VerifyEmailAlert } from "@/features/shared/components/VerifyEmailAlert";
import { usePendingTicketsCountQuery } from "@/features/support/services/queries";
import { cn } from "@/lib/utils";

const getAdminLinks = (
  role: UserRole,
  permissions: string[] = [],
): { href: string; label: string; icon: IconName }[] => {
  const allLinks = [
    {
      href: "/admin/overview",
      icon: "analytics" as IconName,
      label: "Overview",
      allowedRoles: ["super_admin", "admin", "ceo"],
      permission: "view_overview",
    },
    {
      href: "/admin/performance",
      icon: "activity" as IconName,
      label: "Platform Performance",
      allowedRoles: ["super_admin", "admin", "ceo"],
      permission: "view_overview",
    },
    {
      href: "/admin/users",
      icon: "group" as IconName,
      label: "Users",
      allowedRoles: ["super_admin", "admin", "ceo"],
      permission: "manage_users",
    },
    {
      href: "/admin/finance/plans",
      icon: "credit-card" as IconName,
      label: "Billing & Plans",
      allowedRoles: ["super_admin", "admin", "ceo"],
      permission: "manage_finance",
    },
    {
      href: "/admin/finance",
      icon: "credit-card" as IconName,
      label: "Finance",
      allowedRoles: ["super_admin", "admin", "ceo"],
      permission: "manage_finance",
    },
    {
      href: "/admin/communications",
      icon: "mail" as IconName,
      label: "Communications",
      allowedRoles: ["super_admin", "admin", "ceo"],
      permission: "manage_support",
    },
    {
      href: "/admin/blogs",
      icon: "report" as IconName,
      label: "Blogs",
      allowedRoles: ["super_admin", "admin", "ceo"],
      permission: "manage_blogs",
    },
    {
      href: "/admin/feedback",
      icon: "feedback" as IconName,
      label: "Feedback",
      allowedRoles: ["super_admin", "admin", "ceo"],
      permission: "manage_support",
    },
    {
      href: "/admin/support",
      icon: "ticket" as IconName,
      label: "Support",
      allowedRoles: ["super_admin", "admin", "ceo"],
      permission: "manage_support",
    },
    {
      href: "/admin/employees",
      icon: "group" as IconName,
      label: "Employees",
      allowedRoles: ["super_admin", "ceo"],
      permission: "manage_employees",
    },
    {
      href: "/admin/approvals",
      icon: "shield-ellipsis" as IconName,
      label: "Approvals Queue",
      allowedRoles: ["super_admin", "admin", "ceo"],
      permission: "manage_approvals",
    },
    {
      href: "/admin/ai-governance",
      icon: "brain" as IconName,
      label: "AI Governance",
      allowedRoles: ["super_admin", "admin", "ceo"],
      permission: "manage_ai",
    },
    {
      href: "/admin/audit",
      icon: "shield-ellipsis" as IconName,
      label: "Audit Logs",
      allowedRoles: ["super_admin", "admin", "ceo"],
      permission: "view_audit_logs",
    },
    {
      href: "/admin/profile",
      icon: "settings" as IconName,
      label: "Settings",
      allowedRoles: ["super_admin", "admin", "ceo"],
      permission: "manage_settings",
    },
  ];
  return allLinks
    .filter((link) => {
      if (link.allowedRoles.includes(role as any)) return true;
      if (link.permission && permissions.includes(link.permission)) return true;
      return false;
    })
    .map(({ href, icon, label }) => ({ href, icon, label }));
};

const TREASURER_LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: "/treasurer", icon: "home", label: "Dashboard" },
  { href: "/treasurer/groups", icon: "group", label: "Groups" },
  { href: "/treasurer/inbox", icon: "mail", label: "Inbox" },
  { href: "/notifications", icon: "notification", label: "Notifications" },
  // { href: "/treasurer/reports", icon: "report", label: "Reports" },
  // { href: "/treasurer/analytics", icon: "analytics", label: "Analytics" },
  { href: "/support", icon: "ticket", label: "Help Center" },
  { href: "/treasurer/settings", icon: "settings", label: "Settings" },
];

interface AppSidebarProps {
  links: { href: string; label: string; icon: IconName }[];
  role: UserRole;
  pendingInboxCount?: number;
  newFeedbackCount?: number;
  pendingTicketsCount?: number;
  pendingCommentsCount?: number;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  links,
  role,
  pendingInboxCount = 0,
  newFeedbackCount = 0,
  pendingTicketsCount = 0,
  pendingCommentsCount = 0,
}) => {
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <Sidebar collapsible="icon" className="border-border bg-background">
      {/* Notch Toggle for Desktop */}
      {!isMobile && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-4 top-7 z-50 hidden md:flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background shadow-md hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-all hover:scale-110"
        >
          <IconLibrary name={isCollapsed ? "chevron-right" : "chevron-left"} className="size-4" />
        </button>
      )}

      <SidebarHeader className="py-6 flex flex-col items-center justify-center relative">
        <div className="flex flex-col items-center justify-center transition-all duration-200 group-data-[collapsible=icon]:px-2">
          <SiteLogo
            variant={isCollapsed && !isMobile ? "icon" : "full"}
            className="text-2xl"
            logoClassName={`w-auto object-contain transition-all duration-200 ${isCollapsed && !isMobile ? "h-10" : "h-10"}`}
          />
        </div>
        <div className="absolute bottom-0 w-4/5 h-px bg-linear-to-r from-transparent via-border to-transparent group-data-[collapsible=icon]:w-1/2" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1.5">
            {links.map((link) => {
              const isRootLink = link.href === "/treasurer";
              const isActive = isRootLink ? pathname === link.href : pathname.startsWith(link.href);

              if (link.label === "Groups" && role !== "admin" && role !== "super_admin") {
                const isGroupsActive = pathname.startsWith("/treasurer/groups");
                return (
                  <SidebarMenuItem key={link.href}>
                    {/* Anchor wrapper for the flyout positioning */}
                    <div ref={anchorRef} className="relative">
                      <div
                        className={cn(
                          "flex items-center transition-all duration-300 py-1.5 px-3 group-data-[collapsible=icon]:px-2 rounded-lg group",
                          isGroupsActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {/* Clickable section: icon + label → navigates to /groups */}
                        <Link
                          href={link.href}
                          onClick={() => {
                            setIsFlyoutOpen(false);
                            if (isMobile) setOpenMobile(false);
                          }}
                          className="flex items-center gap-3 flex-1 min-w-0 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0!"
                        >
                          <div
                            className={cn(
                              "relative flex items-center justify-center shrink-0 size-8 transition-colors duration-300 rounded-md",
                              isGroupsActive
                                ? "bg-primary text-primary-foreground"
                                : "text-primary",
                            )}
                          >
                            <IconLibrary
                              name={link.icon}
                              className="size-4.5 transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <span className="text-base tracking-tight truncate group-data-[collapsible=icon]:hidden">
                            {link.label}
                          </span>
                        </Link>

                        {/* Right-pointing arrow — opens flyout. Hidden when sidebar is icon-only (tooltip handles it) */}
                        {!isCollapsed && (
                          <button
                            type="button"
                            aria-label="Browse groups"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsFlyoutOpen((prev) => !prev);
                            }}
                            className={cn(
                              "shrink-0 p-1.5 rounded-md transition-colors hover:bg-primary/10",
                              isFlyoutOpen && "bg-primary/10 text-primary",
                            )}
                          >
                            <IconLibrary
                              name="chevron-right"
                              className={cn(
                                "size-4 text-muted-foreground transition-transform duration-200",
                                isFlyoutOpen && "rotate-90 text-primary",
                              )}
                            />
                          </button>
                        )}
                      </div>

                      {/* Flyout panel — anchored to this row */}
                      <GroupsFlyoutPanel
                        open={isFlyoutOpen}
                        onClose={() => {
                          setIsFlyoutOpen(false);
                          if (isMobile) setOpenMobile(false);
                        }}
                        anchorRef={anchorRef}
                      />
                    </div>
                  </SidebarMenuItem>
                );
              }

              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    tooltip={link.label}
                    size="lg"
                    onClick={() => {
                      if (isMobile) {
                        setOpenMobile(false);
                      }
                    }}
                    className={cn(
                      "transition-all duration-300 py-3 px-3 group-data-[collapsible=icon]:p-2 rounded-lg group",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                    )}
                    render={
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0!"
                      >
                        <div
                          className={cn(
                            "relative flex items-center justify-center shrink-0 size-8 transition-colors duration-300 rounded-md",
                            isActive ? "bg-primary text-primary-foreground" : "text-primary",
                          )}
                        >
                          <IconLibrary
                            name={link.icon}
                            className="size-4.5 transition-transform duration-300 group-hover:scale-110"
                          />
                          {link.label === "Inbox" && pendingInboxCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold leading-none shadow-md bg-primary text-primary-foreground">
                              {pendingInboxCount > 99 ? "99+" : pendingInboxCount}
                            </span>
                          )}
                          {link.label === "Feedback" && newFeedbackCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold leading-none shadow-md bg-primary text-primary-foreground">
                              {newFeedbackCount > 99 ? "99+" : newFeedbackCount}
                            </span>
                          )}
                          {link.label === "Help Center" && pendingTicketsCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold leading-none shadow-md bg-primary text-primary-foreground">
                              {pendingTicketsCount > 99 ? "99+" : pendingTicketsCount}
                            </span>
                          )}
                          {link.label === "Blogs" && pendingCommentsCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold leading-none shadow-md bg-destructive text-destructive-foreground">
                              {pendingCommentsCount > 99 ? "99+" : pendingCommentsCount}
                            </span>
                          )}
                        </div>
                        <span className="text-base tracking-tight truncate group-data-[collapsible=icon]:hidden">
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

      {role !== "admin" && role !== "super_admin" && (
        <SidebarFooter className="gap-2">
          <CurrentPlanCard />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
};

interface SidebarLayoutClientProps {
  children: React.ReactNode;
  role: UserRole;
}

const MobileSidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="md:hidden flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-muted text-muted-foreground transition-colors -ml-1"
      aria-label="Toggle Menu"
    >
      <IconLibrary name="menu" className="size-5" />
    </button>
  );
};

import { useHeartbeat } from "@/hooks/useHeartbeat";

export const SidebarLayoutClient: React.FC<SidebarLayoutClientProps> = ({ children, role }) => {
  const isInternalEmployee = role !== "treasurer";
  const links = isInternalEmployee ? getAdminLinks(role) : TREASURER_LINKS;
  useHeartbeat();
  const { data: user, isLoading } = useGetMeQuery();
  const { data: pendingCount } = usePendingInboxCountQuery();
  const { data: feedbackCount } = useNewFeedbackCountQuery({ enabled: isInternalEmployee });
  const { data: ticketsCount } = usePendingTicketsCountQuery({ enabled: !isInternalEmployee });
  const { data: pendingComments } = useGetAdminCommentsQuery("pending", {
    enabled: isInternalEmployee,
  });
  const pendingCommentsCount = pendingComments?.length || 0;
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "GOOD MORNING" : hour < 18 ? "GOOD AFTERNOON" : "GOOD EVENING";

  return (
    <>
      <SidebarProvider>
        <AppSidebar
          links={links}
          role={role}
          pendingInboxCount={pendingCount ?? 0}
          newFeedbackCount={isInternalEmployee ? (feedbackCount ?? 0) : 0}
          pendingTicketsCount={!isInternalEmployee ? (ticketsCount ?? 0) : 0}
          pendingCommentsCount={pendingCommentsCount}
        />

        <SidebarInset className="bg-background flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="h-20 shrink-0 flex items-center justify-between px-4 sm:px-6 bg-background border-b border-border z-10 sticky top-0 transition-colors">
            <div className="flex items-center gap-3 sm:gap-4">
              <MobileSidebarTrigger />

              {/* Mobile-only Logo */}
              <div className="flex md:hidden mr-2">
                <SiteLogo variant="icon" logoClassName="h-8 w-auto object-contain" />
              </div>

              <div className="hidden sm:flex sm:flex-col">
                <h2 className="text-base tracking-tight uppercase">
                  {greeting},{" "}
                  {isLoading ? (
                    <Skeleton className="h-5 w-24 inline-block align-middle" />
                  ) : user ? (
                    `${user.first_name}.`
                  ) : (
                    "USER."
                  )}
                </h2>
                <span className="text-[10px] font-semibold text-refined-blue border border-refined-blue/30 bg-refined-blue/5 rounded-full px-2 py-0.5 w-fit mt-0.5">
                  {isInternalEmployee ? "Admin Workspace" : "Treasurer Workspace"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="relative shrink-0 hidden sm:flex items-center gap-2 h-9 w-60 justify-start px-3 text-sm text-muted-foreground bg-muted hover:bg-muted/80 rounded-md border border-border shadow-sm transition-colors"
                aria-label="Search"
              >
                <IconLibrary name="search" className="h-4 w-4" />
                <span>Search...</span>
              </button>
              <Link
                href="/support"
                className="relative shrink-0 size-9 inline-flex items-center justify-center hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                aria-label="Help and Support"
              >
                <IconLibrary name="help" className="h-5 w-5 text-muted-foreground" />
              </Link>
              <ThemeToggle variant="ghost" className="text-muted-foreground h-9 w-9" />
              <NotificationsDropdown />
              <UserProfileDropdown role={role} />
            </div>
          </header>

          {/* Sticky Breadcrumb Bar */}
          <div className="bg-muted px-4 md:px-6 lg:px-8 py-3 border-b border-border shrink-0 z-10 sticky top-0 shadow-sm">
            <div className="max-w-6xl mx-auto">
              <AppBreadcrumb role={role} />
            </div>
          </div>

          <ScrollArea
            id="main-scroll-container"
            className="flex-1 min-h-0 bg-muted transition-colors"
            orientation="vertical"
          >
            <main className="p-4 md:p-6 lg:p-8">
              <div className="max-w-6xl mx-auto space-y-4">
                <VerifyEmailAlert />
                {!isInternalEmployee && <TrialBanner />}
                {children}
              </div>
            </main>
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>

      <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />

      {/* Floating assistant widget — treasurer workspace only */}
      {!isInternalEmployee && <KapuletuAssistant />}

      {/* 2FA Nudge Modal */}
      <SecurityNudgeModal />
    </>
  );
};
