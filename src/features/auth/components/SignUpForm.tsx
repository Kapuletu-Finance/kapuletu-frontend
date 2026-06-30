"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type SignUpFormData, signUpSchema } from "@/features/auth/schemas";
import { useSignUpMutation } from "@/features/auth/services/mutations";

export const SignUpForm = () => {
  const signUpMutation = useSignUpMutation();

  const form = useForm<SignUpFormData & { showPassword?: boolean }>({
    defaultValues: {
      confirmPassword: "",
      consent: false,
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      phoneNumber: "",
      role: "treasurer",
      showPassword: false,
    },
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    signUpMutation.mutate(data);
  };

  return (
    <div className="w-full pb-4">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-xl font-bold mb-2">
          Welcome to <span className="text-primary">Kapu</span>
          <span className="text-refined-blue">Letu</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
          >
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
                    <FieldLabel htmlFor={field.name} className="text-xs font-bold text-foreground">
                      First Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="John"
                      {...field}
                      className="bg-muted/50 rounded-xl"
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
                    <FieldLabel htmlFor={field.name} className="text-xs font-bold text-foreground">
                      Last Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="Doe"
                      {...field}
                      className="bg-muted/50 rounded-xl"
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
                  <FieldLabel htmlFor={field.name} className="text-xs font-bold text-foreground">
                    Email Address
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="m@example.com"
                    className="bg-muted/50 rounded-xl"
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
                  <FieldLabel htmlFor={field.name} className="text-xs font-bold text-foreground">
                    Phone Number
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="tel"
                    placeholder="+254..."
                    className="bg-muted/50 rounded-xl"
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
                  <FieldLabel htmlFor={field.name} className="text-xs font-bold text-foreground">
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      type="password"
                      placeholder="Enter password"
                      className="bg-muted/50 pr-10 rounded-xl"
                      {...field}
                      aria-invalid={!!form.formState.errors.password}
                    />
                    <div className="absolute right-0 top-0 h-full flex items-center justify-center">
                      <Tooltip>
                        <TooltipTrigger
                          type="button"
                          className="px-3 py-2 text-muted-foreground hover:text-foreground focus:outline-none flex items-center justify-center"
                        >
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent
                          className="bg-refined-blue text-white [&_.fill-foreground]:bg-refined-blue [&_.fill-foreground]:fill-refined-blue"
                          side="top"
                          align="center"
                          sideOffset={8}
                        >
                          <p>Password must be at least 8 characters</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
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
                <Field data-invalid={!!form.formState.errors.confirmPassword}>
                  <FieldLabel htmlFor={field.name} className="text-xs font-bold text-foreground">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="password"
                    placeholder="Enter password"
                    className="bg-muted/50 rounded-xl"
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
                className="w-full rounded-xl font-medium py-6"
                isLoading={signUpMutation.isPending}
              >
                Create Account
              </Button>
            </div>

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
                    className="mt-0.5 size-5 border-2 rounded-sm"
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
                      <FieldError>{form.formState.errors.consent.message}</FieldError>
                    )}
                  </div>
                </Field>
              )}
            />
          </fieldset>
        </form>
      </Form>
    </div>
  );
};
