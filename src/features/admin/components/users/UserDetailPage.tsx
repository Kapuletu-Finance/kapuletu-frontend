"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAdminUserDetailsQuery,
  useAdminUserGroupsQuery,
} from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { ChangeRoleDialog } from "./ChangeRoleDialog";
import { EscalatedUpdateDialog } from "./EscalatedUpdateDialog";
import { OverridePlanDialog } from "./OverridePlanDialog";
import { SuspendUserDialog } from "./SuspendUserDialog";

export const UserDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.slug as string;

  const { data: userDetails, isLoading: isLoadingDetails } = useAdminUserDetailsQuery(userId);
  const { data: userGroups, isLoading: isLoadingGroups } = useAdminUserGroupsQuery(userId);

  const [suspendOpen, setSuspendOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

  if (isLoadingDetails) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full md:col-span-2" />
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <IconLibrary name="alert" className="size-10 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground">User not found</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          The user you are looking for does not exist or has been removed from the platform.
        </p>
        <Button className="mt-6" onClick={() => router.push("/admin/users")}>
          <IconLibrary name="arrow-left" className="mr-2 size-4" /> Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Button
            variant="link"
            className="p-0 h-auto w-fit text-muted-foreground justify-start mb-2"
            onClick={() => router.push("/admin/users")}
          >
            <IconLibrary name="arrow-left" className="mr-1 size-3" /> Back to Users
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {userDetails.profile.first_name} {userDetails.profile.last_name}
            </h1>
            <Badge
              variant="outline"
              className={
                userDetails.profile.is_active
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }
            >
              {userDetails.profile.is_active ? "Active" : "Suspended"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Identifier: {userId}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <IconLibrary name="edit" className="mr-2 size-4" /> Edit
          </Button>
          <Button
            variant={userDetails.profile.is_active ? "destructive" : "default"}
            onClick={() => setSuspendOpen(true)}
          >
            <IconLibrary name="alert" className="mr-2 size-4" />
            {userDetails.profile.is_active ? "Suspend" : "Reactivate"}
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Summary Card */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                  Contact Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium text-foreground">{userDetails.profile.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium text-foreground">
                      {userDetails.profile.phone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-px bg-border w-full" />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                  Platform Stats
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Joined</span>
                    <span className="font-medium text-foreground">
                      {formatDate(userDetails.profile.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Groups</span>
                    <span className="font-medium text-foreground">
                      {userDetails.stats.total_groups}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">System Role</span>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {userDetails.profile.role.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="groups" className="w-full">
            <TabsList className="grid grid-cols-3 w-full lg:w-96 mb-6">
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="plan">Plan</TabsTrigger>
              <TabsTrigger value="admin">Admin Controls</TabsTrigger>
            </TabsList>

            <TabsContent value="groups" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-foreground">Community Groups</h3>
              </div>
              {isLoadingGroups ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-16 bg-muted rounded-md" />
                  <div className="h-16 bg-muted rounded-md" />
                </div>
              ) : !userGroups || userGroups.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-border rounded-lg">
                  <p className="text-sm text-muted-foreground">No groups owned by this user.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userGroups.map((group) => (
                    <Card key={group.group_id}>
                      <CardContent className="p-4">
                        <p className="font-semibold text-foreground text-base mb-1">{group.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
                          {group.description || "No description provided."}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                          <span>Created {formatDate(group.created_at)}</span>
                          <span className="font-medium text-primary">View Group</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="plan" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    Subscription & Billing
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-lg">
                    Manage this user's platform subscription. If a user requires a custom
                    arrangement or manual upgrade bypassing the payment gateway, use the manual
                    override below.
                  </p>
                  <Button onClick={() => setPlanOpen(true)}>
                    <IconLibrary name="credit-card" className="mr-2 size-4" />
                    Manual Plan Override
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">Role Management</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-lg">
                      Elevate this user to an Admin or Super Admin. Warning: this grants them
                      elevated access to the platform.
                    </p>
                    <Button variant="outline" onClick={() => setRoleOpen(true)}>
                      <IconLibrary name="shield" className="mr-2 size-4" /> Change User Role
                    </Button>
                  </div>
                  <div className="h-px bg-border w-full" />
                  <div>
                    <h3 className="font-semibold text-lg text-destructive mb-2">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-lg">
                      Suspending an account instantly terminates the user's access to the KapuLetu
                      platform. All their data is preserved, but they will not be able to log in.
                    </p>
                    <Button variant="destructive" onClick={() => setSuspendOpen(true)}>
                      <IconLibrary name="alert" className="mr-2 size-4" /> Suspend Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <SuspendUserDialog
        userId={userId}
        isActive={userDetails.profile.is_active}
        isOpen={suspendOpen}
        onOpenChange={setSuspendOpen}
      />
      <ChangeRoleDialog
        userId={userId}
        currentRole={userDetails.profile.role}
        isOpen={roleOpen}
        onOpenChange={setRoleOpen}
      />
      <EscalatedUpdateDialog
        userId={userId}
        initialData={{
          first_name: userDetails.profile.first_name,
          last_name: userDetails.profile.last_name,
          email: userDetails.profile.email,
          phone: userDetails.profile.phone,
        }}
        isOpen={editOpen}
        onOpenChange={setEditOpen}
      />
      <OverridePlanDialog userId={userId} isOpen={planOpen} onOpenChange={setPlanOpen} />
    </div>
  );
};
