"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { env } from "@/env";
import { AUTH_LOCAL_STORAGE_KEYS } from "@/features/auth/keys";
import { type SignInFormData, signInSchema } from "@/features/auth/schemas";
import { useSignInMutation } from "@/features/auth/services/mutations";

export const SignInForm = () => {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Clear stale state for multi-account sign-ins
    deleteCookie(env.NEXT_PUBLIC_ROLE_COOKIE_NAME, { path: "/" });
    deleteCookie("is_waitlisted", { path: "/" });
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEYS.VERIFY_EMAIL_ALERT_DISMISSED);
    queryClient.removeQueries({ queryKey: ["auth"] });
  }, [queryClient]);

  const form = useForm<SignInFormData>({
    defaultValues: {
      identifier: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useSignInMutation();

  const onSubmit = (data: SignInFormData) => {
    signInMutation.mutate(data, {
      onSuccess: (res) => {
        if (res.requires_2fa && res.two_fa_token) {
          router.push(`/verify-2fa?token=${res.two_fa_token}`);
        }
      },
    });
  };

  return (
    <div className="w-full pb-4">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Sign in to your account</h1>
        <p className="text-sm text-muted-foreground px-4">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-sm font-medium text-refined-blue hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {reason === "session_expired" && (
        <div className="mb-6 rounded-md bg-amber-500/15 border border-amber-500/20 p-4 text-sm text-amber-600 flex items-start gap-3">
          <svg
            aria-label="Warning"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-alert-triangle mt-0.5 shrink-0"
          >
            <title>Warning</title>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          <p>
            <strong>Session Expired.</strong>
            <br />
            Your session has expired due to inactivity or a security update. Please log in again to
            continue.
          </p>
        </div>
      )}

      {reason === "waitlist_approved" && (
        <div className="mb-6 rounded-md bg-green-500/15 border border-green-500/20 p-4 text-sm text-green-600 flex items-start gap-3">
          <svg
            aria-label="Success"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-check-circle mt-0.5 shrink-0"
          >
            <title>Success</title>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
          <p>
            <strong>Your account is ready!</strong>
            <br />
            You have been approved from the waitlist. Please sign in to access your dashboard.
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <fieldset disabled={signInMutation.isPending} className="space-y-5">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.identifier}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs font-bold text-foreground"
                    isRequired
                  >
                    Email or Phone Number
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="text"
                    placeholder="m@example.com or +254..."
                    className="bg-muted/50"
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
              name="password"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.password}>
                  <div className="flex items-center justify-between w-full">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs font-bold text-foreground"
                      isRequired
                    >
                      Password
                    </FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-normal text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <PasswordInput
                    id={field.name}
                    placeholder="**********"
                    className="bg-muted/50"
                    {...field}
                    aria-invalid={!!form.formState.errors.password}
                  />
                  {form.formState.errors.password && (
                    <FieldError>{form.formState.errors.password.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full font-medium py-6"
                isLoading={signInMutation.isPending}
              >
                Sign in
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};
