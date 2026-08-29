import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
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

export const IntegrationsTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [mpesaMode, setMpesaMode] = useState(config.mpesa_mode || "sandbox");
  const [smsProvider, setSmsProvider] = useState(config.sms_provider || "at");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="font-semibold text-lg text-foreground tracking-tight">
          Integrations & Payment Gateways
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure external services without redeploying.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 py-2">
        <Field className="space-y-2 max-w-sm">
          <FieldLabel className="font-semibold text-sm">M-Pesa Environment</FieldLabel>
          <Select value={mpesaMode} onValueChange={setMpesaMode}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
              <SelectItem value="production">Production (Live)</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field className="space-y-2 max-w-sm">
          <FieldLabel className="font-semibold text-sm">Primary SMS Provider</FieldLabel>
          <Select value={smsProvider} onValueChange={setSmsProvider}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="at">Africa's Talking</SelectItem>
              <SelectItem value="twilio">Twilio</SelectItem>
              <SelectItem value="meta">Meta (WhatsApp First)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Separator className="w-full" />

      <div className="pt-2 flex justify-start">
        <Button
          className="w-40 font-semibold"
          disabled={isLoading}
          onClick={async () => {
            await onUpdate("mpesa_mode", mpesaMode);
            await onUpdate("sms_provider", smsProvider);
          }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
