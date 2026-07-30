"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Children, isValidElement, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { useAddManualContributionMutation } from "@/features/transactions/services/mutations";

const addContributionSchema = z.object({
  name: z.string().min(1, "Name is required."),
  phone: z.string().min(1, "Phone number is required."),
  amount: z.string().min(1, "Amount is required."),
  paymentType: z.string().optional(),
});

type AddContributionFormData = z.infer<typeof addContributionSchema>;

interface AddContributionDialogProps {
  campaignSlug?: string;
  children?: React.ReactNode;
}

const AddContributionFormDialog = ({ campaignSlug, children }: AddContributionDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const childrenArray = Children.toArray(children);
  const triggerElement = childrenArray.find((child) => isValidElement(child)) || null;

  const form = useForm<AddContributionFormData>({
    defaultValues: {
      name: "",
      phone: "",
      amount: "",
      paymentType: "Cash",
    },
    resolver: zodResolver(addContributionSchema),
  });
  const { mutateAsync: addContribution, isPending } = useAddManualContributionMutation();

  const onSubmit = useCallback(
    async (data: AddContributionFormData) => {
      await addContribution({
        sender_name: data.name,
        sender_phone: data.phone,
        amount: Number.parseFloat(data.amount.replace(/,/g, "")),
        payment_method: data.paymentType || "Cash",
        ...(campaignSlug ? { campaign_id: campaignSlug } : {}),
      });
      form.reset();
      setIsOpen(false);
    },
    [campaignSlug, form, addContribution],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerElement && <DialogTrigger render={triggerElement} />}

      <DialogContent className="sm:max-w-112.5">
        <DialogHeader className="items-center space-y-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary">🔒</div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Add A Contribution
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.name}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-semibold text-foreground"
                    isRequired
                  >
                    Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="e.g. John Doe"
                    {...field}
                    aria-invalid={!!form.formState.errors.name}
                  />
                  {form.formState.errors.name && (
                    <FieldError>{form.formState.errors.name.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.phone}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-semibold text-foreground"
                    isRequired
                  >
                    Phone Number
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="e.g +2547 1234 5678"
                    {...field}
                    aria-invalid={!!form.formState.errors.phone}
                  />
                  {form.formState.errors.phone && (
                    <FieldError>{form.formState.errors.phone.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.amount}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-semibold text-foreground"
                    isRequired
                  >
                    Amount
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="e.g. 10,000"
                    {...field}
                    aria-invalid={!!form.formState.errors.amount}
                  />
                  {form.formState.errors.amount && (
                    <FieldError>{form.formState.errors.amount.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="space-y-2">
              <FieldLabel className="text-sm font-semibold text-foreground">
                Payment Type
              </FieldLabel>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between font-normal"
              >
                Cash
                <IconLibrary name="chevron-down" className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isPending}>
              Create Contribution
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContributionFormDialog;
