"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Eye, EyeOff, Lock, Mail, Phone, ShieldAlert, User } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type RegisterFormData, registerSchema } from "@/features/auth/schemas";
import { useRegisterMutation } from "@/features/auth/services/mutations";

export const RegisterForm = () => {
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData & { showPassword?: boolean }>({
    defaultValues: {
      role: "treasurer",
      showPassword: false,
    },
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch("role");
  const showPassword = watch("showPassword");

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <User className="h-8 w-8" />
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight">Create an Account</CardTitle>
        <CardDescription>Join KapuLetu and start managing your Chama effectively.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name Field */}
            <div className="space-y-2">
              <Label htmlFor="firstName" required>
                First Name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="pl-10"
                  {...register("firstName")}
                />
              </div>
              {errors.firstName && <p className="text-sm mt-1">{errors.firstName.message}</p>}
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <Label htmlFor="lastName" required>
                Last Name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="pl-10"
                  {...register("lastName")}
                />
              </div>
              {errors.lastName && <p className="text-sm mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" required>
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone Number Field */}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" required>
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setValue("showPassword", !showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" required>
                Confirm Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3 pt-2">
            <Label className="block" required>
              Account Role
            </Label>
            <RadioGroup
              value={selectedRole}
              onValueChange={(value: "treasurer" | "admin") => setValue("role", value)}
              className="grid grid-cols-2 gap-4"
            >
              {/* Treasurer Option */}
              <div className="relative">
                <RadioGroupItem value="treasurer" id="role-treasurer" className="peer sr-only" />
                <Label
                  htmlFor="role-treasurer"
                  className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    selectedRole === "treasurer"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Building2 className="mb-3 h-6 w-6" />
                  <span className="text-sm font-semibold">Treasurer</span>
                  <span className="text-xs mt-1 text-center font-normal">
                    Manage Chama finances
                  </span>
                </Label>
              </div>

              {/* Admin Option */}
              <div className="relative">
                <RadioGroupItem value="admin" id="role-admin" className="peer sr-only" />
                <Label
                  htmlFor="role-admin"
                  className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    selectedRole === "admin"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <ShieldAlert className="mb-3 h-6 w-6" />
                  <span className="text-sm font-semibold">System Admin</span>
                  <span className="text-xs mt-1 text-center font-normal">
                    Global system oversight
                  </span>
                </Label>
              </div>
            </RadioGroup>
            {errors.role && <p className="text-sm mt-1">{errors.role.message}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4" isLoading={registerMutation.isPending}>
            Create Account
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <div className="text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
