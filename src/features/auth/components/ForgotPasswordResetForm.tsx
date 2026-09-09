"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { ForgotPasswordSuccessView } from "@/features/auth/components/ForgotPasswordSuccessView";
import { PasswordRequirements } from "@/features/auth/components/PasswordRequirements";
import { type ResetPasswordFormData, resetPasswordSchema } from "@/features/auth/schemas";
import { useResetPasswordMutation } from "@/features/auth/services/mutations";

export const ForgotPasswordResetForm = () => {
  const router = useRouter();

  const form = useForm<ResetPasswordFormData>({
    defaultValues: {
      code: "",
      confirmPassword: "",
      identifier: "",
      password: "",
    },
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const resetPasswordMutation = useResetPasswordMutation();

  const [identifier] = useQueryState("identifier");
  const [code] = useQueryState("code");

  useEffect(() => {
    if (identifier && code) {
      form.setValue("identifier", identifier);
      form.setValue("code", code);
    } else {
      router.push("/forgot-password");
    }
  }, [form, router, identifier, code]);

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  if (resetPasswordMutation.isSuccess) {
    return <ForgotPasswordSuccessView />;
  }

  return (
    <div className="w-full max-w-md mx-auto pb-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-xl font-bold mb-2">Reset your password</h1>
        <p className="text-sm text-center text-muted-foreground px-4">Enter your new password.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <fieldset disabled={resetPasswordMutation.isPending} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.password}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs font-bold text-foreground"
                    isRequired
                  >
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <PasswordInput
                      id={field.name}
                      placeholder="Enter password"
                      className="bg-muted/50"
                      {...field}
                      aria-invalid={!!form.formState.errors.password}
                    />
                  </div>
                  <PasswordRequirements password={form.watch("password")} />
                  {form.formState.errors.password && (
                    <FieldError>{form.formState.errors.password.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.confirmPassword}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs font-bold text-foreground"
                    isRequired
                  >
                    Confirm Password
                  </FieldLabel>
                  <PasswordInput
                    id={field.name}
                    placeholder="Enter password"
                    className="bg-muted/50"
                    {...field}
                    aria-invalid={!!form.formState.errors.confirmPassword}
                  />
                  {form.formState.errors.confirmPassword && (
                    <FieldError>{form.formState.errors.confirmPassword.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full font-medium py-6"
                isLoading={resetPasswordMutation.isPending}
              >
                Reset Password
              </Button>
            </div>

            <div className="text-center text-[13px] pt-4 leading-tight">
              <Link
                href={`/forgot-password/verify?identifier=${encodeURIComponent(identifier || "")}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                Back to verification code
              </Link>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};
