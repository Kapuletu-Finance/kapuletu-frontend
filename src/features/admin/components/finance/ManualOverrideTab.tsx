import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useManualOverrideMutation } from "@/features/admin/services/mutations";
import { useAdminFinancePlansQuery } from "@/features/admin/services/queries";

const formSchema = z.object({
  user_id: z.string().uuid("Please enter a valid user ID (UUID)."),
  plan_id: z.string().min(1, "Please select a plan."),
  duration: z.coerce.number().min(1, "Duration must be at least 1 day.").max(3650, "Max 10 years."),
});

export const ManualOverrideTab: React.FC = () => {
  const { data: plans } = useAdminFinancePlansQuery();
  const mutation = useManualOverrideMutation();
  const [confirmData, setConfirmData] = useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    // biome-ignore lint/suspicious/noExplicitAny: Zod typing workaround
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      user_id: "",
      plan_id: "",
      duration: 30,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setConfirmData(values);
  };

  const handleConfirm = () => {
    if (!confirmData) return;
    mutation.mutate(confirmData, {
      onSuccess: () => {
        form.reset();
        setConfirmData(null);
      },
      onError: () => {
        setConfirmData(null);
      },
    });
  };

  const selectedPlan = plans?.find((p) => p.plan_id === form.watch("plan_id"));

  return (
    <>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Manual Subscription Override</CardTitle>
          <CardDescription>
            Force upgrade a user to a specific plan. This will grant them immediate access without
            charging their account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user UUID..." {...field} />
                    </FormControl>
                    <FormDescription>You can find the User ID in the Users tab.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plan_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Plan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subscription plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {plans?.map((plan) => (
                          <SelectItem key={plan.plan_id} value={plan.plan_id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormDescription>Number of days the override should last.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Apply Override</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={!!confirmData} onOpenChange={(open) => !open && setConfirmData(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Manual Override</DialogTitle>
            <DialogDescription>
              Are you sure you want to apply this subscription override?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <p>
              <strong>User ID:</strong> {confirmData?.user_id}
            </p>
            <p>
              <strong>Plan:</strong> {selectedPlan?.name || confirmData?.plan_id}
            </p>
            <p>
              <strong>Duration:</strong> {confirmData?.duration} days
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmData(null)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleConfirm} disabled={mutation.isPending}>
              {mutation.isPending ? "Applying..." : "Confirm Override"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
