import type * as React from "react";
import { Button } from "@/components/ui/button";
import IconLibrary from "@/features/shared/components/IconLibrary";

export interface InboxBulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onApproveAll: () => void;
  onRejectAll: () => void;
}

export const InboxBulkActions: React.FC<InboxBulkActionsProps> = ({
  selectedCount,
  onClearSelection,
  onApproveAll,
  onRejectAll,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full py-4 border-b border-border gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{selectedCount} selected</span>
        <Button
          variant="link"
          onClick={onClearSelection}
          className="text-primary hover:text-primary/80 h-auto p-0 text-sm font-medium"
        >
          Clear selection
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onApproveAll}
          className="border-primary text-primary hover:bg-primary/10 gap-2"
        >
          <IconLibrary name="check" className="w-4 h-4" />
          Approve all
        </Button>
        <Button
          variant="outline"
          onClick={onRejectAll}
          className="border-destructive/50 text-destructive hover:bg-destructive/10 gap-2"
        >
          <IconLibrary name="close" className="w-4 h-4" />
          Reject all
        </Button>
      </div>
    </div>
  );
};

export default InboxBulkActions;
