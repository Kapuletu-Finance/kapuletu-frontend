"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PasswordInput } from "@/components/ui/password-input";
import { type SignInFormData, signInSchema } from "@/features/auth/schemas";
import { useSignInMutation, useVerify2FAMutation } from "@/features/auth/services/mutations";

export const SignInForm = () => {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [twoFaToken, setTwoFaToken] = useState<string>("");
  const [otpCode, setOtpCode] = useState("");

  const form = useForm<SignInFormData>({
    defaultValues: {
      identifier: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useSignInMutation();
  const verify2FAMutation = useVerify2FAMutation();

  const onSubmit = (data: SignInFormData) => {
    signInMutation.mutate(data, {
      onSuccess: (res) => {
        if (res.requires_2fa && res.two_fa_token) {
          setTwoFaToken(res.two_fa_token);
          setStep("2fa");
        }
      },
    });
  };

  const onVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) return;
    verify2FAMutation.mutate({ token: twoFaToken, code: otpCode });
  };

  if (step === "2fa") {
    return (
      <div className="w-full pb-4">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Two-Factor Authentication</h1>
          <p className="text-sm text-muted-foreground px-4">
            Enter the 6-digit code sent to your 2FA channel to continue.
          </p>
        </div>

        <form onSubmit={onVerify2FA} className="space-y-6 flex flex-col items-center">
          <fieldset
            disabled={verify2FAMutation.isPending}
            className="space-y-6 w-full flex flex-col items-center"
          >
            <InputOTP
              maxLength={6}
              value={otpCode}
              onChange={setOtpCode}
              disabled={verify2FAMutation.isPending}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <div className="w-full pt-4 space-y-3">
              <Button
                type="submit"
                className="w-full font-medium py-6"
                isLoading={verify2FAMutation.isPending}
                disabled={otpCode.length !== 6}
              >
                Verify Code
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep("credentials")}
                disabled={verify2FAMutation.isPending}
              >
                Back to Sign in
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full pb-4">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Welcome back to <span className="text-primary">Kapu</span>
          <span className="text-refined-blue">Letu</span>
        </h1>
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
