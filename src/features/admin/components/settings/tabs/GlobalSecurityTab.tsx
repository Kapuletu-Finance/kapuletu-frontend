import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Props {
  config: Record<string, any>;
  onUpdate: (key: string, value: any) => Promise<void>;
  isLoading: boolean;
}

export const GlobalSecurityTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [force2fa, setForce2fa] = useState(config.force_2fa || "none");
  const [timeout, setTimeoutVal] = useState(config.session_timeout_minutes || 60);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="font-semibold text-lg text-foreground tracking-tight">
          Global Security & Compliance
        </h3>
        <p className="text-sm text-muted-foreground">
          Enforce security policies across the entire platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 py-2">
        <Field className="space-y-2 max-w-sm">
          <FieldLabel className="font-semibold text-sm">Force 2FA Requirement</FieldLabel>
          <Select value={force2fa} onValueChange={setForce2fa}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select requirement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No requirement (Optional)</SelectItem>
              <SelectItem value="admins">Admins Only</SelectItem>
              <SelectItem value="all">All Users</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field className="space-y-2 max-w-sm">
          <FieldLabel className="font-semibold text-sm">
            Global Session Timeout (Minutes)
          </FieldLabel>
          <Input
            type="number"
            className="bg-background border-border"
            value={timeout}
            onChange={(e) => setTimeoutVal(parseInt(e.target.value) || 60)}
          />
        </Field>
      </div>

      <Separator className="w-full" />

      <div className="pt-2 flex justify-start">
        <Button
          className="w-40 font-semibold"
          disabled={isLoading}
          onClick={async () => {
            await onUpdate("force_2fa", force2fa);
            await onUpdate("session_timeout_minutes", timeout);
          }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
