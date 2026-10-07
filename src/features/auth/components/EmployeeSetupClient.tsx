"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { useEmployeeSetupMutation } from "@/features/auth/services/mutations";

const EmployeeSetupClient: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setupMutation = useEmployeeSetupMutation();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing setup token.");
      router.push("/sign-in");
    }
  }, [token, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setupMutation.mutate(
      { token, password },
      {
        onSuccess: () => {
          toast.success("Account setup complete! You can now log in.");
          router.push("/sign-in");
        },
        onError: (err: any) => {
          setError(err.response?.data?.detail || "Failed to setup account");
        },
      },
    );
  };

  if (!token) return null;

  return (
    <div className="w-full pb-4">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Complete Setup</h1>
        <p className="text-sm text-muted-foreground px-4">
          Welcome to the team! Set a secure password to activate your account.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-destructive/15 border border-destructive/20 p-4 text-sm text-destructive flex items-start gap-3">
          <svg
            aria-label="Error"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-alert-circle mt-0.5 shrink-0"
          >
            <title>Error</title>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset disabled={setupMutation.isPending} className="space-y-5">
          <Field>
            <FieldLabel htmlFor="password" className="text-xs font-bold text-foreground" isRequired>
              New Password
            </FieldLabel>
            <PasswordInput
              id="password"
              placeholder="**********"
              className="bg-muted/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="confirmPassword"
              className="text-xs font-bold text-foreground"
              isRequired
            >
              Confirm Password
            </FieldLabel>
            <PasswordInput
              id="confirmPassword"
              placeholder="**********"
              className="bg-muted/50"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Field>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full font-medium py-6"
              isLoading={setupMutation.isPending}
            >
              Activate Account
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default EmployeeSetupClient;
