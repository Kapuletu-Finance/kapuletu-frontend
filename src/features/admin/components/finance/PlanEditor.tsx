"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
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
import { useUpdatePlanMutation } from "@/features/admin/services/mutations";
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
  const { data: plan, isLoading } = useAdminPlanQuery(planId);
  const updateMutation = useUpdatePlanMutation();
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

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!plan) return <div className="p-6 text-destructive">Plan not found</div>;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateMutation.mutate({ planId, data: values });
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
        <h1 className="text-2xl font-bold tracking-tight">Edit Plan: {plan.name}</h1>
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
                      <Input {...field} />
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
                    <FormLabel>Price (KES/month)</FormLabel>
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
                    <FormLabel>Max Monthly Transactions</FormLabel>
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
                Manage the list of features shown on the pricing page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="e.g. Priority Support"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <Button type="button" onClick={addFeature} variant="secondary">
                  <Plus className="size-4 mr-2" /> Add
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
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
                {form.watch("allowed_features").length === 0 && (
                  <div className="text-sm text-muted-foreground italic p-4 text-center border border-dashed rounded-md">
                    No features added yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/admin/finance">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
