"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMeQuery } from "@/features/auth/services/queries";
import type { UserRole } from "@/features/auth/utils";
import AppBreadcrumb from "@/features/shared/components/AppBreadcrumb";
import CurrentPlanCard from "@/features/shared/components/CurrentPlanCard";
import type { IconName } from "@/features/shared/components/IconLibrary";
import IconLibrary from "@/features/shared/components/IconLibrary";
import NeedAssistanceCard from "@/features/shared/components/NeedAssistanceCard";
import NotificationsDropdown from "@/features/shared/components/NotificationsDropdown";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import { UserProfileDropdown } from "@/features/shared/components/UserProfileDropdown";
import { VerifyEmailAlert } from "@/features/shared/components/VerifyEmailAlert";
import { cn } from "@/lib/utils";

const ADMIN_LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", icon: "dashboard", label: "Dashboard" },
];

const TREASURER_LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: "/treasurer", icon: "home", label: "Dashboard" },
  { href: "/treasurer/groups", icon: "group", label: "Groups" },
  { href: "/treasurer/inbox", icon: "mail", label: "Inbox" },
  { href: "/treasurer/reports", icon: "report", label: "Reports" },
  { href: "/treasurer/analytics", icon: "analytics", label: "Analytics" },
  { href: "/treasurer/settings", icon: "settings", label: "Settings" },
];

interface AppSidebarProps {
  links: { href: string; label: string; icon: IconName }[];
  onOpenFaqs?: () => void;
  role: UserRole;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ links, onOpenFaqs, role }) => {
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-border bg-background">
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
          <SidebarMenu className="gap-2">
            {links.map((link) => {
              const isRootLink = link.href === "/treasurer" || link.href === "/admin";
              const isActive = isRootLink ? pathname === link.href : pathname.startsWith(link.href);

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
                      "transition-all duration-300 py-7 px-4 group-data-[collapsible=icon]:p-2 rounded-lg group",
                      isActive
                        ? "bg-primary/20 text-foreground font-medium"
                        : "hover:bg-muted/40 text-muted-foreground hover:text-foreground",
                    )}
                    render={
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0!"
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center shrink-0 size-10 transition-colors duration-300 rounded-md",
                            isActive ? "bg-primary text-primary-foreground" : "text-primary",
                          )}
                        >
                          <IconLibrary
                            name={link.icon}
                            className="size-5 transition-transform duration-300 group-hover:scale-110"
                          />
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
          <NeedAssistanceCard onOpenFaqs={onOpenFaqs} />
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

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaqsSection } from "@/features/landing-page/components/FaqsSection";

export const SidebarLayoutClient: React.FC<SidebarLayoutClientProps> = ({ children, role }) => {
  const isAdminOrSuperAdmin = role === "admin" || role === "super_admin";
  const links = isAdminOrSuperAdmin ? ADMIN_LINKS : TREASURER_LINKS;
  const { data: user, isLoading } = useGetMeQuery();
  const [isFaqsOpen, setIsFaqsOpen] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "GOOD MORNING" : hour < 18 ? "GOOD AFTERNOON" : "GOOD EVENING";

  return (
    <>
      <SidebarProvider>
        <AppSidebar links={links} onOpenFaqs={() => setIsFaqsOpen(true)} role={role} />

        <SidebarInset className="bg-background flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="h-20 shrink-0 flex items-center justify-between px-6 bg-background border-b border-border z-10 sticky top-0 transition-colors">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
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
                  {isAdminOrSuperAdmin ? "Admin Workspace" : "Treasurer Workspace"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NotificationsDropdown />
              <UserProfileDropdown role={role} />
            </div>
          </header>

          {/* Page Content */}
          <ScrollArea className="flex-1 min-h-0 bg-muted transition-colors">
            <main className="p-4 md:p-6 lg:p-8">
              <div className="max-w-6xl mx-auto space-y-4">
                <VerifyEmailAlert />
                <AppBreadcrumb role={role} />
                {children}
              </div>
            </main>
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>

      <Dialog open={isFaqsOpen} onOpenChange={setIsFaqsOpen}>
        <DialogContent
          className="max-w-4xl p-0 border-none bg-transparent shadow-none"
          showCloseButton={false}
        >
          <ScrollArea className="relative bg-background overflow-hidden max-h-[85vh]">
            <FaqsSection />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
