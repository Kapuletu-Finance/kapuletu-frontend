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
      const newEmail = inputValue.trim();
      if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) && !emails.includes(newEmail)) {
        onChange([...emails, newEmail]);
        setInputValue("");
      }
    }
  };

  const removeEmail = (emailToRemove: string) => {
    onChange(emails.filter((e) => e !== emailToRemove));
  };

  return (
    <div className="space-y-2">
      <FieldLabel className="font-semibold text-sm">{label}</FieldLabel>
      <div className="flex flex-wrap gap-2 mb-2">
        {emails.map((email) => (
          <Badge
            key={email}
            variant="secondary"
            className="flex items-center gap-1 py-1 px-2 text-sm"
          >
            {email}
            <button
              type="button"
              onClick={() => removeEmail(email)}
              className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted ml-1 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="email"
        placeholder={placeholder}
        className="bg-background border-border max-w-xl"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) {
            handleKeyDown({
              key: "Enter",
              preventDefault: () => {},
            } as KeyboardEvent<HTMLInputElement>);
          }
        }}
      />
      <p className="text-xs text-muted-foreground mt-1 max-w-xl">
        {description} (Press Enter or comma to add)
      </p>
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

  useEffect(() => {
    if (adminConfig) {
      setEmails(adminConfig.emails || []);
      setEmailsHr(adminConfig.emails_hr || []);
      setEmailsSignups(adminConfig.emails_signups || []);
      setEmailsWarnings(adminConfig.emails_warnings || []);
    }
  }, [adminConfig]);

  const isDirty =
    JSON.stringify(emails) !== JSON.stringify(adminConfig?.emails || []) ||
    JSON.stringify(emailsHr) !== JSON.stringify(adminConfig?.emails_hr || []) ||
    JSON.stringify(emailsSignups) !== JSON.stringify(adminConfig?.emails_signups || []) ||
    JSON.stringify(emailsWarnings) !== JSON.stringify(adminConfig?.emails_warnings || []);

  const isSaving = isLoading || updateAdminEmailsMutation.isPending;

  const handleSave = async () => {
    if (isDirty) {
      await updateAdminEmailsMutation.mutateAsync({
        emails,
        emails_hr: emailsHr,
        emails_signups: emailsSignups,
        emails_warnings: emailsWarnings,
      });
    }
  };

  const handleDiscard = () => {
    setEmails(adminConfig?.emails || []);
    setEmailsHr(adminConfig?.emails_hr || []);
    setEmailsSignups(adminConfig?.emails_signups || []);
    setEmailsWarnings(adminConfig?.emails_warnings || []);
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
