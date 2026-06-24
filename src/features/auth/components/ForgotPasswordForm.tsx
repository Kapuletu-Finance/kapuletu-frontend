"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Phone } from "lucide-react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ForgotPasswordFormData, forgotPasswordSchema } from "@/features/auth/schemas";

import { useForgotPasswordMutation } from "@/features/auth/services/mutations";

export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useForgotPasswordMutation();

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="h-8 w-8" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
        <CardDescription>
          Enter your phone number and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" required>
              Phone Number
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4" />
              </div>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+254 7XX XXXXXX"
                className="pl-10"
                {...register("phoneNumber")}
              />
            </div>
            {errors.phoneNumber && <p className="text-sm mt-1">{errors.phoneNumber.message}</p>}
          </div>

          <Button type="submit" className="w-full mt-4" disabled={forgotPasswordMutation.isPending}>
            {forgotPasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <div className="text-sm">
          Remember your password?{" "}
          <Link href="/login" className="font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;
