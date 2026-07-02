"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ResetPasswordFormData, resetPasswordSchema } from "@/features/auth/schemas";
import { useResetPasswordMutation } from "@/features/auth/services/mutations";

const ResetPasswordFormContent = () => {
  const router = useRouter();
  const form = useForm<ResetPasswordFormData>({
    defaultValues: {
      code: "",
      confirmPassword: "",
      identifier: "",
      password: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetPasswordMutation = useResetPasswordMutation();

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        setTimeout(() => router.push("/sign-in"), 3000);
      },
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="h-8 w-8" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Set New Password</CardTitle>
        <CardDescription>Create a new, strong password for your account.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={resetPasswordMutation.isPending} className="space-y-6">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <Field className="space-y-2" data-invalid={!!form.formState.errors.identifier}>
                    <FieldLabel htmlFor={field.name}>Email or Phone Number</FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="m@example.com or +254..."
                      {...field}
                      aria-invalid={!!form.formState.errors.identifier}
                    />
                    {form.formState.errors.identifier && (
                      <FieldError>{form.formState.errors.identifier.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <Field className="space-y-2" data-invalid={!!form.formState.errors.code}>
                    <FieldLabel htmlFor={field.name}>Verification Code</FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="6-digit code"
                      {...field}
                      aria-invalid={!!form.formState.errors.code}
                    />
                    {form.formState.errors.code && (
                      <FieldError>{form.formState.errors.code.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <Field className="space-y-2" data-invalid={!!form.formState.errors.password}>
                    <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id={field.name}
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...field}
                        aria-invalid={!!form.formState.errors.password}
                      />
                    </div>
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
                  <Field
                    className="space-y-2"
                    data-invalid={!!form.formState.errors.confirmPassword}
                  >
                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id={field.name}
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...field}
                        aria-invalid={!!form.formState.errors.confirmPassword}
                      />
                    </div>
                    {form.formState.errors.confirmPassword && (
                      <FieldError>{form.formState.errors.confirmPassword.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-4"
                isLoading={resetPasswordMutation.isPending}
              >
                Reset Password
              </Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <div className="text-sm">
          Remember your password?{" "}
          <Link href="/sign-in" className="font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export const ResetPasswordForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
};

export default ResetPasswordForm;
