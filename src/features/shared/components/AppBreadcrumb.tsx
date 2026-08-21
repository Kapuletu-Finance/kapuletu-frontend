"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { UserRole } from "@/features/auth/utils";

interface AppBreadcrumbProps {
  role?: UserRole | string | null;
}

const formatSegment = (segment: string): string => {
  const lower = segment.toLowerCase();

  // Known route mappings
  const knownLabels: Record<string, string> = {
    admin: "Home",
    treasurer: "Home",
    groups: "Groups",
    inbox: "Inbox",
    reports: "Reports",
    analytics: "Analytics",
    settings: "Settings",
    audit: "Audit Logs",
    logs: "Audit Logs",
    campaigns: "Campaigns",
    contributions: "Contributions",
    dashboard: "Dashboard",
    overview: "Overview",
    users: "Users",
    finance: "Finance",
    broadcast: "Broadcast",
    support: "Support",
    "ai-governance": "AI Governance",
    feedback: "Feedback",
  };

  if (knownLabels[lower]) {
    return knownLabels[lower];
  }

  // Check if it's a UUID, CUID, or MongoDB ObjectId (24 hex chars)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
  const isCuid = /^c[a-z0-9]{24}$/i.test(segment);
  const isObjectId = /^[0-9a-f]{24}$/i.test(segment);

  if (isUuid || isCuid || isObjectId) {
    return `Details (${segment.slice(-4).toUpperCase()})`;
  }

  if (segment.toUpperCase().startsWith("FBK-")) {
    return segment.toUpperCase();
  }

  // Otherwise, format slug (replace hyphens with spaces and capitalize words)
  return decodeURIComponent(segment)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const AppBreadcrumb: React.FC<AppBreadcrumbProps> = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((segment) => Boolean(segment));

  if (segments.length === 0) {
    return null;
  }

  // If on the root role path (e.g. /treasurer), display Home > Dashboard
  if (segments.length === 1 && (segments[0] === "treasurer" || segments[0] === "admin")) {
    return (
      <Breadcrumb className="py-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const items = segments
    .map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const isLast = index === segments.length - 1;
      const label = formatSegment(segment);

      return {
        href,
        isLast,
        label,
        segment,
      };
    })
    .filter((item) => item.segment.toLowerCase() !== "campaigns");

  return (
    <Breadcrumb className="py-1">
      <BreadcrumbList>
        {items.map((item, index) => {
          // Smart truncation if navigation tree is deep (> 4 levels)
          if (items.length > 4 && index > 1 && index < items.length - 2) {
            if (index === 2) {
              return (
                <React.Fragment key="ellipsis">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                </React.Fragment>
              );
            }
            return null;
          }

          return (
            <React.Fragment key={item.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage className="font-semibold text-foreground">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
