"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Clock, Mail, PlusCircle, Shield, UserX } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminAuditClient } from "@/features/admin/components/AdminAuditClient";
import {
  useAdminEmployeesQuery,
  useAdminPendingInvitesQuery,
} from "@/features/admin/services/queries";
import {
  useInviteEmployeeMutation,
  useUpdateEmployeePermissionsMutation,
} from "@/features/auth/services/mutations";
import { apiClient } from "@/lib/api-client";

const AVAILABLE_PERMISSIONS = [
  { id: "manage_finance", label: "Manage Finance" },
  { id: "manage_users", label: "Manage Users" },
  { id: "manage_blogs", label: "Manage Blogs" },
  { id: "manage_support", label: "Manage Support" },
  { id: "view_audit_logs", label: "View Audit Logs" },
  { id: "manage_employees", label: "Manage Employees" },
];

const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  content_manager: ["manage_blogs"],
  support_agent: ["manage_support", "manage_users"],
  finance_manager: ["manage_finance"],
  admin: ["manage_finance", "manage_users", "manage_blogs", "manage_support", "view_audit_logs"],
  super_admin: [
    "manage_finance",
    "manage_users",
    "manage_blogs",
    "manage_support",
    "view_audit_logs",
    "manage_employees",
  ],
  ceo: [
    "manage_finance",
    "manage_users",
    "manage_blogs",
    "manage_support",
    "view_audit_logs",
    "manage_employees",
  ],
};

const AdminEmployeesClient: React.FC = () => {
  const { data: employees = [], isLoading: isLoadingEmployees } = useAdminEmployeesQuery();
  const { data: invites = [], isLoading: isLoadingInvites } = useAdminPendingInvitesQuery();
  const inviteMutation = useInviteEmployeeMutation();
  const updateMutation = useUpdateEmployeePermissionsMutation();
  const queryClient = useQueryClient();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [inviteForm, setInviteForm] = useState<{
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    permissions: string[];
  }>({
    email: "",
    first_name: "",
    last_name: "",
    role: "support_agent",
    permissions: DEFAULT_ROLE_PERMISSIONS["support_agent"] || [],
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMutation.mutate(inviteForm, {
      onSuccess: () => {
        setIsInviteModalOpen(false);
        setInviteForm({
          email: "",
          first_name: "",
          last_name: "",
          role: "support_agent",
          permissions: DEFAULT_ROLE_PERMISSIONS["support_agent"] || [],
        });
      },
    });
  };

  const handleRevokeAccess = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to revoke this employee's access? They will no longer be able to log in.",
      )
    )
      return;
    try {
      await apiClient.delete(`/admin/employees/${userId}`);
      toast.success("Employee access revoked.");
      queryClient.invalidateQueries({ queryKey: ["admin_employees"] });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to revoke access.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground">
            Manage internal team members, access roles, and invites.
          </p>
        </div>
        <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
          <DialogTrigger>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Invite Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite New Employee</DialogTitle>
              <DialogDescription>
                Send an onboarding link. The link expires in 24 hours.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    placeholder="John"
                    value={inviteForm.first_name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInviteForm({ ...inviteForm, first_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    placeholder="Doe"
                    value={inviteForm.last_name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInviteForm({ ...inviteForm, last_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="john.doe@kapuletu.com"
                  value={inviteForm.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={inviteForm.role}
                  onValueChange={(val: string | null) => {
                    if (!val) return;
                    setInviteForm({
                      ...inviteForm,
                      role: val,
                      permissions: DEFAULT_ROLE_PERMISSIONS[val] || [],
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content_manager">Content Manager</SelectItem>
                    <SelectItem value="support_agent">Support Agent</SelectItem>
                    <SelectItem value="finance_manager">Finance Manager</SelectItem>
                    <SelectItem value="admin">Administrator (Legacy)</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="ceo">CEO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-sm font-semibold">Granular Module Access</Label>
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_PERMISSIONS.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={inviteForm.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setInviteForm((prev) => ({
                              ...prev,
                              permissions: [...prev.permissions, permission.id],
                            }));
                          } else {
                            setInviteForm((prev) => ({
                              ...prev,
                              permissions: prev.permissions.filter((p) => p !== permission.id),
                            }));
                          }
                        }}
                      />
                      <label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={inviteMutation.isPending}>
                  {inviteMutation.isPending ? "Sending..." : "Send Invite"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Active Employees
          </TabsTrigger>
          <TabsTrigger value="invites" className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Pending Invites
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Activity Feed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingEmployees ? (
                <div className="py-8 text-center text-muted-foreground">Loading employees...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                          No employees found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      employees.map((emp: any) => (
                        <TableRow key={emp.user_id}>
                          <TableCell className="font-medium">
                            {emp.first_name} {emp.last_name}
                          </TableCell>
                          <TableCell>{emp.email}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                              {emp.role.replace("_", " ").toUpperCase()}
                            </span>
                          </TableCell>
                          <TableCell>
                            {emp.is_active ? (
                              <span className="inline-flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-4 w-4" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-600">
                                <UserX className="h-4 w-4" /> Suspended
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {emp.is_active && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingEmployee(emp)}
                                >
                                  Edit Access
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => handleRevokeAccess(emp.user_id)}
                                >
                                  Revoke
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invites" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingInvites ? (
                <div className="py-8 text-center text-muted-foreground">Loading invites...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Sent At</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invites.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                          No pending invites.
                        </TableCell>
                      </TableRow>
                    ) : (
                      invites.map((inv: any) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-medium">
                            {inv.first_name} {inv.last_name}
                          </TableCell>
                          <TableCell>{inv.email}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                              {inv.role.replace("_", " ").toUpperCase()}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(inv.created_at || Date.now()).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1 text-amber-600">
                              <Clock className="h-4 w-4" /> Pending
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audit" className="mt-4">
          <AdminAuditClient />
        </TabsContent>
      </Tabs>
      {editingEmployee && (
        <Dialog open={!!editingEmployee} onOpenChange={(open) => !open && setEditingEmployee(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Employee Access</DialogTitle>
              <DialogDescription>
                Update granular module access for {editingEmployee.first_name}{" "}
                {editingEmployee.last_name}.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateMutation.mutate(
                  { userId: editingEmployee.user_id, permissions: editingEmployee.permissions },
                  {
                    onSuccess: () => setEditingEmployee(null),
                  },
                );
              }}
              className="space-y-4 pt-4"
            >
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${permission.id}`}
                      checked={editingEmployee.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setEditingEmployee((prev: any) => ({
                            ...prev,
                            permissions: [...(prev?.permissions || []), permission.id],
                          }));
                        } else {
                          setEditingEmployee((prev: any) => ({
                            ...prev,
                            permissions: (prev?.permissions || []).filter(
                              (p: string) => p !== permission.id,
                            ),
                          }));
                        }
                      }}
                    />
                    <label
                      htmlFor={`edit-${permission.id}`}
                      className="text-sm font-medium leading-none"
                    >
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingEmployee(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminEmployeesClient;
