"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Children, isValidElement, useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { NumericInput } from "@/components/ui/numeric-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddManualContributionMutation } from "@/features/inbox/services/mutations";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const addContributionSchema = z.object({
  groupId: z.string().uuid("Invalid group ID").optional(),
  campaignId: z.string().uuid("Invalid campaign ID").optional(),
  name: z.string().min(1, "Name is required."),
  phone: z.string().optional(),
  amount: z.string().min(1, "Amount is required."),
  paymentType: z.string().optional(),
});

type AddContributionFormData = z.infer<typeof addContributionSchema>;

interface AddContributionDialogProps {
  campaignSlug?: string;
  children?: React.ReactNode;
}

import { useCampaignQuery } from "@/features/campaigns/services/queries";
import { CampaignSelect } from "./CampaignSelect";
import { GroupSelect } from "./GroupSelect";

const AddContributionFormDialog = ({ campaignSlug, children }: AddContributionDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const childrenArray = Children.toArray(children);
  const triggerElement = childrenArray.find((child) => isValidElement(child)) || null;

  const { data: campaignData } = useCampaignQuery(campaignSlug || "");

  const form = useForm<AddContributionFormData>({
    defaultValues: {
      groupId: undefined,
      campaignId: undefined,
      name: "",
      phone: "",
      amount: "",
      paymentType: "Cash",
    },
    resolver: zodResolver(addContributionSchema),
  });
  const { mutateAsync: addContribution, isPending } = useAddManualContributionMutation();

  const selectedGroupId = useWatch({ control: form.control, name: "groupId" });

  useEffect(() => {
    if (campaignSlug && campaignData) {
      form.setValue("groupId", campaignData.group_id);
      form.setValue("campaignId", campaignData.id);
    }
  }, [campaignSlug, campaignData, form]);

  const onSubmit = useCallback(
    async (data: AddContributionFormData) => {
      // When inside a campaign, always derive IDs directly from the
      // server-fetched campaignData — never rely on form state which
      // may still be mid-update via useEffect.
      const finalGroupId =
        campaignSlug && campaignData ? String(campaignData.group_id) : data.groupId;
      const finalCampaignId =
        campaignSlug && campaignData ? String(campaignData.id) : data.campaignId;

      if (!finalCampaignId) {
        form.setError("campaignId", { message: "Campaign is required" });
        return;
      }

      if (!finalGroupId) {
        form.setError("groupId", { message: "Group is required" });
        return;
      }

      await addContribution({
        sender_name: data.name,
        sender_phone: data.phone || undefined,
        amount: Number.parseFloat(data.amount.replace(/,/g, "")),
        payment_method: data.paymentType || "Cash",
        campaign_id: finalCampaignId,
        group_id: finalGroupId,
      });
      form.reset();
      setIsOpen(false);

      if (!campaignSlug && finalGroupId && finalCampaignId) {
        router.push(`/treasurer/groups/${finalGroupId}/campaigns/${finalCampaignId}`);
      }
    },
    [campaignSlug, campaignData, form, addContribution, router],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerElement && <DialogTrigger render={triggerElement} />}

      <DialogContent className="sm:max-w-112.5">
        <DialogHeader className="items-center space-y-4">
          <SiteLogo variant="icon" href={null} logoClassName="w-12 h-12 text-primary" />
          <DialogTitle className="text-xl font-bold text-foreground">
            Add A Contribution
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {!campaignSlug && (
              <>
                <FormField
                  control={form.control}
                  name="groupId"
                  render={({ field }) => (
                    <Field data-invalid={!!form.formState.errors.groupId}>
                      <FieldLabel className="text-sm font-semibold text-foreground" isRequired>
                        Group
                      </FieldLabel>
                      <GroupSelect
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          form.setValue("campaignId", undefined); // reset campaign when group changes
                        }}
                        error={form.formState.errors.groupId?.message}
                      />
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="campaignId"
                  render={({ field }) => (
                    <Field data-invalid={!!form.formState.errors.campaignId}>
                      <FieldLabel className="text-sm font-semibold text-foreground" isRequired>
                        Campaign
                      </FieldLabel>
                      <CampaignSelect
                        groupId={selectedGroupId}
                        value={field.value}
                        onChange={field.onChange}
                        error={form.formState.errors.campaignId?.message}
                      />
                    </Field>
                  )}
                />
              </>
            )}

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
                  <NumericInput
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

            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.paymentType}>
                  <FieldLabel className="text-sm font-semibold text-foreground">
                    Payment Type
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full font-normal">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank">Bank</SelectItem>
                      <SelectItem value="Pledge">Pledge</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.paymentType && (
                    <FieldError>{form.formState.errors.paymentType.message}</FieldError>
                  )}
                </Field>
              )}
            />

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
