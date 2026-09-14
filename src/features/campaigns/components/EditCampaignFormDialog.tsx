"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
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
import { NumericInput } from "@/components/ui/numeric-input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCampaignMutation } from "@/features/campaigns/services/mutations";
import { useCampaignQuery } from "@/features/campaigns/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const editCampaignSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required."),
  description: z.string().optional(),
  targetAmount: z.string().min(1, "Target amount is required."),
  paymentInstructions: z.string().optional(),
  fundraisingDeadline: z.string().optional(),
});

type EditCampaignFormData = z.infer<typeof editCampaignSchema>;

interface EditCampaignFormDialogProps {
  children?: React.ReactElement;
}

const EditCampaignFormDialog = ({ children }: EditCampaignFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const campaignSlug = typeof params.campaignSlug === "string" ? params.campaignSlug : "";
  const { data: campaign } = useCampaignQuery(campaignSlug);
  const updateCampaign = useUpdateCampaignMutation(campaignSlug);

  const form = useForm<EditCampaignFormData>({
    defaultValues: {
      campaignName: campaign?.title ?? "",
      description: campaign?.description ?? "",
      targetAmount: String(campaign?.target_amount ?? ""),
      paymentInstructions: campaign?.payment_instructions ?? "",
      fundraisingDeadline: campaign?.end_date
        ? new Date(campaign.end_date).toISOString().split("T")[0]
        : "",
    },
    resolver: zodResolver(editCampaignSchema),
  });

  useEffect(() => {
    if (campaign) {
      form.reset({
        campaignName: campaign.title ?? "",
        description: campaign.description ?? "",
        targetAmount: String(campaign.target_amount ?? ""),
        paymentInstructions: campaign.payment_instructions ?? "",
        fundraisingDeadline: campaign.end_date
          ? new Date(campaign.end_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [campaign, form]);

  const onSubmit = async (data: EditCampaignFormData) => {
    try {
      await updateCampaign.mutateAsync({
        title: data.campaignName,
        description: data.description || null,
        target_amount: Number.parseFloat(data.targetAmount.replace(/,/g, "")) || 0,
        payment_instructions: data.paymentInstructions || null,
        end_date: data.fundraisingDeadline
          ? new Date(data.fundraisingDeadline).toISOString()
          : null,
      });
      setOpen(false);
    } catch (_error) {
      // Error is handled by global query client
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          children ?? (
            <Button className="gap-2">
              <IconLibrary name="edit" className="w-4 h-4" /> Edit Campaign
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-120 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="items-center space-y-4">
          <SiteLogo variant="icon" href={null} logoClassName="w-12 h-12 text-primary" />
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
                  <NumericInput
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
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                    disabled={{ before: new Date() }}
                  />
                </Field>
              )}
            />

            <Button type="submit" className="w-full mt-4" disabled={updateCampaign.isPending}>
              {updateCampaign.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCampaignFormDialog;
