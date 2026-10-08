"use client";

import { Check, ShieldCheck } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type EmployeeProfile,
  type EmployeeUpdateInput,
  useEmployeePermissionsCatalogQuery,
  useUpdateEmployeeMutation,
} from "@/features/admin/services/employeeProfile";
import { formatRole } from "@/features/hr/utils";
import { cn } from "@/lib/utils";

/** Roles that implicitly hold every permission (mirrors the API's missing_permissions). */
const ALL_ACCESS_ROLES = new Set(["super_admin", "admin", "ceo"]);
const SUGGESTED_ROLES = [
  "support_agent",
  "content_manager",
  "finance_manager",
  "admin",
  "ceo",
  "super_admin",
];

interface EmployeeAccessTabProps {
  employee: EmployeeProfile;
  /** Only super admins may change profiles and access. */
  canEdit: boolean;
  /** Admins can't change their own role or permissions. */
  isSelf: boolean;
}

export const EmployeeAccessTab: React.FC<EmployeeAccessTabProps> = ({
  employee,
  canEdit,
  isSelf,
}) => {
  const { data: catalog = [] } = useEmployeePermissionsCatalogQuery();
  const update = useUpdateEmployeeMutation();
  const [form, setForm] = useState({
    first_name: employee.first_name,
    last_name: employee.last_name,
    permissions: employee.permissions,
    phone_number: employee.phone_number ?? "",
    role: employee.role,
  });

  const allAccess = ALL_ACCESS_ROLES.has(form.role);
  const canEditAccess = canEdit && !isSelf;
  const granted = new Set(form.permissions);

  const togglePermission = (id: string) =>
    setForm((prev) => ({
      ...prev,
      permissions: granted.has(id)
        ? prev.permissions.filter((p) => p !== id)
        : [...prev.permissions, id],
    }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: EmployeeUpdateInput = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      phone_number: form.phone_number.trim() || undefined,
    };
    if (canEditAccess) {
      payload.role = form.role.trim();
      payload.permissions = form.permissions;
    }
    update.mutate({ payload, userId: employee.user_id });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            {canEdit
              ? "Changes are logged and the employee is notified."
              : "Only super admins can edit profiles."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="emp-first">First name</Label>
            <Input
              id="emp-first"
              required
              disabled={!canEdit}
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="emp-last">Last name</Label>
            <Input
              id="emp-last"
              required
              disabled={!canEdit}
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="emp-email">Email</Label>
            <Input id="emp-email" disabled value={employee.email} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="emp-phone">Phone</Label>
            <Input
              id="emp-phone"
              disabled={!canEdit}
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              placeholder="+2547XXXXXXXX"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Role & access
          </CardTitle>
          <CardDescription>
            {isSelf
              ? "You can't change your own role or permissions."
              : "What this employee can open in the admin console."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="max-w-sm space-y-1.5">
            <Label htmlFor="emp-role">Role</Label>
            <Input
              id="emp-role"
              list="emp-role-suggestions"
              disabled={!canEditAccess}
              pattern="[a-z][a-z0-9_]*"
              title="Lowercase letters, numbers and underscores (e.g. support_agent)"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
            <datalist id="emp-role-suggestions">
              {SUGGESTED_ROLES.map((role) => (
                <option key={role} value={role}>
                  {formatRole(role)}
                </option>
              ))}
            </datalist>
          </div>

          {allAccess && (
            <p className="rounded-md border bg-muted/30 p-3 text-sm">
              <strong>{formatRole(form.role)}</strong> has access to every area; individual
              permissions below don&apos;t restrict this role.
            </p>
          )}

          <div className={cn("grid gap-3 md:grid-cols-2", allAccess && "opacity-60")}>
            {catalog.map((permission) => {
              const checked = allAccess || granted.has(permission.id);
              return (
                <div key={permission.id} className="flex items-start gap-3 rounded-lg border p-3">
                  {canEditAccess && !allAccess ? (
                    <Checkbox
                      id={`perm-${permission.id}`}
                      checked={checked}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                  ) : (
                    <Check
                      className={cn("mt-0.5 h-4 w-4", checked ? "text-primary" : "invisible")}
                    />
                  )}
                  <label htmlFor={`perm-${permission.id}`} className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{permission.label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {permission.areas.length > 0
                        ? permission.areas.join(" · ")
                        : "Not used by any screen yet"}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {canEdit && (
        <div className="flex justify-end">
          <Button type="submit" disabled={update.isPending}>
            {update.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      )}
    </form>
  );
};
