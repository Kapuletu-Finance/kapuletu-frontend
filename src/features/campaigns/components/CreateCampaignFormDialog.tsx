"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import IconLibrary from "@/features/shared/components/IconLibrary";

const createCampaignSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required."),
  description: z.string().optional(),
  targetAmount: z.string().min(1, "Target amount is required."),
  paymentInstructions: z.string().optional(),
  fundraisingDeadline: z.string().optional(),
});

type CreateCampaignFormData = z.infer<typeof createCampaignSchema>;

const CreateCampaignFormDialog = () => {
  const form = useForm<CreateCampaignFormData>({
    defaultValues: {
      campaignName: "",
      description: "",
      targetAmount: "",
      paymentInstructions: "",
      fundraisingDeadline: "",
    },
    resolver: zodResolver(createCampaignSchema),
  });

  const onSubmit = (data: CreateCampaignFormData) => {
    // TODO: wire up to API mutation
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <IconLibrary name="add" className="w-5 h-5" /> Create New Campaign
          </Button>
        }
      />

      <DialogContent className="sm:max-w-120 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="items-center space-y-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary text-xl">🔒</div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Create A New Campaign
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="campaignName"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.campaignName}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-semibold text-foreground"
                    isRequired
                  >
                    Campaign Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="e.g. Food Drive"
                    {...field}
                    aria-invalid={!!form.formState.errors.campaignName}
                  />
                  {form.formState.errors.campaignName && (
                    <FieldError>{form.formState.errors.campaignName.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.description}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-semibold text-foreground"
                  >
                    Description
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    placeholder="e.g. support, savings, or fundraising purposes"
                    className="min-h-25"
                    {...field}
                    aria-invalid={!!form.formState.errors.description}
                  />
                  {form.formState.errors.description && (
                    <FieldError>{form.formState.errors.description.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.targetAmount}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-semibold text-foreground"
                    isRequired
                  >
                    Target Amount
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="e.g. 10,000"
                    {...field}
                    aria-invalid={!!form.formState.errors.targetAmount}
                  />
                  {form.formState.errors.targetAmount && (
                    <FieldError>{form.formState.errors.targetAmount.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="paymentInstructions"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.paymentInstructions}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-semibold text-foreground"
                  >
                    Payment Instructions
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="e.g. Paybill 12345, Account 6789"
                    {...field}
                    aria-invalid={!!form.formState.errors.paymentInstructions}
                  />
                  {form.formState.errors.paymentInstructions && (
                    <FieldError>{form.formState.errors.paymentInstructions.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="fundraisingDeadline"
              render={({ field }) => (
                <Field>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-semibold text-foreground"
                  >
                    Fundraising Deadline
                  </FieldLabel>
                  <div className="relative flex items-center">
                    <IconLibrary
                      name="calendar"
                      className="absolute left-3 w-4 h-4 text-muted-foreground"
                    />
                    <Input
                      id={field.name}
                      readOnly
                      placeholder="Choose Date"
                      className="pl-10"
                      {...field}
                    />
                    <IconLibrary
                      name="close"
                      className="absolute right-3 w-4 h-4 text-muted-foreground"
                    />
                  </div>
                </Field>
              )}
            />

            <Button type="submit" className="w-full mt-4">
              Create Campaign
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignFormDialog;
