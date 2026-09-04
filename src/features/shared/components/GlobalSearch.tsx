"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { useGlobalSearchQuery } from "@/features/treasurer/services/queries";

const PAGE_ACTIONS = [
  { title: "View Groups", href: "/treasurer/groups", icon: "group", alias: ["create group", "new group", "groups"] },
  { title: "Create Campaign", href: "/treasurer/groups", icon: "add-circle", alias: ["create campaign", "new campaign"] },
  { title: "Go to Inbox", href: "/treasurer/inbox", icon: "inbox", alias: ["inbox", "pending", "unprocessed"] },
  { title: "Workspace Settings", href: "/treasurer/settings", icon: "settings", alias: ["settings", "preferences", "2fa"] },
];

export const GlobalSearch = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: searchResults, isLoading } = useGlobalSearchQuery(debouncedQuery);

  // Reset search when closed
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setDebouncedQuery("");
    }
  }, [open]);

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenChange]);

  const query = debouncedQuery.toLowerCase();

  // Filter static page actions locally
  const matchingActions = PAGE_ACTIONS.filter((action) => {
    if (action.title.toLowerCase().includes(query)) return true;
    return action.alias.some((a) => a.toLowerCase().includes(query));
  });

  const groups = searchResults?.groups || [];
  const campaigns = searchResults?.campaigns || [];
  
  const showResults = query.length >= 2;
  const hasResults = matchingActions.length > 0 || groups.length > 0 || campaigns.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-border bg-card shadow-2xl">
        <DialogTitle className="sr-only">Global Search</DialogTitle>
        <DialogDescription className="sr-only">Search for groups, campaigns, and pages.</DialogDescription>
        <div className="flex items-center border-b border-border px-3">
          <IconLibrary name="search" className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Type a command or search..."
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            ESC
          </kbd>
        </div>

        <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 flex flex-col gap-1">
          {isLoading && query.length >= 2 && (
             <div className="py-6 flex justify-center items-center text-sm text-muted-foreground">
               <Loader2 className="h-4 w-4 animate-spin mr-2" /> Searching...
             </div>
          )}

          {!isLoading && showResults && !hasResults && (
            <div className="py-6 text-center text-sm text-muted-foreground">No results found.</div>
          )}
          
          {!showResults && query.length > 0 && query.length < 2 && (
             <div className="py-6 text-center text-xs text-muted-foreground">Type at least 2 characters to search...</div>
          )}

          {(!isLoading || groups.length > 0 || matchingActions.length > 0) && showResults && (
             <>
               {matchingActions.length > 0 && (
                 <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                    Actions
                  </div>
                  {matchingActions.map((action) => (
                    <Link
                      key={action.title}
                      href={action.href}
                      onClick={() => onOpenChange(false)}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <IconLibrary name={action.icon as any} className="mr-2 h-4 w-4" />
                      <span>{action.title}</span>
                    </Link>
                  ))}
                 </>
               )}

               {groups.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                    Groups
                  </div>
                  {groups.map((group) => (
                    <Link
                      key={group.group_id}
                      href={`/treasurer/groups/${group.slug || group.group_id}`}
                      onClick={() => onOpenChange(false)}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <IconLibrary name="group" className="mr-2 h-4 w-4" />
                      <span>{group.name}</span>
                    </Link>
                  ))}
                </>
               )}

               {campaigns.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                    Campaigns
                  </div>
                  {campaigns.map((campaign) => (
                    <Link
                      key={campaign.campaign_id}
                      href={`/treasurer/groups/${campaign.group_slug || campaign.group_id}/campaigns/${campaign.campaign_slug || campaign.campaign_id}/contributions`}
                      onClick={() => onOpenChange(false)}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <IconLibrary
                        name="add-circle"
                        className="mr-2 h-4 w-4 fill-primary text-background"
                      />
                      <span>{campaign.title}</span>
                      <span className="ml-2 text-xs text-muted-foreground">in {campaign.group_name}</span>
                    </Link>
                  ))}
                </>
               )}
             </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
