import { parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { useIsMobile } from "@/hooks/use-mobile";

export type ViewMode = "table" | "grid" | "stack";

export const ViewToggleGroup = () => {
  const isMobile = useIsMobile();
  const [view, setView] = useQueryState(
    "view",
    parseAsString.withDefault(isMobile ? "stack" : "table"),
  );

  const toggleView = () => {
    setView((prev) => (prev === "grid" ? "table" : "grid"));
  };

  const isGrid = view === "grid";

  return (
    <Button
      variant="outline"
      size="icon"
      className="w-10 h-10 rounded-md bg-background shadow-sm hover:bg-muted transition-colors border-border"
      onClick={toggleView}
      title={isGrid ? "Switch to List View" : "Switch to Grid View"}
    >
      <IconLibrary name={isGrid ? "list" : "grid"} className="w-4 h-4 text-muted-foreground" />
    </Button>
  );
};

export default ViewToggleGroup;
