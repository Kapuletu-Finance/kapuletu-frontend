"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreatePlanMutation, useUpdatePlanMutation } from "@/features/admin/services/mutations";
import { useAdminPlanQuery } from "@/features/admin/services/queries";

const formSchema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().min(0),
  max_groups: z.coerce.number().min(1),
  max_campaigns: z.coerce.number().min(1),
  max_transactions: z.coerce.number().min(1),
  allowed_features: z.array(z.string()),
});

export const PlanEditor = ({ planId }: { planId: string }) => {
  const isCreateMode = planId === "create";
  const { data: plan, isLoading } = useAdminPlanQuery(isCreateMode ? "" : planId);
  const updateMutation = useUpdatePlanMutation();
  const createMutation = useCreatePlanMutation();
  const router = useRouter();
  const [featureInput, setFeatureInput] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    // biome-ignore lint/suspicious/noExplicitAny: Zod typing workaround
    resolver: zodResolver(formSchema) as any,
    values: {
      name: plan?.name || "",
      price: plan?.price || 0,
      max_groups: plan?.max_groups || 1,
      max_campaigns: plan?.max_campaigns || 1,
      max_transactions: plan?.max_transactions || 100,
      allowed_features: plan?.allowed_features || [],
    },
  });

  if (isLoading && !isCreateMode) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!plan && !isCreateMode) return <div className="p-6 text-destructive">Plan not found</div>;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isCreateMode) {
      createMutation.mutate(values, {
        onSuccess: () => {
          router.push("/admin/finance");
        },
      });
    } else {
      updateMutation.mutate({ planId, data: values });
    }
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    const current = form.getValues("allowed_features");
    form.setValue("allowed_features", [...current, featureInput.trim()]);
    setFeatureInput("");
  };

  const removeFeature = (idx: number) => {
    const current = form.getValues("allowed_features");
    form.setValue(
      "allowed_features",
      current.filter((_, i) => i !== idx),
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/finance">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          {isCreateMode ? "Create Subscription Plan" : `Edit Plan: ${plan?.name}`}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Core Details</CardTitle>
              <CardDescription>Configure pricing and base limits for this tier.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Professional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (KES / mo)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_groups"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Groups</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_campaigns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Campaigns</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_transactions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Transactions / mo</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features & Benefits</CardTitle>
              <CardDescription>
                Add the specific features included in this plan. These will be displayed on the
                pricing page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <FormLabel>Add Feature</FormLabel>
                  <Input
                    placeholder="e.g. Priority Support"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                </div>
                <Button type="button" onClick={addFeature} variant="secondary">
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>

              <div className="space-y-2 mt-4">
                {form.watch("allowed_features").map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded-md bg-muted/50"
                  >
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(idx)}
                      className="text-destructive h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/admin/finance">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={updateMutation.isPending || createMutation.isPending}>
              {updateMutation.isPending || createMutation.isPending
                ? "Saving..."
                : isCreateMode
                  ? "Create Plan"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
