"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ForgotPasswordFormData, forgotPasswordSchema } from "@/features/auth/schemas";
import { useForgotPasswordMutation } from "@/features/auth/services/mutations";

export const ForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordFormData>({
    defaultValues: {
      identifier: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useForgotPasswordMutation();

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-md mx-auto pb-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-xl font-bold mb-2">Reset password</h1>
        <p className="text-sm text-center text-muted-foreground px-4">
          Enter your phone number and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <fieldset disabled={forgotPasswordMutation.isPending} className="space-y-5">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.identifier}>
                  <FieldLabel htmlFor={field.name} className="text-xs font-bold text-foreground">
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

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full font-medium py-6"
                isLoading={forgotPasswordMutation.isPending}
              >
                Send Reset Link
              </Button>
            </div>

            <div className="text-center text-[13px] text-muted-foreground pt-2 leading-tight">
              Remember your password?{" "}
              <Link
                href="/sign-in"
                className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
              >
                Sign in
              </Link>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};
