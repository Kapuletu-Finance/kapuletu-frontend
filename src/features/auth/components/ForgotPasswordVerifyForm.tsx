"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForgotPasswordMutation } from "@/features/auth/services/mutations";
import { cn } from "@/lib/utils";

// A small custom schema since we only need the code here.
const verifyCodeSchema = z.object({
  code: z
    .string({ message: "Verification code is required." })
    .length(6, "Verification code must be exactly 6 digits."),
  identifier: z.string(),
});

type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;

export const ForgotPasswordVerifyForm = () => {
  const router = useRouter();

  const form = useForm<VerifyCodeFormData>({
    defaultValues: {
      code: "",
      identifier: "",
    },
    resolver: zodResolver(verifyCodeSchema),
    mode: "onChange",
  });

  const forgotPasswordMutation = useForgotPasswordMutation();

  const [identifier] = useQueryState("identifier");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (identifier) {
      form.setValue("identifier", identifier);
    } else {
      router.push("/forgot-password");
    }
  }, [form, router, identifier]);

  const onSubmit = (data: VerifyCodeFormData) => {
    startTransition(() => {
      router.push(
        `/forgot-password/reset?identifier=${encodeURIComponent(data.identifier)}&code=${encodeURIComponent(data.code)}`,
      );
    });
  };

  const handleResend = () => {
    const identifier = form.getValues("identifier");
    if (identifier) {
      forgotPasswordMutation.mutate({ identifier });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pb-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-xl font-bold mb-2">Enter verification code</h1>
        <p className="text-sm text-center text-muted-foreground px-4">
          We sent a 6-digit code to your email and WhatsApp
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <fieldset disabled={forgotPasswordMutation.isPending} className="space-y-5">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <Field
                  className="space-y-2 flex flex-col items-center"
                  data-invalid={!!form.formState.errors.code}
                >
                  <div className="flex justify-center w-full mt-4">
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot
                          index={0}
                          className={cn(
                            "w-12 h-14 text-lg border-black border",
                            !!form.formState.errors.code && "border-destructive",
                          )}
                        />
                        <InputOTPSlot
                          index={1}
                          className={cn(
                            "w-12 h-14 text-lg border-black border",
                            !!form.formState.errors.code && "border-destructive",
                          )}
                        />
                        <InputOTPSlot
                          index={2}
                          className={cn(
                            "w-12 h-14 text-lg border-black border",
                            !!form.formState.errors.code && "border-destructive",
                          )}
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator className="px-2" />
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot
                          index={3}
                          className={cn(
                            "w-12 h-14 text-lg border-black border",
                            !!form.formState.errors.code && "border-destructive",
                          )}
                        />
                        <InputOTPSlot
                          index={4}
                          className={cn(
                            "w-12 h-14 text-lg border-black border",
                            !!form.formState.errors.code && "border-destructive",
                          )}
                        />
                        <InputOTPSlot
                          index={5}
                          className={cn(
                            "w-12 h-14 text-lg border-black border",
                            !!form.formState.errors.code && "border-destructive",
                          )}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {form.formState.errors.code && (
                    <FieldError className="text-center mt-2">
                      {form.formState.errors.code.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />

            <div className="text-center text-sm pt-4">
              <span className="text-muted-foreground">Didn&apos;t receive the code? </span>
              <Button
                variant="link"
                size="sm"
                type="button"
                onClick={handleResend}
                disabled={forgotPasswordMutation.isPending}
              >
                Resend
              </Button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full font-medium py-6"
                disabled={form.watch("code")?.length !== 6 || isPending}
                isLoading={isPending}
              >
                Verify
              </Button>
            </div>

            <div className="text-center text-[13px] pt-4 leading-tight">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Change email or phone number
              </Link>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};
