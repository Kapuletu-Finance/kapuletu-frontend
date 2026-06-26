"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Phone } from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ForgotPasswordFormData, forgotPasswordSchema } from "@/features/auth/schemas";

import { useForgotPasswordMutation } from "@/features/auth/services/mutations";

export const ForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordFormData>({
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={forgotPasswordMutation.isPending} className="space-y-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel required>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4" />
                        </div>
                        <Input
                          type="tel"
                          placeholder="+254 7XX XXXXXX"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-4"
                isLoading={forgotPasswordMutation.isPending}
              >
                Send Reset Link
              </Button>
            </fieldset>
          </form>
        </Form>
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
