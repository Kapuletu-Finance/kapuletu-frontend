"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import type React from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { errorMessage } from "@/features/admin/services/financeApi";
import { apiClient } from "@/lib/api-client";

interface Preferences {
  email: string | null;
  phone_number: string | null;
  marketing: { email: boolean; whatsapp: boolean };
  email_blocked: boolean;
}

const KEY = ["communication-preferences"];

const usePreferences = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async () => (await apiClient.get<Preferences>("/communications/preferences")).data,
  });

const useUpdatePreferences = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (change: { marketing_email?: boolean; marketing_whatsapp?: boolean }) =>
      (await apiClient.put<Preferences>("/communications/preferences", change)).data,
    onSuccess: (data) => {
      qc.setQueryData(KEY, data);
      toast.success("Preferences saved.");
    },
    onError: (e) => toast.error(errorMessage(e, "Could not save your preferences.")),
  });
};

const Row = ({
  id,
  icon,
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  checked: boolean;
  disabled?: boolean;
  onChange?: (on: boolean) => void;
}) => (
  <div className="flex items-start justify-between gap-6 py-3">
    <div className="flex gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="space-y-1">
        <Label htmlFor={id} className="font-semibold text-sm text-foreground">
          {title}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
    <Switch id={id} checked={checked} disabled={disabled} onCheckedChange={onChange} />
  </div>
);

export const CommunicationsTab: React.FC = () => {
  const { data, isLoading, isError } = usePreferences();
  const update = useUpdatePreferences();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">Couldn't load your preferences. Try again later.</p>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h3 className="font-semibold text-lg text-foreground tracking-tight">Communications</h3>
        <p className="text-sm text-muted-foreground">
          Choose what KapuLetu may send you. Changes save straight away.
        </p>
      </div>

      <section className="space-y-1">
        <h4 className="text-sm font-semibold">News and offers</h4>
        <Row
          id="pref-marketing-email"
          icon={<Mail className="size-4" />}
          title="By email"
          description={
            data.email_blocked
              ? "Emails to your address bounced, so we can't send these. Update your email in your profile or contact support."
              : `Product news, tips and offers to ${data.email ?? "your email"}.`
          }
          checked={data.marketing.email}
          disabled={update.isPending || data.email_blocked}
          onChange={(on) => update.mutate({ marketing_email: on })}
        />
        <Row
          id="pref-marketing-whatsapp"
          icon={<MessageCircle className="size-4" />}
          title="On WhatsApp"
          description={
            data.phone_number
              ? `Occasional offers to your WhatsApp number ending ${data.phone_number}.`
              : "Add a phone number to your profile to receive these."
          }
          checked={data.marketing.whatsapp}
          disabled={update.isPending || !data.phone_number}
          onChange={(on) => update.mutate({ marketing_whatsapp: on })}
        />
      </section>

      <Separator />

      <section className="space-y-1">
        <h4 className="text-sm font-semibold">Account messages</h4>
        <Row
          id="pref-service"
          icon={<ShieldCheck className="size-4" />}
          title="Always on"
          description="Sign-in codes, security alerts, receipts, invoices and important notices about your account and groups. These can't be turned off while you have an account."
          checked
          disabled
        />
      </section>
    </div>
  );
};
