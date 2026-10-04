"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmployeeSetupMutation } from "@/features/auth/services/mutations";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const EmployeeSetupClient: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const setupMutation = useEmployeeSetupMutation();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing setup token.");
      router.push("/login");
    }
  }, [token, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setupMutation.mutate(
      { token, password },
      {
        onSuccess: () => {
          toast.success("Account setup complete! You can now login.");
          router.push("/login");
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.detail || "Failed to setup account");
        },
      },
    );
  };

  if (!token) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="mb-8 flex flex-col items-center justify-center space-y-4">
        <SiteLogo />
      </div>

      <Card className="w-full max-w-md border-border/40 bg-card/60 shadow-xl backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Complete Setup
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Welcome to the team! Please set a secure password to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={setupMutation.isPending}>
              {setupMutation.isPending ? "Setting up..." : "Activate Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeSetupClient;
