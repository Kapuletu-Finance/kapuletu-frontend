"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreatePlanMutation } from "@/features/admin/services/mutations";

const formSchema = z.object({
  name: z.string().min(2, "Plan name must be at least 2 characters."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  max_groups: z.coerce.number().min(1).default(1),
  max_campaigns: z.coerce.number().min(1).default(5),
  max_transactions: z.coerce.number().min(1).default(100),
});

interface CreatePlanSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePlanSheet: React.FC<CreatePlanSheetProps> = ({ open, onOpenChange }) => {
  const mutation = useCreatePlanMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    // biome-ignore lint/suspicious/noExplicitAny: Zod typing workaround
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      price: 0,
      max_groups: 1,
      max_campaigns: 5,
      max_transactions: 100,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-[90vw]">
        <SheetHeader>
          <SheetTitle>Create Subscription Plan</SheetTitle>
          <SheetDescription>Define a new pricing tier and its resource limits.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
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
                  <FormLabel>Price (KES/month)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="1" {...field} />
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
                    <Input type="number" min="1" {...field} />
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
                    <Input type="number" min="1" {...field} />
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
                  <FormLabel>Max Transactions (per month)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create Plan"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
