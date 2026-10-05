import { parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export type ViewMode = "table" | "grid" | "stack";

export const ViewToggleGroup = () => {
  const isMobile = useIsMobile();
  const [view, setView] = useQueryState(
    "view",
    parseAsString.withDefault(isMobile ? "table" : "grid"),
  );

  return (
    <div className="flex items-center bg-background border border-border rounded-lg shadow-sm p-1">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "w-8 h-8 rounded-md transition-all",
          view === "grid"
            ? "bg-muted text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        )}
        onClick={() => setView("grid")}
        title="Grid View"
      >
        <IconLibrary name="grid" className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "w-8 h-8 rounded-md transition-all",
          view === "table" || view === "stack"
            ? "bg-muted text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        )}
        onClick={() => setView("table")}
        title="List View"
      >
        <IconLibrary name="list" className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ViewToggleGroup;
