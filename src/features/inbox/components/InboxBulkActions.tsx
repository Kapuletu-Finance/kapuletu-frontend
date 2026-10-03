import type * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import IconLibrary from "@/features/shared/components/IconLibrary";

export interface InboxBulkActionsProps {
  selectedCount: number;
  totalCount: number;
  onClearSelection: () => void;
  onSelectAll: (checked: boolean) => void;
  onApproveAll: () => void;
  onRejectAll: () => void;
}

export const InboxBulkActions: React.FC<InboxBulkActionsProps> = ({
  selectedCount,
  totalCount,
  onClearSelection,
  onSelectAll,
  onApproveAll,
  onRejectAll,
}) => {
  const isAllSelected = selectedCount > 0 && selectedCount === totalCount;
  const _isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full py-4 px-4 border-b border-border gap-4 sticky top-0 z-50 bg-secondary/80 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={(checked) => onSelectAll(checked === true)}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <span className="text-sm font-semibold text-foreground">
          {selectedCount > 0 ? `${selectedCount} selected` : "Select All"}
        </span>
        {selectedCount > 0 && (
          <Button
            variant="link"
            onClick={onClearSelection}
            className="text-primary hover:text-primary/80 h-auto p-0 text-xs font-medium ml-2"
          >
            Clear
          </Button>
        )}
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-200">
          <Button
            variant="default"
            onClick={onApproveAll}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <IconLibrary name="check" className="w-4 h-4" />
            Approve {selectedCount > 1 ? "all" : ""}
          </Button>
          <Button
            variant="outline"
            onClick={onRejectAll}
            className="border-destructive text-destructive hover:bg-destructive/10 gap-2"
          >
            <IconLibrary name="close" className="w-4 h-4" />
            Reject {selectedCount > 1 ? "all" : ""}
          </Button>
        </div>
      )}
    </div>
  );
};

export default InboxBulkActions;
