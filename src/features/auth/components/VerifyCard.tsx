"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { type VerifyFormData, verifySchema } from "@/features/auth/schemas";
import {
  useResend2FAMutation,
  useResendCodeMutation,
  useVerify2FAMutation,
  useVerifyEmailConfirmMutation,
  useVerifyEmailRequestMutation,
  useVerifyPhoneConfirmMutation,
} from "@/features/auth/services/mutations";
import { useGetMeQuery } from "@/features/auth/services/queries";
import { SuccessLoader } from "@/features/shared/components/SuccessLoader";
import { cn } from "@/lib/utils";

interface VerifyCardProps {
  type: "email" | "phone" | "2fa";
}

export const VerifyCard: React.FC<VerifyCardProps> = ({ type }) => {
  const router = useRouter();
  const { data: user } = useGetMeQuery({ enabled: type !== "2fa" });
  const isPhone = type === "phone";
  const is2FA = type === "2fa";

  const form = useForm<VerifyFormData>({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(verifySchema),
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const otp = params.get("otp");
      const token = params.get("token");
      if (otp) {
        form.setValue("code", otp, { shouldValidate: true });
      }
    }
  }, [form]);

  const emailConfirmMutation = useVerifyEmailConfirmMutation();
  const phoneConfirmMutation = useVerifyPhoneConfirmMutation();
  const emailRequestMutation = useVerifyEmailRequestMutation();
  const phoneRequestMutation = useResendCodeMutation();

  const verify2FAMutation = useVerify2FAMutation();
  const resend2FAMutation = useResend2FAMutation();

  const verifyMutation = is2FA
    ? verify2FAMutation
    : isPhone
      ? phoneConfirmMutation
      : emailConfirmMutation;
  const requestMutation = is2FA
    ? resend2FAMutation
    : isPhone
      ? phoneRequestMutation
      : emailRequestMutation;

  const isError = !!form.formState.errors.code || verifyMutation.isError;

  const onSubmit = (data: VerifyFormData) => {
    if (is2FA) {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token") || "";
      if (!token) {
        toast.error("Invalid or missing 2FA token.");
        return;
      }
      // Note: verify2FAMutation internal onSuccess handles the routing.
      verify2FAMutation.mutate({ token, code: data.code });
      return;
    }

    const finalIdentifier = user?.phone_number || "";

    // If phone verification, we need the identifier
    if (isPhone) {
      if (!finalIdentifier) {
        toast.error("Value error, identifier cannot be empty");
        return;
      }

      phoneConfirmMutation.mutate(
        { ...data, identifier: finalIdentifier },
        {
          onSuccess: () => {
            setTimeout(() => router.push("/treasurer"), 2000);
          },
        },
      );
    } else {
      emailConfirmMutation.mutate(data, {
        onSuccess: () => {
          setTimeout(() => router.push("/sign-in"), 2000);
        },
      });
    }
  };

  const handleResend = useCallback(() => {
    if (is2FA) {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token") || "";
      if (!token) {
        toast.error("Invalid or missing 2FA token.");
        return;
      }
      resend2FAMutation.mutate({ token });
      return;
    }

    const finalIdentifier = user?.phone_number || "";

    if (isPhone) {
      if (!finalIdentifier) {
        toast.error("Value error, identifier cannot be empty");
        return;
      }
      phoneRequestMutation.mutate({ identifier: finalIdentifier });
    } else {
      emailRequestMutation.mutate();
    }
  }, [
    user?.phone_number,
    isPhone,
    is2FA,
    phoneRequestMutation,
    emailRequestMutation,
    resend2FAMutation,
  ]);

  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (is2FA) return; // For 2FA, the initial login request sent the code already
    if (isPhone && !user?.phone_number) return;

    if (!hasRequestedRef.current) {
      hasRequestedRef.current = true;
      handleResend();
    }
  }, [user?.phone_number, isPhone, is2FA, handleResend]);

  if (verifyMutation.isPending) {
    return (
      <div className="w-full pb-4 flex flex-col items-center">
        <div className="mb-6 mt-4">
          <div className="w-12 h-12 border-[3.5px] border-transparent border-t-primary rounded-full animate-spin" />
        </div>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[17px] font-bold text-foreground mb-1">Verifying</h1>
          <p className="text-[13px] text-muted-foreground">Almost there...</p>
        </div>
      </div>
    );
  }

  if (verifyMutation.isSuccess) {
    return (
      <div className="w-full pb-4 flex flex-col items-center">
        <div className="mb-6 mt-4">
          <SuccessLoader size={48} />
        </div>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[17px] font-bold text-foreground mb-1">
            {is2FA ? "Login successful!" : "Verification complete!"}
          </h1>
          <p className="text-[13px] text-muted-foreground">
            {is2FA
              ? "Your identity has been confirmed. Redirecting..."
              : `Your ${isPhone ? "phone number" : "email address"} has been verified.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-4">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Enter verification code</h1>
        <p
          className={cn(
            "text-sm text-center px-4",
            isError ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {isError
            ? "The code you entered is wrong. Please try again"
            : is2FA
              ? "We sent a 6-digit code to your 2FA channel"
              : `We sent a 6-digit code to your ${isPhone ? "WhatsApp" : "email address"}`}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={verifyMutation.isPending} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <Field className="flex flex-col items-center">
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot
                        index={0}
                        className={cn(
                          "w-12 h-14 text-lg border-black border",
                          isError && "border-destructive",
                        )}
                      />
                      <InputOTPSlot
                        index={1}
                        className={cn(
                          "w-12 h-14 text-lg border-black border",
                          isError && "border-destructive",
                        )}
                      />
                      <InputOTPSlot
                        index={2}
                        className={cn(
                          "w-12 h-14 text-lg border-black border",
                          isError && "border-destructive",
                        )}
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator className="px-2" />
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot
                        index={3}
                        className={cn(
                          "w-12 h-14 text-lg border-black border",
                          isError && "border-destructive",
                        )}
                      />
                      <InputOTPSlot
                        index={4}
                        className={cn(
                          "w-12 h-14 text-lg border-black border",
                          isError && "border-destructive",
                        )}
                      />
                      <InputOTPSlot
                        index={5}
                        className={cn(
                          "w-12 h-14 text-lg border-black border",
                          isError && "border-destructive",
                        )}
                      />
                    </InputOTPGroup>
                  </InputOTP>
                  {form.formState.errors.code && (
                    <FieldError>{form.formState.errors.code.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="text-center text-[13px] text-muted-foreground pt-2">
              Didn&apos;t receive the code?{" "}
              <Button
                variant="link"
                type="button"
                onClick={handleResend}
                disabled={requestMutation.isPending}
                className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground p-0 h-auto font-normal"
              >
                Resend
              </Button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full font-medium py-6"
                isLoading={verifyMutation.isPending}
              >
                Verify
              </Button>
            </div>

            {!isPhone && !is2FA && (
              <div className="text-center pt-2">
                <Button
                  variant="link"
                  type="button"
                  onClick={() => router.back()}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 p-0 h-auto"
                >
                  Skip for now
                </Button>
              </div>
            )}
          </fieldset>
        </form>
      </Form>
    </div>
  );
};
