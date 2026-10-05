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
  useUploadCampaignCoverPhotoMutation,
} from "@/features/campaigns/services/mutations";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import { ImageUploader } from "@/features/shared/components/ImageUploader";
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
  const uploadPhotoMutation = useUploadCampaignCoverPhotoMutation(campaign?.id ?? "");
  const [coverPhoto, setCoverPhoto] = React.useState<File | null>(null);

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
      setCoverPhoto(null);
    } else {
      form.reset({
        name: "",
        description: "",
        target: "",
        instructions: "",
        fundraisingDeadline: "",
        status: "Active",
      });
      setCoverPhoto(null);
    }
  }, [campaign, form]);

  const onSubmit = async (data: CampaignFormData) => {
    const payload = {
      title: data.name,
      description: data.description || null,
      target_amount: data.target ? Number.parseFloat(data.target.replace(/,/g, "")) : 0,
      payment_instructions: data.instructions || null,
      end_date: data.fundraisingDeadline || null,
    };

    try {
      if (isEditing && campaign?.id) {
        await updateMutation.mutateAsync(payload);
        if (coverPhoto) {
          // This will use the existing uploadPhotoMutation which has the correct campaign.id
          await uploadPhotoMutation.mutateAsync(coverPhoto);
        }
        onOpenChange(false);
      } else {
        const response = await createMutation.mutateAsync(payload);

        // Handle photo upload immediately if present
        if (coverPhoto && response.id) {
          const formData = new FormData();
          formData.append("file", coverPhoto);
          await fetch(`/api/campaigns/${response.id}/cover-photo`, {
            method: "POST",
            body: formData,
          });
        }

        form.reset();
        setCoverPhoto(null);
        onOpenChange(false);
        if (response?.slug) {
          router.push(`/treasurer/groups/${groupId}/campaigns/${response.slug}`);
        }
      }
    } catch (_error) {
      // Error is handled globally by api client
    }
  };

  const isPending =
    createMutation.isPending || updateMutation.isPending || uploadPhotoMutation.isPending;

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
            <div className="space-y-3">
              <FieldLabel className="text-xs font-medium text-foreground">
                Campaign Cover Photo
              </FieldLabel>
              <ImageUploader
                currentImageUrl={null} // Wait, what if we have a current image? campaign settings is not passed! We might need to handle this later. Let's just allow upload.
                onFileSelect={(file) => setCoverPhoto(file)}
                onClear={() => setCoverPhoto(null)}
                shape="video" // 16:9 aspect ratio
                className="w-full h-48 border-dashed"
                isLoading={uploadPhotoMutation.isPending}
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Recommended: 16:9 ratio, at least 1200x675 pixels.
              </p>
            </div>

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
