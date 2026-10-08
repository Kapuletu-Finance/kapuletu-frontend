"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useArchivePlanMutation } from "@/features/admin/services/financeApi";
import { useCreatePlanMutation, useUpdatePlanMutation } from "@/features/admin/services/mutations";
import { useAdminPlanQuery } from "@/features/admin/services/queries";
import { BackNavigation } from "@/features/shared/components/BackNavigation";

const formSchema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().min(0),
  // Empty = monthly price x the "annual months charged" billing rule
  annual_price: z.union([z.literal(""), z.coerce.number().min(0)]),
  max_groups: z.coerce.number().min(1),
  max_campaigns: z.coerce.number().min(1),
  max_transactions: z.coerce.number().min(1),
  allowed_features: z.array(z.string()),
});

export const PlanEditor = ({ planId }: { planId: string }) => {
  const isCreateMode = planId === "create";
  const { data: plan, isPending } = useAdminPlanQuery(isCreateMode ? "" : planId);
  const updateMutation = useUpdatePlanMutation();
  const createMutation = useCreatePlanMutation();
  const router = useRouter();
  const archiveMutation = useArchivePlanMutation();
  const [featureInput, setFeatureInput] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    // biome-ignore lint/suspicious/noExplicitAny: Zod typing workaround
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      price: 0,
      annual_price: "",
      max_groups: 1,
      max_campaigns: 1,
      max_transactions: 100,
      allowed_features: [],
    },
    values: {
      name: plan?.name || "",
      price: plan?.monthly_price ?? plan?.price ?? 0,
      annual_price: plan?.annual_price ?? "",
      max_groups: plan?.max_groups || 1,
      max_campaigns: plan?.max_campaigns || 1,
      max_transactions: plan?.max_transactions || 100,
      allowed_features: Array.isArray(plan?.allowed_features)
        ? plan.allowed_features
        : plan?.allowed_features
          ? Object.keys(plan.allowed_features).filter(
              (k) => (plan.allowed_features as unknown as Record<string, unknown>)[k],
            )
          : [],
    },
  });

  const watchedPrice = form.watch("price");
  const watchedAnnual = form.watch("annual_price");
  const priceChanged =
    !isCreateMode &&
    !!plan &&
    (Number(watchedPrice) !== plan.monthly_price ||
      (watchedAnnual !== "" && Number(watchedAnnual) !== plan.annual_price));

  if (isPending && !isCreateMode) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!plan && !isCreateMode) return <div className="p-6 text-destructive">Plan not found</div>;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Convert allowed_features array back to an object for the backend
    const featuresDict = values.allowed_features.reduce(
      (acc, feature) => {
        acc[feature] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    // Send the annual price only when it was typed in; otherwise the server derives it from the monthly one.
    const { annual_price, ...rest } = values;
    const annualTouched = !!form.formState.dirtyFields.annual_price && annual_price !== "";
    // biome-ignore lint/suspicious/noExplicitAny: Mutation typing bypass
    const submitData: any = {
      ...rest,
      allowed_features: featuresDict,
      ...(annualTouched ? { annual_price } : {}),
    };

    if (isCreateMode) {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          router.push("/admin/finance/plans");
        },
      });
    } else {
      updateMutation.mutate(
        { planId, data: submitData },
        {
          onSuccess: () => {
            router.push("/admin/finance/plans");
          },
        },
      );
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
      <div className="flex flex-col gap-1 mb-2">
        <BackNavigation href="/admin/finance/plans" label="Back to Plans" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {isCreateMode ? "Create Subscription Plan" : `Edit Plan: ${plan?.name}`}
          </h1>
        </div>
        {!isCreateMode && plan && (
          <Button
            type="button"
            variant="outline"
            disabled={archiveMutation.isPending || (!plan.archived_at && plan.code === "basic")}
            onClick={() => archiveMutation.mutate({ planId, archived: !plan.archived_at })}
          >
            {plan.archived_at ? "Restore plan" : "Archive plan"}
          </Button>
        )}
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
                name="annual_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual price (KES / yr)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Monthly x months charged" {...field} />
                    </FormControl>
                    <FormDescription>
                      Leave unchanged to follow the monthly price. A price change applies to new
                      checkouts only; issued invoices keep their price.
                    </FormDescription>
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
                {(Array.isArray(form.watch("allowed_features"))
                  ? form.watch("allowed_features")
                  : []
                ).map((feature: string, idx: number) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: feature list is stable
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

          {priceChanged && (
            <p
              role="status"
              className="rounded-md border border-amber-600/40 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
            >
              {plan?.active_subscribers
                ? `${plan.active_subscribers} active ${plan.active_subscribers === 1 ? "subscription is" : "subscriptions are"} on this plan. `
                : "No one is on this plan yet. "}
              Their current paid period keeps its price; renewals and new checkouts pay the new
              price.
            </p>
          )}

          <div className="flex justify-end gap-4">
            <Link href="/admin/finance/plans">
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
