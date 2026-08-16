"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import IconLibrary from "@/features/shared/components/IconLibrary";
import type { CampaignOverview, GroupOverview } from "@/features/shared/types";
import { useWorkspaceOverviewQuery } from "@/features/treasurer/services/queries";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// ─── Campaign Sub-Panel ────────────────────────────────────────────────────
interface CampaignSubPanelProps {
  campaigns: CampaignOverview[];
  groupSlug: string | null | undefined;
  groupId: string;
  onNavigate: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

const CampaignSubPanel = ({
  campaigns,
  groupSlug,
  groupId,
  onNavigate,
  anchorRef,
}: CampaignSubPanelProps) => {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const effectiveGroupSlug = groupSlug || groupId;
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (isMobile) return;
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({ top: rect.top + window.scrollY, left: rect.right + window.scrollX + 4 });
  }, [anchorRef, isMobile]);

  const content = (
    <div
      style={
        !isMobile && pos ? { position: "absolute", top: pos.top, left: pos.left, zIndex: 9999 } : {}
      }
      className={cn(
        "bg-popover border border-border p-1",
        isMobile
          ? "w-full border-t border-x-0 border-b-0 rounded-none shadow-none pl-4 pb-2"
          : "rounded-lg shadow-xl min-w-[200px] max-w-[240px] animate-in fade-in-0 zoom-in-95 duration-100",
      )}
    >
      {campaigns.map((c) => {
        const effectiveCampaignSlug = c.campaign_slug || c.campaign_id;
        const href = `/treasurer/groups/${effectiveGroupSlug}/campaigns/${effectiveCampaignSlug}/contributions`;
        const isActive = pathname.includes(`/campaigns/${effectiveCampaignSlug}`);
        return (
          <Link
            key={c.campaign_id}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive && "bg-primary/10 text-primary font-medium",
            )}
          >
            <IconLibrary
              name="add-circle"
              className="size-3.5 shrink-0 fill-primary text-background"
            />
            <span className="truncate">{c.title}</span>
          </Link>
        );
      })}
    </div>
  );

  if (isMobile) return content;

  if (!pos) return null;
  return createPortal(content, document.body);
};

// ─── Group Row with optional campaign sub-panel ─────────────────────────────
interface GroupRowProps {
  group: GroupOverview;
  campaigns: CampaignOverview[];
  onNavigate: () => void;
}

const GroupRow = ({ group, campaigns, onNavigate }: GroupRowProps) => {
  const isMobile = useIsMobile();
  const [isSubOpen, setIsSubOpen] = useState(false);
  const rowRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const effectiveGroupSlug = group.slug || group.group_id;
  const isActive = pathname.includes(`/groups/${effectiveGroupSlug}`);
  const hasCampaigns = campaigns.length > 0;

  return (
    <li
      ref={rowRef}
      className="relative list-none"
      onMouseEnter={() => hasCampaigns && setIsSubOpen(true)}
      onMouseLeave={() => setIsSubOpen(false)}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
          isActive && "bg-primary/10 text-primary font-medium",
        )}
      >
        <Link
          href={`/treasurer/groups/${effectiveGroupSlug}`}
          onClick={onNavigate}
          className="flex items-center gap-2 flex-1 min-w-0 text-sm"
        >
          <IconLibrary name="group" className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{group.name}</span>
        </Link>
        {hasCampaigns && !isMobile && (
          <button
            type="button"
            aria-label={`View campaigns for ${group.name}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsSubOpen((prev) => !prev);
            }}
            className="shrink-0 p-0.5 rounded hover:bg-accent"
          >
            <IconLibrary
              name="chevron-right"
              className={cn(
                "size-3.5 text-muted-foreground transition-transform duration-200",
                isSubOpen && "rotate-90",
              )}
            />
          </button>
        )}
      </div>

      {hasCampaigns && isSubOpen && !isMobile && (
        <CampaignSubPanel
          campaigns={campaigns}
          groupSlug={group.slug}
          groupId={group.group_id}
          onNavigate={() => {
            setIsSubOpen(false);
            onNavigate();
          }}
          anchorRef={rowRef}
        />
      )}
    </li>
  );
};

// ─── Main Flyout Panel ─────────────────────────────────────────────────────
interface GroupsFlyoutProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

export const GroupsFlyoutPanel = ({ open, onClose, anchorRef }: GroupsFlyoutProps) => {
  const { data: overview } = useWorkspaceOverviewQuery();
  const groups = overview?.active_groups ?? [];
  const allCampaigns = overview?.recent_campaigns ?? [];
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Group campaigns by group_id for O(1) lookup
  const campaignsByGroup = allCampaigns.reduce<Record<string, CampaignOverview[]>>((acc, c) => {
    if (!acc[c.group_id]) acc[c.group_id] = [];
    acc[c.group_id].push(c);
    return acc;
  }, {});

  const isMobile = useIsMobile();
  // Compute position from anchor's bounding rect
  useEffect(() => {
    if (!open || !anchorRef.current || isMobile) return;
    const update = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.top + window.scrollY, left: rect.right + window.scrollX + 8 });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, anchorRef, isMobile]);

  if (!open || (!isMobile && !pos)) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop click dismiss is an established UX pattern */}
      <div
        className={cn("fixed inset-0 z-[9990]", isMobile ? "bg-black/60" : "")}
        role="presentation"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Flyout panel */}
      <div
        style={
          !isMobile && pos
            ? { position: "absolute", top: pos.top, left: pos.left, zIndex: 9999 }
            : { zIndex: 9999 }
        }
        className={cn(
          "bg-popover border border-border flex flex-col",
          isMobile
            ? "fixed bottom-0 left-0 right-0 w-full rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[85vh]"
            : "rounded-xl shadow-2xl min-w-[220px] max-w-[260px] py-2 px-1 animate-in fade-in-0 zoom-in-95 slide-in-from-left-2 duration-150",
        )}
      >
        {/* Header */}
        {isMobile && (
          <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-12 h-1.5 bg-muted rounded-full" />
          </div>
        )}
        <div className="px-4 py-2 sm:py-1.5 sm:px-3 mb-1 border-b border-border shrink-0">
          <p className="text-sm sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your Groups
          </p>
        </div>

        {/* Group list */}
        <ul className="overflow-y-auto overflow-x-hidden flex-1 sm:max-h-[60vh] max-h-full">
          {groups.length === 0 ? (
            <li className="text-sm text-muted-foreground px-4 py-3 list-none">No groups found.</li>
          ) : (
            groups.map((group) => (
              <GroupRow
                key={group.group_id}
                group={group}
                campaigns={campaignsByGroup[group.group_id] ?? []}
                onNavigate={onClose}
              />
            ))
          )}
        </ul>

        {/* Footer: View all link */}
        <div className="mt-1 pt-2 pb-2 sm:pb-0 sm:pt-1.5 border-t border-border px-4 sm:px-3 shrink-0">
          <Link
            href="/treasurer/groups"
            onClick={onClose}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View all groups
            <IconLibrary name="chevron-right" className="size-3" />
          </Link>
        </div>
      </div>
    </>,
    document.body,
  );
};
