import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import { Separator } from "@/components/ui/separator";
import { StickySaveBar } from "@/components/ui/sticky-save-bar";

interface Props {
  config: Record<string, any>;
  onUpdate: (key: string, value: any) => Promise<void>;
  isLoading: boolean;
}

export const DataRetentionTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [aiTraining, setAiTraining] = useState(config.ai_training_default ?? false);
  const [logRetention, setLogRetention] = useState(config.audit_log_retention_days || 365);

  const isDirty =
    aiTraining !== (config.ai_training_default ?? false) ||
    logRetention !== (config.audit_log_retention_days || 365);

  const handleSave = async () => {
    if (!window.confirm("Are you sure you want to apply these changes?")) return;
    await onUpdate("ai_training_default", aiTraining);
    await onUpdate("audit_log_retention_days", logRetention);
  };

  const handleDiscard = () => {
    setAiTraining(config.ai_training_default ?? false);
    setLogRetention(config.audit_log_retention_days || 365);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="font-semibold text-lg text-foreground tracking-tight">
          Data Retention & Privacy
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage global privacy defaults and retention policies.
        </p>
      </div>

      <div className="flex flex-col py-2 gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-foreground">
              Opt-in to AI Training by Default
            </h4>
            <p className="text-xs text-muted-foreground">
              New users will have AI data sharing enabled by default.
            </p>
          </div>
          <LabeledSwitch checked={aiTraining} onCheckedChange={setAiTraining} />
        </div>

        <Separator className="w-full" />

        <div className="pt-2">
          <Field className="space-y-2 max-w-sm">
            <FieldLabel className="font-semibold text-sm">Audit Log Retention (Days)</FieldLabel>
            <Input
              type="number"
              className="bg-background border-border"
              value={logRetention}
              onChange={(e) => setLogRetention(parseInt(e.target.value, 10) || 365)}
            />
          </Field>
        </div>
      </div>

      <Separator className="w-full" />

      <StickySaveBar
        isDirty={isDirty}
        isSaving={isLoading}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
};
