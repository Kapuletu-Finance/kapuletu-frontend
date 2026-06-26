"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { type VerifyFormData, verifySchema } from "@/features/auth/schemas";
import { useVerifyMutation } from "@/features/auth/services/mutations";

export const VerifyForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  });

  const verifyMutation = useVerifyMutation();

  const onSubmit = (data: VerifyFormData) => {
    verifyMutation.mutate(data, {
      onSuccess: () => {
        setTimeout(() => router.push("/login"), 2000);
      },
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Verify Account</CardTitle>
        <CardDescription>Enter the verification code sent to your phone/email.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code" required>
              Verification Code
            </Label>
            <div className="relative">
              <Input
                id="code"
                type="text"
                placeholder="123456"
                className="text-center tracking-widest text-lg"
                {...register("code")}
              />
            </div>
            {errors.code && <p className="text-sm mt-1 text-center">{errors.code.message}</p>}
          </div>

          <Button type="submit" className="w-full mt-4" isLoading={verifyMutation.isPending}>
            Verify Code
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <div className="text-sm">
          Didn't receive a code?{" "}
          <Button variant="link" className="p-0 h-auto font-medium" disabled>
            Resend
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VerifyForm;
