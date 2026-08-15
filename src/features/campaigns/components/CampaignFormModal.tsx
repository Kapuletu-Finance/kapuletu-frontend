import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
} from "@/features/campaigns/services/mutations";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import type { CampaignInfo } from "./CampaignCard";

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().optional(),
  target: z.string().min(1, "Target amount is required"),
  instructions: z.string().optional(),
  fundraisingDeadline: z.string().optional(),
  status: z.string().optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormModalProps {
  groupId: string;
  campaign?: CampaignInfo | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CampaignFormModal: React.FC<CampaignFormModalProps> = ({
  groupId,
  campaign,
  isOpen,
  onOpenChange,
}) => {
  const isEditing = !!campaign;
  const router = useRouter();

  const createMutation = useCreateCampaignMutation(groupId);
  const updateMutation = useUpdateCampaignMutation(campaign?.id ?? "");

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: campaign?.name || "",
      description: campaign?.description || "",
      target: "",
      instructions: "",
      fundraisingDeadline: "",
      status: campaign?.status || "Active",
    },
  });

  React.useEffect(() => {
    if (campaign) {
      form.reset({
        name: campaign.name || "",
        description: campaign.description || "",
        target: campaign.target_amount ? String(campaign.target_amount) : "",
        instructions: "",
        fundraisingDeadline: campaign.end_date || "",
        status: campaign.status || "Active",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        target: "",
        instructions: "",
        fundraisingDeadline: "",
        status: "Active",
      });
    }
  }, [campaign, form]);

  const onSubmit = (data: CampaignFormData) => {
    const payload = {
      title: data.name,
      description: data.description || null,
      target_amount: data.target ? Number.parseFloat(data.target.replace(/,/g, "")) : 0,
      payment_instructions: data.instructions || null,
      end_date: data.fundraisingDeadline || null,
    };

    if (isEditing && campaign?.id) {
      updateMutation.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: (data) => {
          form.reset();
          onOpenChange(false);
          if (data?.slug) {
            router.push(`/treasurer/groups/${groupId}/campaigns/${data.slug}`);
          }
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100 p-6 gap-6">
        <DialogHeader className="flex flex-col items-center gap-3">
          <SiteLogo variant="icon" href={null} logoClassName="w-12 h-12 text-primary" />
          <DialogTitle className="text-center text-xl font-semibold">
            {isEditing ? "Campaign Settings" : "Create A New Campaign"}
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
                    className="text-xs font-medium text-foreground"
                    isRequired
                  >
                    Campaign Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder={isEditing ? "" : "e.g. Food Drive"}
                    {...field}
                    className="bg-muted/30 border-muted"
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
              name="description"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.description}>
                  <FieldLabel htmlFor={field.name} className="text-xs font-medium text-foreground">
                    Description
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    placeholder={isEditing ? "" : "e.g. support, savings, or fundraising purposes"}
                    {...field}
                    className="resize-none h-24 bg-muted/30 border-muted"
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
              name="target"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.target}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs font-medium text-foreground"
                    isRequired
                  >
                    Target Amount
                  </FieldLabel>
                  <NumericInput
                    id={field.name}
                    placeholder="e.g. 10,000"
                    {...field}
                    className="bg-muted/30 border-muted"
                    aria-invalid={!!form.formState.errors.target}
                  />
                  {form.formState.errors.target && (
                    <FieldError>{form.formState.errors.target.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.instructions}>
                  <FieldLabel htmlFor={field.name} className="text-xs font-medium text-foreground">
                    Payment Instructions
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="e.g. Paybill 12345, Account 6789"
                    {...field}
                    className="bg-muted/30 border-muted"
                    aria-invalid={!!form.formState.errors.instructions}
                  />
                  {form.formState.errors.instructions && (
                    <FieldError>{form.formState.errors.instructions.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="fundraisingDeadline"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name} className="text-xs font-medium text-foreground">
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

            {isEditing && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Field data-invalid={!!form.formState.errors.status}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs font-medium text-foreground"
                    >
                      Campaign Status
                    </FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger
                        id={field.name}
                        className="bg-muted/30 h-10 w-full px-3 py-2 text-sm"
                        aria-invalid={!!form.formState.errors.status}
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.status && (
                      <FieldError>{form.formState.errors.status.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-sm font-medium mt-2"
              isLoading={isPending}
            >
              {isEditing ? "Save Changes" : "Create Campaign"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
