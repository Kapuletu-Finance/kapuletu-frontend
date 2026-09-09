"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordRequirements } from "@/features/auth/components/PasswordRequirements";
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
import IconLibrary from "@/features/shared/components/IconLibrary";

export const ProfileForm = () => {
  const { data: user, isLoading: isUserLoading } = useGetMeQuery();

  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();

  const profileForm = useForm<UpdateProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
    resolver: zodResolver(updateProfileSchema),
    values: user
      ? {
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
        <IconLibrary name="loading" className="h-8 w-8 animate-spin text-muted-foreground" />
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
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <fieldset disabled={updateProfileMutation.isPending} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="firstName"
                        render={({ field, fieldState }) => (
                          <Field className="space-y-2" data-invalid={!!fieldState.error}>
                            <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IconLibrary name="member" className="h-4 w-4" />
                              </div>
                              <Input
                                id={field.name}
                                type="text"
                                className="pl-10"
                                {...field}
                                aria-invalid={!!fieldState.error}
                              />
                            </div>
                            <FieldError>{fieldState.error?.message}</FieldError>
                          </Field>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="lastName"
                        render={({ field, fieldState }) => (
                          <Field className="space-y-2" data-invalid={!!fieldState.error}>
                            <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IconLibrary name="member" className="h-4 w-4" />
                              </div>
                              <Input
                                id={field.name}
                                type="text"
                                className="pl-10"
                                {...field}
                                aria-invalid={!!fieldState.error}
                              />
                            </div>
                            <FieldError>{fieldState.error?.message}</FieldError>
                          </Field>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="phoneNumber"
                        render={({ field, fieldState }) => (
                          <Field className="space-y-2" data-invalid={!!fieldState.error}>
                            <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IconLibrary name="phone" className="h-4 w-4" />
                              </div>
                              <Input
                                id={field.name}
                                type="tel"
                                className="pl-10"
                                {...field}
                                aria-invalid={!!fieldState.error}
                              />
                            </div>
                            <FieldError>{fieldState.error?.message}</FieldError>
                          </Field>
                        )}
                      />
                    </div>

                    <Button type="submit" isLoading={updateProfileMutation.isPending}>
                      Save Changes
                    </Button>
                  </fieldset>
                </form>
              </Form>
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
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                  <fieldset disabled={changePasswordMutation.isPending} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="oldPassword"
                      render={({ field, fieldState }) => (
                        <Field className="space-y-2" data-invalid={!!fieldState.error}>
                          <FieldLabel htmlFor={field.name} isRequired>
                            Current Password
                          </FieldLabel>
                          <div className="relative max-w-sm">
                            <PasswordInput
                              id={field.name}
                              {...field}
                              aria-invalid={!!fieldState.error}
                            />
                          </div>
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </Field>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field, fieldState }) => (
                        <Field className="space-y-2" data-invalid={!!fieldState.error}>
                          <FieldLabel htmlFor={field.name} isRequired>
                            New Password
                          </FieldLabel>
                          <div className="relative max-w-sm">
                            <PasswordInput
                              id={field.name}
                              {...field}
                              aria-invalid={!!fieldState.error}
                            />
                          </div>
                          <PasswordRequirements password={passwordForm.watch("newPassword")} />
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </Field>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmNewPassword"
                      render={({ field, fieldState }) => (
                        <Field className="space-y-2" data-invalid={!!fieldState.error}>
                          <FieldLabel htmlFor={field.name} isRequired>
                            Confirm New Password
                          </FieldLabel>
                          <div className="relative max-w-sm">
                            <PasswordInput
                              id={field.name}
                              {...field}
                              aria-invalid={!!fieldState.error}
                            />
                          </div>
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </Field>
                      )}
                    />

                    <Button type="submit" isLoading={changePasswordMutation.isPending}>
                      Update Password
                    </Button>
                  </fieldset>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileForm;
