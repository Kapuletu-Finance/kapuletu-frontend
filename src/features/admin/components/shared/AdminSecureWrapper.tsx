"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useVerifyAdminPinMutation } from "@/features/admin/services/mutations";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface AdminSecureWrapperProps {
  children: React.ReactNode;
}

export const AdminSecureWrapper: React.FC<AdminSecureWrapperProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const verifyPin = useVerifyAdminPinMutation();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;

    verifyPin.mutate(
      { pin },
      {
        onSuccess: () => {
          setIsAuthenticated(true);
        },
        onError: () => {
          setPin("");
        },
      },
    );
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Card className="w-full max-w-sm border-border">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <IconLibrary name="key" className="size-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Secure Area</CardTitle>
          <CardDescription>
            Enter your admin PIN to access this sensitive information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="text-center text-lg tracking-widest"
                maxLength={6}
                disabled={verifyPin.isPending}
              />
            </div>
            <Button type="submit" className="w-full" disabled={!pin || verifyPin.isPending}>
              {verifyPin.isPending ? "Verifying..." : "Unlock Access"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
