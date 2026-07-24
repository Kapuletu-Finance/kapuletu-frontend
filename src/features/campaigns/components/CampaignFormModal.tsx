import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import IconLibrary from "@/features/shared/components/IconLibrary";
import type { CampaignInfo } from "./CampaignCard";

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().optional(),
  target: z.string().optional(),
  instructions: z.string().optional(),
  status: z.string().optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormModalProps {
  campaign?: CampaignInfo | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CampaignFormModal: React.FC<CampaignFormModalProps> = ({
  campaign,
  isOpen,
  onOpenChange,
}) => {
  const isEditing = !!campaign;

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: campaign?.name || "",
      description: campaign?.description || "",
      target: "", // No target field in CampaignInfo currently, defaulting to empty string
      instructions: "",
      status: campaign?.status || "Active",
    },
  });

  // Update default values when campaign changes
  React.useEffect(() => {
    if (campaign) {
      form.reset({
        name: campaign.name || "",
        description: campaign.description || "",
        target: "",
        instructions: "",
        status: campaign.status || "Active",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        target: "",
        instructions: "",
        status: "Active",
      });
    }
  }, [campaign, form]);

  const onSubmit = (data: CampaignFormData) => {
    console.log(isEditing ? "Updating campaign:" : "Creating campaign:", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100 p-6 gap-6 rounded-3xl">
        <DialogHeader className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
            <IconLibrary name="campaign" className="w-8 h-8 text-primary" />
          </div>
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
                  <FieldLabel htmlFor={field.name} className="text-xs font-medium text-foreground">
                    Campaign Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder={isEditing ? "" : "e.g. Food Drive"}
                    {...field}
                    className="bg-muted/30 border-muted rounded-xl"
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
                    className="resize-none h-24 bg-muted/30 border-muted rounded-xl"
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
                  <FieldLabel htmlFor={field.name} className="text-xs font-medium text-foreground">
                    Target Amount
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="e.g. 10,000"
                    {...field}
                    className="bg-muted/30 border-muted rounded-xl"
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
                    className="bg-muted/30 border-muted rounded-xl"
                    aria-invalid={!!form.formState.errors.instructions}
                  />
                  {form.formState.errors.instructions && (
                    <FieldError>{form.formState.errors.instructions.message}</FieldError>
                  )}
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
                      Group Status
                    </FieldLabel>
                    <div className="relative">
                      <select
                        id={field.name}
                        {...field}
                        className="flex h-10 w-full appearance-none items-center justify-between whitespace-nowrap rounded-xl border border-muted bg-muted/30 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        aria-invalid={!!form.formState.errors.status}
                      >
                        <option value="Active">Active</option>
                        <option value="Archived">Archived</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <IconLibrary
                          name="chevron-down"
                          className="h-4 w-4 text-muted-foreground"
                        />
                      </div>
                    </div>
                    {form.formState.errors.status && (
                      <FieldError>{form.formState.errors.status.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl text-sm font-medium mt-2"
            >
              {isEditing ? "Save Changes" : "Create Campaign"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
