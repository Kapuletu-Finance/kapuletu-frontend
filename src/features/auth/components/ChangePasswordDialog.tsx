"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, RefreshCw } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordRequirements } from "@/features/auth/components/PasswordRequirements";
import { type ChangePasswordFormData, changePasswordSchema } from "@/features/auth/schemas";
import { useChangePasswordMutation } from "@/features/auth/services/mutations";

export const ChangePasswordDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const changePasswordMutation = useChangePasswordMutation();

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      passwordForm.reset();
    }
  }, [open, passwordForm]);

  const onPasswordSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        passwordForm.reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Update your password to keep your account secure.</DialogDescription>
        </DialogHeader>

        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 py-2">
            <fieldset disabled={changePasswordMutation.isPending} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="oldPassword"
                render={({ field, fieldState }) => (
                  <Field className="space-y-2" data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor={field.name} required>
                      Current Password
                    </FieldLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <PasswordInput
                        id={field.name}
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
                control={passwordForm.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <Field className="space-y-2" data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor={field.name} required>
                      New Password
                    </FieldLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <PasswordInput
                        id={field.name}
                        className="pl-10"
                        {...field}
                        aria-invalid={!!fieldState.error}
                      />
                    </div>
                    <PasswordRequirements password={field.value} />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmNewPassword"
                render={({ field, fieldState }) => (
                  <Field className="space-y-2" data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor={field.name} required>
                      Confirm New Password
                    </FieldLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <PasswordInput
                        id={field.name}
                        className="pl-10"
                        {...field}
                        aria-invalid={!!fieldState.error}
                      />
                    </div>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={changePasswordMutation.isPending}>
                  Update Password
                </Button>
              </div>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
