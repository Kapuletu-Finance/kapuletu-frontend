"use client";

import { ArrowLeft, KeyRound, LogOut, ShieldCheck, ShieldOff } from "lucide-react";
import Link from "next/link";
import type React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  type EmployeeAccountAction,
  type EmployeeProfile,
  useEmployeeAccountActionMutation,
} from "@/features/admin/services/employeeProfile";
import { toneClasses } from "@/features/hr/components/shared/HrBadges";
import { formatRole } from "@/features/hr/utils";
import { timeAgo } from "@/features/notifications/utils";
import { cn } from "@/lib/utils";

/** Heartbeats arrive every minute; anyone seen within this window counts as online. */
const ONLINE_WINDOW_MS = 5 * 60 * 1000;

interface ConfirmActionProps {
  label: string;
  icon: React.ElementType;
  title: string;
  description: string;
  destructive?: boolean;
  disabled?: boolean;
  onConfirm: () => void;
}

const ConfirmAction: React.FC<ConfirmActionProps> = ({
  label,
  icon: Icon,
  title,
  description,
  destructive,
  disabled,
  onConfirm,
}) => (
  <AlertDialog>
    <AlertDialogTrigger
      disabled={disabled}
      render={
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", destructive && "text-destructive")}
        />
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>{label}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const Presence: React.FC<{ employee: EmployeeProfile }> = ({ employee }) => {
  if (!employee.last_active_at) return <span>Never active</span>;
  const online = Date.now() - new Date(employee.last_active_at).getTime() < ONLINE_WINDOW_MS;
  return online ? (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      Active now{employee.current_action ? ` · ${employee.current_action}` : ""}
    </span>
  ) : (
    <span>
      Last seen {timeAgo(employee.last_active_at)}
      {employee.current_action ? ` · ${employee.current_action}` : ""}
    </span>
  );
};

interface EmployeeProfileHeaderProps {
  employee: EmployeeProfile;
  canManageAccount: boolean;
  isSelf: boolean;
}

export const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({
  employee,
  canManageAccount,
  isSelf,
}) => {
  const action = useEmployeeAccountActionMutation();
  const name = `${employee.first_name} ${employee.last_name}`;
  const run = (kind: EmployeeAccountAction) =>
    action.mutate({ action: kind, userId: employee.user_id });

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-start gap-4">
        <Link
          href="/admin/employees"
          aria-label="Back to employee directory"
          className={buttonVariants({ size: "icon", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {employee.first_name.charAt(0)}
          {employee.last_name.charAt(0)}
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
            <Badge variant="outline">{formatRole(employee.role)}</Badge>
            <Badge variant="outline" className={toneClasses(employee.is_active ? "green" : "red")}>
              {employee.is_active ? "Active" : "Suspended"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {employee.email}
            {employee.phone_number ? ` · ${employee.phone_number}` : ""}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <Presence employee={employee} />
            <span>
              Last sign-in:{" "}
              {employee.last_login_at
                ? `${timeAgo(employee.last_login_at)} (${new Date(employee.last_login_at).toLocaleString()})`
                : "never"}
            </span>
            <span>2FA {employee.two_factor_enabled ? "on" : "off"}</span>
          </div>
        </div>
      </div>

      {canManageAccount && (
        <div className="flex flex-wrap gap-2">
          {employee.is_active ? (
            <>
              <ConfirmAction
                label="Send password reset"
                icon={KeyRound}
                title={`Send ${employee.first_name} a password reset code?`}
                description={`A reset code will be sent to ${employee.email}.`}
                disabled={action.isPending}
                onConfirm={() => run("reset-password")}
              />
              <ConfirmAction
                label="Sign out everywhere"
                icon={LogOut}
                title={`Sign ${employee.first_name} out of every session?`}
                description="All their open sessions end immediately; they can sign in again."
                disabled={action.isPending}
                onConfirm={() => run("sign-out")}
              />
              {!isSelf && (
                <ConfirmAction
                  label="Suspend"
                  icon={ShieldOff}
                  title={`Suspend ${name}?`}
                  description="They are signed out everywhere and can't sign in until restored. Their history is kept."
                  destructive
                  disabled={action.isPending}
                  onConfirm={() => run("suspend")}
                />
              )}
            </>
          ) : (
            <ConfirmAction
              label="Restore access"
              icon={ShieldCheck}
              title={`Restore ${name}?`}
              description="They will be able to sign in again with their existing role and permissions."
              disabled={action.isPending}
              onConfirm={() => run("restore")}
            />
          )}
        </div>
      )}
    </div>
  );
};
