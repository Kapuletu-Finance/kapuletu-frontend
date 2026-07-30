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

const editCampaignSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required."),
  description: z.string().optional(),
  targetAmount: z.string().min(1, "Target amount is required."),
  paymentInstructions: z.string().optional(),
  fundraisingDeadline: z.string().optional(),
});

type EditCampaignFormData = z.infer<typeof editCampaignSchema>;

const EditCampaignFormDialog = () => {
  const form = useForm<EditCampaignFormData>({
    defaultValues: {
      campaignName: "VBS",
      description: "Bible school for children",
      targetAmount: "10,000",
      paymentInstructions: "Paybill 12345, Account 6789",
      fundraisingDeadline: "01/01/2025",
    },
    resolver: zodResolver(editCampaignSchema),
  });

  const onSubmit = (data: EditCampaignFormData) => {
    // TODO: wire up to API mutation
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <IconLibrary name="edit" className="w-4 h-4" /> Edit Campaign
          </Button>
        }
      />

      <DialogContent className="sm:max-w-120 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="items-center space-y-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary text-xl">🔒</div>
          <DialogTitle className="text-xl font-bold text-foreground">Campaign Settings</DialogTitle>
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
                    {...field}
                    aria-invalid={!!form.formState.errors.paymentInstructions}
                  />
                  {form.formState.errors.paymentInstructions && (
                    <FieldError>{form.formState.errors.paymentInstructions.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="space-y-2">
              <FieldLabel className="text-sm font-semibold text-foreground">
                Group Status
              </FieldLabel>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between font-normal"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>Active</span>
                </div>
                <IconLibrary name="chevron-down" className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

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
                    <Input id={field.name} readOnly className="pl-10" {...field} />
                    <IconLibrary
                      name="close"
                      className="absolute right-3 w-4 h-4 text-muted-foreground"
                    />
                  </div>
                </Field>
              )}
            />

            <Button type="submit" className="w-full mt-4">
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCampaignFormDialog;
