"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useHasCommsAccess } from "./shared";

const SECTIONS = [
  { href: "/admin/communications", label: "Overview", exact: true },
  { href: "/admin/communications/broadcasts", label: "Broadcasts" },
  { href: "/admin/communications/delivery", label: "Delivery log" },
  { href: "/admin/communications/suppressions", label: "Suppressions" },
  { href: "/admin/communications/templates", label: "Email templates" },
  { href: "/admin/communications/inquiries", label: "Inquiries" },
];

/** Section navigation and the manage_communications gate shared by every communications page. */
export const CommunicationsShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { allowed, isLoading } = useHasCommsAccess();

  if (isLoading) {
    return <Skeleton className="h-64 w-full max-w-7xl mx-auto" />;
  }

  if (!allowed) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-2">
        <h1 className="text-xl font-semibold">Communications is restricted</h1>
        <p className="text-sm text-muted-foreground">
          You need the Manage Communications permission. Ask a super admin to grant it from
          Employees.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <nav aria-label="Communications sections" className="border-b border-border overflow-x-auto">
        <ul className="flex gap-1 min-w-max">
          {SECTIONS.map((s) => {
            const active = s.exact ? pathname === s.href : pathname.startsWith(s.href);
            return (
              <li key={s.href}>
                <Link
                  href={s.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-block px-3 py-2 text-sm border-b-2 -mb-px transition-colors",
                    active
                      ? "border-primary text-foreground font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {children}
    </div>
  );
};
