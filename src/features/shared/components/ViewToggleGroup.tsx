import { parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { Button } from "@/components/ui/button";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export type ViewMode = "table" | "grid" | "stack";

export const ViewToggleGroup = () => {
  const isMobile = useIsMobile();
  const [view, setView] = useQueryState(
    "view",
    parseAsString.withDefault(isMobile ? "stack" : "table")
  );

  return (
    <div className="flex items-center p-1 bg-muted/50 rounded-lg border border-border">
      <Button
        variant={view === "table" ? "secondary" : "ghost"}
        size="icon"
        className={cn("w-8 h-8 rounded-md", view === "table" && "shadow-sm bg-background")}
        onClick={() => setView("table")}
        title="Table View"
      >
        <IconLibrary name="list" className="w-4 h-4" />
      </Button>
      <Button
        variant={view === "grid" ? "secondary" : "ghost"}
        size="icon"
        className={cn("w-8 h-8 rounded-md", view === "grid" && "shadow-sm bg-background")}
        onClick={() => setView("grid")}
        title="Grid View"
      >
        <IconLibrary name="grid" className="w-4 h-4" />
      </Button>
      <Button
        variant={view === "stack" ? "secondary" : "ghost"}
        size="icon"
        className={cn("w-8 h-8 rounded-md", view === "stack" && "shadow-sm bg-background")}
        onClick={() => setView("stack")}
        title="Stack View"
      >
        <IconLibrary name="align-justify" className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ViewToggleGroup;
