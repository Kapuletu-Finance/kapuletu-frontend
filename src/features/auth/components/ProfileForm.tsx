"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail, Phone, RefreshCw, User as UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type ChangePasswordFormData,
  changePasswordSchema,
  type UpdateProfileFormData,
  updateProfileSchema,
} from "@/features/auth/schemas";
import {
  useChangePasswordMutation,
  useUpdateProfileMutation,
} from "@/features/auth/services/mutations";
import { useGetMeQuery } from "@/features/auth/services/queries";

export const ProfileForm = () => {
  const { data: user, isLoading: isUserLoading } = useGetMeQuery();

  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();

  const profileForm = useForm<UpdateProfileFormData>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
    resolver: zodResolver(updateProfileSchema),
    values: user
      ? {
          email: user.email || "",
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          phoneNumber: user.phone_number || "",
        }
      : undefined,
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onProfileSubmit = (data: UpdateProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        passwordForm.reset();
      },
    });
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile and security preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <Input
                        id="firstName"
                        type="text"
                        className="pl-10"
                        {...profileForm.register("firstName")}
                      />
                    </div>
                    {profileForm.formState.errors.firstName && (
                      <p className="text-sm mt-1">
                        {profileForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <Input
                        id="lastName"
                        type="text"
                        className="pl-10"
                        {...profileForm.register("lastName")}
                      />
                    </div>
                    {profileForm.formState.errors.lastName && (
                      <p className="text-sm mt-1">
                        {profileForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        {...profileForm.register("email")}
                      />
                    </div>
                    {profileForm.formState.errors.email && (
                      <p className="text-sm mt-1">{profileForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4" />
                      </div>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        className="pl-10"
                        {...profileForm.register("phoneNumber")}
                      />
                    </div>
                    {profileForm.formState.errors.phoneNumber && (
                      <p className="text-sm mt-1">
                        {profileForm.formState.errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" required>
                    Current Password
                  </Label>
                  <div className="relative max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="pl-10"
                      {...passwordForm.register("currentPassword")}
                    />
                  </div>
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm mt-1">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" required>
                    New Password
                  </Label>
                  <div className="relative max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RefreshCw className="h-4 w-4" />
                    </div>
                    <Input
                      id="newPassword"
                      type="password"
                      className="pl-10"
                      {...passwordForm.register("newPassword")}
                    />
                  </div>
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword" required>
                    Confirm New Password
                  </Label>
                  <div className="relative max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      className="pl-10"
                      {...passwordForm.register("confirmNewPassword")}
                    />
                  </div>
                  {passwordForm.formState.errors.confirmNewPassword && (
                    <p className="text-sm mt-1">
                      {passwordForm.formState.errors.confirmNewPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={changePasswordMutation.isPending}>
                  {changePasswordMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileForm;
