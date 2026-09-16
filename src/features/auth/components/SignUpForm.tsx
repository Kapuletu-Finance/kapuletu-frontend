"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordRequirements } from "@/features/auth/components/PasswordRequirements";
import { type SignUpFormData, signUpSchema } from "@/features/auth/schemas";
import { useSignUpMutation } from "@/features/auth/services/mutations";
import { usePublicSystemConfigQuery } from "@/features/auth/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const SignUpForm = () => {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite_token") || searchParams.get("invite");

  const { data: config, isLoading: isConfigLoading } = usePublicSystemConfigQuery();
  const signUpMutation = useSignUpMutation();

  const form = useForm<SignUpFormData & { showPassword?: boolean }>({
    defaultValues: {
      confirmPassword: "",
      consent: false,
      marketingConsent: false,
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      phoneNumber: "",
      invite_token: inviteToken || undefined,
    },
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    signUpMutation.mutate(data);
  };

  if (isConfigLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const signupsClosed = config && config.open_signups === false && !inviteToken;

  if (signupsClosed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="rounded-full bg-destructive/10 p-6">
          <IconLibrary name="alert" className="size-12 text-destructive" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Signups Closed</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {config.signup_restricted_message ||
              "Public registrations are currently closed. An invite token is required."}
          </p>
        </div>
        <Button
          render={<Link href="/sign-in">Return to Sign In</Link>}
          variant="outline"
          className="mt-4"
        />
      </div>
    );
  }

  return (
    <div className="w-full pb-4">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-xl font-bold mb-2">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-sm font-medium text-refined-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <fieldset disabled={signUpMutation.isPending} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <Field data-invalid={!!form.formState.errors.firstName}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs font-bold text-foreground"
                      isRequired
                    >
                      First Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="John"
                      {...field}
                      className="bg-muted/50"
                      aria-invalid={!!form.formState.errors.firstName}
                    />
                    {form.formState.errors.firstName && (
                      <FieldError>{form.formState.errors.firstName.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <Field data-invalid={!!form.formState.errors.lastName}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs font-bold text-foreground"
                      isRequired
                    >
                      Last Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="Doe"
                      {...field}
                      className="bg-muted/50"
                      aria-invalid={!!form.formState.errors.lastName}
                    />
                    {form.formState.errors.lastName && (
                      <FieldError>{form.formState.errors.lastName.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.email}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs font-bold text-foreground"
                    isRequired
                  >
                    Email Address
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="m@example.com"
                    className="bg-muted/50"
                    {...field}
                    aria-invalid={!!form.formState.errors.email}
                  />
                  {form.formState.errors.email && (
                    <FieldError>{form.formState.errors.email.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.phoneNumber}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs font-bold text-foreground"
                    isRequired
                  >
                    Phone Number
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="tel"
                    placeholder="+254..."
                    className="bg-muted/50"
                    {...field}
                    aria-invalid={!!form.formState.errors.phoneNumber}
                  />
                  {form.formState.errors.phoneNumber && (
                    <FieldError>{form.formState.errors.phoneNumber.message}</FieldError>
                  )}
                </Field>
              )}
            />

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
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <Field
                  orientation="horizontal"
                  className="flex flex-row items-start space-x-3 space-y-0 pt-2"
                  data-invalid={!!form.formState.errors.consent}
                >
                  <Checkbox
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={!!form.formState.errors.consent}
                    className="mt-0.5 size-5 border-2"
                  />
                  <div className="space-y-1 leading-none flex-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="block text-sm text-muted-foreground font-normal leading-relaxed"
                    >
                      By checking this box, you agree to our{" "}
                      <Link
                        href="/terms"
                        className="underline decoration-border underline-offset-2 hover:text-foreground"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="underline decoration-border underline-offset-2 hover:text-foreground"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </FieldLabel>
                    {form.formState.errors.consent && (
                      <FieldError className="mt-1">
                        {form.formState.errors.consent.message}
                      </FieldError>
                    )}
                  </div>
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="marketingConsent"
              render={({ field }) => (
                <Field
                  orientation="horizontal"
                  className="flex flex-row items-start space-x-3 space-y-0 pt-2"
                >
                  <Checkbox
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5 size-5 border-2"
                  />
                  <div className="space-y-1 leading-none flex-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="block text-sm text-muted-foreground font-normal leading-relaxed"
                    >
                      I would like to receive updates, marketing, and promotional offers.
                    </FieldLabel>
                  </div>
                </Field>
              )}
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full font-medium py-6"
                isLoading={signUpMutation.isPending}
              >
                Create Account
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};
