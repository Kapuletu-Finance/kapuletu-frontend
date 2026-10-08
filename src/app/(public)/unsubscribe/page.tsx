"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { errorMessage } from "@/features/admin/services/financeApi";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import { apiClient } from "@/lib/api-client";

const Unsubscribe = () => {
  const token = useSearchParams().get("token") ?? "";
  const check = useQuery({
    queryKey: ["unsubscribe", token],
    queryFn: async () =>
      (
        await apiClient.get<{ email: string; subscribed: boolean }>(
          `/communications/unsubscribe?token=${encodeURIComponent(token)}`,
        )
      ).data,
    enabled: !!token,
    retry: false,
  });
  const unsubscribe = useMutation({
    mutationFn: async () =>
      (await apiClient.post(`/communications/unsubscribe?token=${encodeURIComponent(token)}`)).data,
  });

  const done = unsubscribe.isSuccess || (check.data && !check.data.subscribed);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-muted/50">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <SiteLogo width={40} height={40} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold tracking-tight">
            {done ? "You're unsubscribed" : "Unsubscribe from marketing"}
          </h1>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          {!token || check.isError ? (
            <p role="alert">
              {token
                ? errorMessage(check.error, "This unsubscribe link is invalid.")
                : "This unsubscribe link is incomplete. Use the link from the email."}
            </p>
          ) : check.isLoading ? (
            <p>Checking your link…</p>
          ) : done ? (
            <p>
              We won't send marketing emails or WhatsApp messages to{" "}
              <strong className="text-foreground">{check.data?.email}</strong>. You'll still get
              messages about your account, such as receipts and security codes.
            </p>
          ) : (
            <>
              <p>
                Stop marketing emails and WhatsApp messages to{" "}
                <strong className="text-foreground">{check.data?.email}</strong>? Account messages
                like receipts and security codes will still arrive.
              </p>
              {unsubscribe.isError && (
                <p role="alert" className="text-destructive">
                  {errorMessage(unsubscribe.error, "Something went wrong. Please try again.")}
                </p>
              )}
              <Button
                className="w-full"
                disabled={unsubscribe.isPending}
                onClick={() => unsubscribe.mutate()}
              >
                {unsubscribe.isPending ? "Unsubscribing…" : "Unsubscribe"}
              </Button>
            </>
          )}
          <p className="flex justify-center gap-4">
            <Link
              href="/treasurer/settings?tab=communications"
              className="text-primary hover:underline"
            >
              Manage all preferences
            </Link>
            <Link href="/" className="text-primary hover:underline">
              Go to KapuLetu
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function UnsubscribePage() {
  return (
    <Suspense>
      <Unsubscribe />
    </Suspense>
  );
}
