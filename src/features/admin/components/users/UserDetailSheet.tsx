"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

interface UserDetailSheetProps {
  userId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailSheet: React.FC<UserDetailSheetProps> = ({
  userId,
  isOpen,
  onOpenChange,
}) => {
  const { data: userDetails, isLoading: isLoadingDetails } = useAdminUserDetailsQuery(userId || "");
  const { data: userGroups, isLoading: isLoadingGroups } = useAdminUserGroupsQuery(userId || "");

  const [suspendOpen, setSuspendOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);

  if (!userId) return null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>User Details</SheetTitle>
          </SheetHeader>

          {isLoadingDetails ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-20 bg-muted rounded-md" />
              <div className="h-40 bg-muted rounded-md" />
            </div>
          ) : userDetails ? (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="plan">Plan</TabsTrigger>
              </TabsList>

              {/* PROFILE TAB */}
              <TabsContent value="profile" className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {userDetails.profile.first_name} {userDetails.profile.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{userDetails.profile.email}</p>
                  </div>
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

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium">{userDetails.profile.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Joined</p>
                    <p className="font-medium">{formatDate(userDetails.profile.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Role</p>
                    <Badge variant="secondary" className="capitalize">
                      {userDetails.profile.role.replace("_", " ")}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Total Groups</p>
                    <p className="font-medium">{userDetails.stats.total_groups}</p>
                  </div>
                </div>

                <div className="h-px bg-border my-4" />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Actions</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setEditOpen(true)}
                    >
                      <IconLibrary name="edit" className="mr-2 size-4" /> Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setRoleOpen(true)}
                    >
                      <IconLibrary name="shield" className="mr-2 size-4" /> Change Role
                    </Button>
                    <Button
                      variant={userDetails.profile.is_active ? "destructive" : "default"}
                      className="w-full justify-start"
                      onClick={() => setSuspendOpen(true)}
                    >
                      <IconLibrary name="alert" className="mr-2 size-4" />
                      {userDetails.profile.is_active ? "Suspend User" : "Reactivate User"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* GROUPS TAB */}
              <TabsContent value="groups" className="space-y-4 pt-4">
                {isLoadingGroups ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-12 bg-muted rounded-md" />
                    <div className="h-12 bg-muted rounded-md" />
                  </div>
                ) : !userGroups || userGroups.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No groups found for this user.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {userGroups.map((group) => (
                      <div key={group.group_id} className="p-3 border border-border rounded-md">
                        <p className="font-medium text-foreground text-sm">{group.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {group.description || "No description"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-2">
                          Created {formatDate(group.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* PLAN TAB */}
              <TabsContent value="plan" className="space-y-6 pt-4">
                <div className="p-4 border border-border rounded-md bg-muted/20">
                  <p className="text-sm text-muted-foreground">Current Plan Management</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    To upgrade or modify this user's subscription bypassing the payment gateway, use
                    the manual override below.
                  </p>
                </div>

                <Button className="w-full" onClick={() => setPlanOpen(true)}>
                  <IconLibrary name="credit-card" className="mr-2 size-4" />
                  Manual Plan Override
                </Button>
              </TabsContent>
            </Tabs>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Failed to load user data.
            </p>
          )}
        </SheetContent>
      </Sheet>

      {/* Dialogs */}
      {userDetails && (
        <>
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
        </>
      )}
    </>
  );
};
