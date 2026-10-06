import { X } from "lucide-react";
import type React from "react";
import { type KeyboardEvent, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StickySaveBar } from "@/components/ui/sticky-save-bar";
import { useUpdateAdminNotificationEmailsMutation } from "../../../services/mutations";
import { useAdminNotificationEmailsQuery } from "../../../services/queries";

interface Props {
  config: Record<string, any>;
  onUpdate: (key: string, value: any) => Promise<void>;
  isLoading: boolean;
}

const EmailInput = ({
  emails,
  onChange,
  label,
  description,
  placeholder,
}: {
  emails: string[];
  onChange: (emails: string[]) => void;
  label: string;
  description: string;
  placeholder: string;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newEmail = inputValue.trim().replace(/,$/, "");
      if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) && !emails.includes(newEmail)) {
        onChange([...emails, newEmail]);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && inputValue === "" && emails.length > 0) {
      onChange(emails.slice(0, -1));
    }
  };

  const removeEmail = (emailToRemove: string) => {
    onChange(emails.filter((e) => e !== emailToRemove));
  };

  const inputId = `input-${label.replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-2 max-w-2xl">
      <FieldLabel htmlFor={inputId} className="font-medium text-sm text-foreground/90">
        {label}
      </FieldLabel>
      <div
        className="flex flex-wrap items-center gap-1.5 p-1.5 min-h-[44px] bg-background border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all cursor-text shadow-sm"
        onClick={() => document.getElementById(inputId)?.focus()}
      >
        {emails.map((email) => (
          <Badge
            key={email}
            variant="secondary"
            className="flex items-center gap-1 py-1 px-2.5 text-xs font-medium hover:bg-secondary/80 bg-secondary"
          >
            {email}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeEmail(email);
              }}
              className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted ml-0.5 p-0.5 focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          id={inputId}
          type="email"
          placeholder={emails.length === 0 ? placeholder : "Add another..."}
          className="flex-1 bg-transparent min-w-[150px] text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            const newEmail = inputValue.trim().replace(/,$/, "");
            if (
              newEmail &&
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) &&
              !emails.includes(newEmail)
            ) {
              onChange([...emails, newEmail]);
              setInputValue("");
            }
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
    </div>
  );
};

export const GlobalNotificationsTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const { data: adminConfig, isLoading: isAdminConfigLoading } = useAdminNotificationEmailsQuery();
  const updateAdminEmailsMutation = useUpdateAdminNotificationEmailsMutation();

  const [emails, setEmails] = useState<string[]>([]);
  const [emailsHr, setEmailsHr] = useState<string[]>([]);
  const [emailsSignups, setEmailsSignups] = useState<string[]>([]);
  const [emailsWarnings, setEmailsWarnings] = useState<string[]>([]);
  const [emailsFinance, setEmailsFinance] = useState<string[]>([]);

  useEffect(() => {
    if (adminConfig) {
      setEmails(adminConfig.emails || []);
      setEmailsHr(adminConfig.emails_hr || []);
      setEmailsSignups(adminConfig.emails_signups || []);
      setEmailsWarnings(adminConfig.emails_warnings || []);
      setEmailsFinance(adminConfig.emails_finance || []);
    }
  }, [adminConfig]);

  const isDirty =
    JSON.stringify(emails) !== JSON.stringify(adminConfig?.emails || []) ||
    JSON.stringify(emailsHr) !== JSON.stringify(adminConfig?.emails_hr || []) ||
    JSON.stringify(emailsSignups) !== JSON.stringify(adminConfig?.emails_signups || []) ||
    JSON.stringify(emailsWarnings) !== JSON.stringify(adminConfig?.emails_warnings || []) ||
    JSON.stringify(emailsFinance) !== JSON.stringify(adminConfig?.emails_finance || []);

  const isSaving = isLoading || updateAdminEmailsMutation.isPending;

  const handleSave = async () => {
    if (isDirty) {
      await updateAdminEmailsMutation.mutateAsync({
        emails,
        emails_hr: emailsHr,
        emails_signups: emailsSignups,
        emails_warnings: emailsWarnings,
        emails_finance: emailsFinance,
      });
    }
  };

  const handleDiscard = () => {
    setEmails(adminConfig?.emails || []);
    setEmailsHr(adminConfig?.emails_hr || []);
    setEmailsSignups(adminConfig?.emails_signups || []);
    setEmailsWarnings(adminConfig?.emails_warnings || []);
    setEmailsFinance(adminConfig?.emails_finance || []);
  };

  if (isAdminConfigLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-full bg-muted rounded-md" />
        <div className="h-10 w-full bg-muted rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-lg text-foreground tracking-tight">
          Administrative Communication Routing
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure which system administrators or departmental groups receive different types of
          automated alerts and communications.
        </p>
      </div>

      <EmailInput
        label="General Administrative Alerts"
        description="Receives fallback notifications and general system events."
        placeholder="admin@kapuletu.co.ke"
        emails={emails}
        onChange={setEmails}
      />

      <Separator className="w-full" />

      <EmailInput
        label="HR & Employee Management"
        description="Receives notifications for scheduled meetings, attendance tracking, and daily work reports."
        placeholder="hr@kapuletu.co.ke"
        emails={emailsHr}
        onChange={setEmailsHr}
      />

      <Separator className="w-full" />

      <EmailInput
        label="New User Signups"
        description="Receives notifications when new users register, join waitlists, or upgrade plans."
        placeholder="growth@kapuletu.co.ke"
        emails={emailsSignups}
        onChange={setEmailsSignups}
      />

      <Separator className="w-full" />

      <EmailInput
        label="Finance & Payments"
        description="Receives notifications for subscription upgrades, package payments, and successful billing transactions."
        placeholder="billing@kapuletu.co.ke"
        emails={emailsFinance}
        onChange={setEmailsFinance}
      />

      <Separator className="w-full" />

      <EmailInput
        label="Security & System Warnings"
        description="Receives critical alerts for failed webhook deliveries, blocked IPs, or suspicious activity."
        placeholder="security@kapuletu.co.ke"
        emails={emailsWarnings}
        onChange={setEmailsWarnings}
      />

      <StickySaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
};
