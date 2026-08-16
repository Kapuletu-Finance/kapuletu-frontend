"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import IconLibrary from "@/features/shared/components/IconLibrary";
import type { CampaignOverview, GroupOverview } from "@/features/shared/types";
import { useWorkspaceOverviewQuery } from "@/features/treasurer/services/queries";
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
  const pathname = usePathname();
  const effectiveGroupSlug = groupSlug || groupId;
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({ top: rect.top + window.scrollY, left: rect.right + window.scrollX + 4 });
  }, [anchorRef]);

  if (!pos) return null;

  return createPortal(
    <div
      style={{ position: "absolute", top: pos.top, left: pos.left, zIndex: 9999 }}
      className="bg-popover border border-border rounded-lg shadow-xl p-1 min-w-[200px] max-w-[240px] animate-in fade-in-0 zoom-in-95 duration-100"
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
    </div>,
    document.body,
  );
};

// ─── Group Row with optional campaign sub-panel ─────────────────────────────
interface GroupRowProps {
  group: GroupOverview;
  campaigns: CampaignOverview[];
  onNavigate: () => void;
}

const GroupRow = ({ group, campaigns, onNavigate }: GroupRowProps) => {
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
          href={`/treasurer/groups/${effectiveGroupSlug}/overview`}
          onClick={onNavigate}
          className="flex items-center gap-2 flex-1 min-w-0 text-sm"
        >
          <IconLibrary name="group" className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{group.name}</span>
        </Link>
        {hasCampaigns && (
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

      {hasCampaigns && isSubOpen && (
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

  // Compute position from anchor's bounding rect
  useEffect(() => {
    if (!open || !anchorRef.current) return;
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
  }, [open, anchorRef]);

  if (!open || !pos) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop click dismiss is an established UX pattern */}
      <div
        className="fixed inset-0 z-[9990]"
        role="presentation"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Flyout panel */}
      <div
        style={{ position: "absolute", top: pos.top, left: pos.left, zIndex: 9999 }}
        className={cn(
          "bg-popover border border-border rounded-xl shadow-2xl",
          "min-w-[220px] max-w-[260px] py-2 px-1",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-left-2 duration-150",
        )}
      >
        {/* Header */}
        <div className="px-3 py-1.5 mb-1 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your Groups
          </p>
        </div>

        {/* Group list */}
        <ul className="max-h-[60vh] overflow-y-auto overflow-x-visible">
          {groups.length === 0 ? (
            <li className="text-sm text-muted-foreground px-3 py-2 list-none">No groups found.</li>
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
        <div className="mt-1 pt-1.5 border-t border-border px-3">
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
