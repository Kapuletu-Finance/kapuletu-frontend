"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { useVerifyMutation } from "@/features/auth/services/mutations";
import { cn } from "@/lib/utils";

interface VerifyCardProps {
  type: "email" | "phone";
}

export const VerifyCard: React.FC<VerifyCardProps> = ({ type }) => {
  const router = useRouter();
  const isPhone = type === "phone";

  const form = useForm<VerifyFormData>({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(verifySchema),
  });

  const verifyMutation = useVerifyMutation();

  const isError = !!form.formState.errors.code || verifyMutation.isError;

  const onSubmit = (data: VerifyFormData) => {
    verifyMutation.mutate(data, {
      onSuccess: () => {
        setTimeout(() => router.push("/sign-in"), 2000);
      },
    });
  };

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
            : `We sent a 6-digit code to your ${isPhone ? "phone number" : "email address"}`}
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
                          "w-12 h-14 text-xl rounded-md border-black border-2",
                          isError && "border-destructive",
                        )}
                      />
                      <InputOTPSlot
                        index={1}
                        className={cn(
                          "w-12 h-14 text-xl rounded-md border-black border-2",
                          isError && "border-destructive",
                        )}
                      />
                      <InputOTPSlot
                        index={2}
                        className={cn(
                          "w-12 h-14 text-xl rounded-md border-black border-2",
                          isError && "border-destructive",
                        )}
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator className="px-4" />
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot
                        index={3}
                        className={cn(
                          "w-12 h-14 text-xl rounded-md border-black border-2",
                          isError && "border-destructive",
                        )}
                      />
                      <InputOTPSlot
                        index={4}
                        className={cn(
                          "w-12 h-14 text-xl rounded-md border-black border-2",
                          isError && "border-destructive",
                        )}
                      />
                      <InputOTPSlot
                        index={5}
                        className={cn(
                          "w-12 h-14 text-xl rounded-md border-black border-2",
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
                className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground p-0 h-auto font-normal"
              >
                Resend
              </Button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-medium py-6"
                isLoading={verifyMutation.isPending}
              >
                Verify
              </Button>
            </div>

            {!isPhone && (
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
