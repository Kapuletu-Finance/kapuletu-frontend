import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Props {
  config: Record<string, any>;
  onUpdate: (key: string, value: any) => Promise<void>;
  isLoading: boolean;
}

export const PlatformOpsTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [maintenance, setMaintenance] = useState(config.maintenance_mode || false);
  const [openSignups, setOpenSignups] = useState(config.open_signups ?? true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Operations</CardTitle>
        <CardDescription>Global controls for platform access and signups.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Maintenance Mode</Label>
            <p className="text-sm text-muted-foreground">
              Suspend platform access for all non-admin users.
            </p>
          </div>
          <Switch checked={maintenance} onCheckedChange={setMaintenance} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Open Signups</Label>
            <p className="text-sm text-muted-foreground">
              Allow new users to register independently.
            </p>
          </div>
          <Switch checked={openSignups} onCheckedChange={setOpenSignups} />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          disabled={isLoading}
          onClick={async () => {
            await onUpdate("maintenance_mode", maintenance);
            await onUpdate("open_signups", openSignups);
          }}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export const GlobalSecurityTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [force2fa, setForce2fa] = useState(config.force_2fa || "none");
  const [timeout, setTimeoutVal] = useState(config.session_timeout_minutes || 60);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Security & Compliance</CardTitle>
        <CardDescription>Enforce security policies across the entire platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Force 2FA Requirement</Label>
          <Select value={force2fa} onValueChange={setForce2fa}>
            <SelectTrigger>
              <SelectValue placeholder="Select requirement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No requirement (Optional)</SelectItem>
              <SelectItem value="admins">Admins Only</SelectItem>
              <SelectItem value="all">All Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Global Session Timeout (Minutes)</Label>
          <Input
            type="number"
            value={timeout}
            onChange={(e) => setTimeoutVal(parseInt(e.target.value) || 60)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          disabled={isLoading}
          onClick={async () => {
            await onUpdate("force_2fa", force2fa);
            await onUpdate("session_timeout_minutes", timeout);
          }}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export const IntegrationsTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [mpesaMode, setMpesaMode] = useState(config.mpesa_mode || "sandbox");
  const [smsProvider, setSmsProvider] = useState(config.sms_provider || "at");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations & Payment Gateways</CardTitle>
        <CardDescription>Configure external services without redeploying.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>M-Pesa Environment</Label>
          <Select value={mpesaMode} onValueChange={setMpesaMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
              <SelectItem value="production">Production (Live)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Primary SMS Provider</Label>
          <Select value={smsProvider} onValueChange={setSmsProvider}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="at">Africa's Talking</SelectItem>
              <SelectItem value="twilio">Twilio</SelectItem>
              <SelectItem value="meta">Meta (WhatsApp First)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          disabled={isLoading}
          onClick={async () => {
            await onUpdate("mpesa_mode", mpesaMode);
            await onUpdate("sms_provider", smsProvider);
          }}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export const BillingRulesTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [trialDays, setTrialDays] = useState(config.trial_days || 14);
  const [gracePeriod, setGracePeriod] = useState(config.grace_period_days || 7);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription & Billing Rules</CardTitle>
        <CardDescription>Platform-wide rules for SaaS subscriptions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Default Trial Period (Days)</Label>
          <Input
            type="number"
            value={trialDays}
            onChange={(e) => setTrialDays(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label>Payment Grace Period (Days)</Label>
          <Input
            type="number"
            value={gracePeriod}
            onChange={(e) => setGracePeriod(parseInt(e.target.value) || 0)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          disabled={isLoading}
          onClick={async () => {
            await onUpdate("trial_days", trialDays);
            await onUpdate("grace_period_days", gracePeriod);
          }}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export const DataRetentionTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [aiTraining, setAiTraining] = useState(config.ai_training_default ?? false);
  const [logRetention, setLogRetention] = useState(config.audit_log_retention_days || 365);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Retention & Privacy</CardTitle>
        <CardDescription>Manage global privacy defaults and retention policies.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Opt-in to AI Training by Default</Label>
            <p className="text-sm text-muted-foreground">
              New users will have AI data sharing enabled by default.
            </p>
          </div>
          <Switch checked={aiTraining} onCheckedChange={setAiTraining} />
        </div>
        <div className="space-y-2">
          <Label>Audit Log Retention (Days)</Label>
          <Input
            type="number"
            value={logRetention}
            onChange={(e) => setLogRetention(parseInt(e.target.value) || 365)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          disabled={isLoading}
          onClick={async () => {
            await onUpdate("ai_training_default", aiTraining);
            await onUpdate("audit_log_retention_days", logRetention);
          }}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export const GlobalNotificationsTab: React.FC<Props> = ({ config, onUpdate, isLoading }) => {
  const [alertEmail, setAlertEmail] = useState(config.critical_alert_email || "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Notifications & Alerts</CardTitle>
        <CardDescription>Configure routing for system-critical alerts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Critical Alert Email</Label>
          <Input
            type="email"
            placeholder="admin@kapuletu.co.ke"
            value={alertEmail}
            onChange={(e) => setAlertEmail(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Receives webhook failures, large transactions, and security alerts.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          disabled={isLoading}
          onClick={async () => {
            await onUpdate("critical_alert_email", alertEmail);
          }}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};
