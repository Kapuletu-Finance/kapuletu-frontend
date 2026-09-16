import { Loader2 } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";

interface StickySaveBarProps {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard?: () => void;
  saveText?: string;
}

export const StickySaveBar: React.FC<StickySaveBarProps> = ({
  isDirty,
  isSaving,
  onSave,
  onDiscard,
  saveText = "Save Changes",
}) => {
  if (!isDirty && !isSaving) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="flex items-center gap-4 px-6 py-4 bg-card border border-border shadow-2xl rounded-full">
        <p className="text-sm font-medium text-foreground whitespace-nowrap">
          You have unsaved changes
        </p>
        <div className="flex items-center gap-2 border-l border-border pl-4 ml-2">
          {onDiscard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDiscard}
              disabled={isSaving}
              className="text-muted-foreground hover:text-foreground rounded-full font-semibold px-4"
            >
              Discard
            </Button>
          )}
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="rounded-full px-6 font-semibold shadow-md"
          >
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isSaving ? "Saving..." : saveText}
          </Button>
        </div>
      </div>
    </div>
  );
};
