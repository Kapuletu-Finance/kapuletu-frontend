import type React from "react";
import { useEffect, useState } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StickySaveBar } from "@/components/ui/sticky-save-bar";
import { useUpdateBillingSettingsMutation } from "@/features/admin/services/mutations";
import {
  type AdminBillingSettings,
  useAdminBillingSettingsQuery,
} from "@/features/admin/services/queries";

type EditableKey =
  | "trial_days"
  | "grace_period_days"
  | "annual_months_charged"
  | "addon_monthly_price"
  | "tax_rate_percent"
  | "invoice_prefix";

const FIELDS: { key: EditableKey; label: string; help: string; type: "number" | "text" }[] = [
  {
    key: "trial_days",
    label: "Free trial length (days)",
    help: "Length of the Professional trial.",
    type: "number",
  },
  {
    key: "grace_period_days",
    label: "Grace period after expiry (days)",
    help: "Days a lapsed paid plan keeps working before it moves to Basic.",
    type: "number",
  },
  {
    key: "annual_months_charged",
    label: "Months charged on annual billing",
    help: "11 gives one month free. Used for plans without their own annual price.",
    type: "number",
  },
  {
    key: "addon_monthly_price",
    label: "Extra campaign add-on (KES / month)",
    help: "Charged for every month of the billing period.",
    type: "number",
  },
  {
    key: "tax_rate_percent",
    label: "Tax rate (%)",
    help: "Added on top of the subtotal. Keep at 0 until the business is VAT-registered.",
    type: "number",
  },
  {
    key: "invoice_prefix",
    label: "Invoice number prefix",
    help: "e.g. KPL-2026-000123.",
    type: "text",
  },
];

type Draft = Record<EditableKey, string>;

const toDraft = (s: AdminBillingSettings): Draft => ({
  trial_days: String(s.trial_days),
  grace_period_days: String(s.grace_period_days),
  annual_months_charged: String(s.annual_months_charged),
  addon_monthly_price: String(s.addon_monthly_price),
  tax_rate_percent: String(s.tax_rate_percent),
  invoice_prefix: s.invoice_prefix,
});

export const BillingRulesTab: React.FC = () => {
  const { data: settings, isLoading, error } = useAdminBillingSettingsQuery();
  const updateMutation = useUpdateBillingSettingsMutation();
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    if (settings) setDraft(toDraft(settings));
  }, [settings]);

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        Billing rules are managed by the finance team. You need the Manage Finance permission to
        view or change them.
      </p>
    );
  }

  if (isLoading || !settings || !draft) {
    return <Skeleton className="h-80 w-full max-w-sm" />;
  }

  const original = toDraft(settings);
  const isDirty = FIELDS.some(({ key }) => draft[key] !== original[key]);

  const handleSave = async () => {
    const changes: Record<string, string | number> = {};
    for (const { key, type } of FIELDS) {
      if (draft[key] !== original[key]) {
        changes[key] = type === "number" ? Number(draft[key]) : draft[key].toUpperCase();
      }
    }
    await updateMutation.mutateAsync(changes);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="font-semibold text-lg text-foreground tracking-tight">
          Subscription & Billing Rules
        </h3>
        <p className="text-sm text-muted-foreground">
          Platform-wide rules used by checkout, trials and expiry. Changes apply to new checkouts;
          issued invoices keep their amounts. Currency: {settings.currency}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 py-2">
        {FIELDS.map(({ key, label, help, type }) => (
          <Field key={key} className="space-y-2 max-w-sm">
            <FieldLabel htmlFor={`billing-${key}`} className="font-semibold text-sm">
              {label}
            </FieldLabel>
            <Input
              id={`billing-${key}`}
              type={type}
              min={type === "number" ? 0 : undefined}
              className="bg-background border-border"
              value={draft[key]}
              onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
            />
            <FieldDescription>{help}</FieldDescription>
          </Field>
        ))}
      </div>

      <Separator className="w-full" />

      <StickySaveBar
        isDirty={isDirty}
        isSaving={updateMutation.isPending}
        onSave={handleSave}
        onDiscard={() => setDraft(original)}
      />
    </div>
  );
};
