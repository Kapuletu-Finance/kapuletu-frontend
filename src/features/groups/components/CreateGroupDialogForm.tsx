"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
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
import { useCreateGroupMutation } from "@/features/groups/services/mutations";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import { usePlanLimits } from "@/features/shared/hooks/usePlanLimits";
import { useUpgradeModal } from "@/features/shared/providers/UpgradeModalProvider";

const createGroupSchema = z.object({
  currency: z.string(),
  description: z.string().max(300, "Description cannot exceed 300 characters").optional(),
  name: z.string().min(1, "Group name is required"),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

interface CreateGroupDialogFormProps {
  children?: React.ReactNode;
}

const CreateGroupDialogForm: React.FC<CreateGroupDialogFormProps> = ({ children }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const createGroupMutation = useCreateGroupMutation();

  const { canCreateGroup, isPending } = usePlanLimits();
  const { openModal } = useUpgradeModal();

  const form = useForm<CreateGroupFormData>({
    defaultValues: {
      currency: "KES",
      description: "",
      name: "",
    },
    resolver: zodResolver(createGroupSchema),
  });

  const descriptionValue = form.watch("description") ?? "";

  const onSubmit = async (data: CreateGroupFormData) => {
    try {
      const response = await createGroupMutation.mutateAsync({
        name: data.name,
        description: data.description || null,
        currency: data.currency as "KES",
      });
      form.reset();
      setIsOpen(false);
      if (response?.slug) {
        router.push(`/treasurer/groups/${response.slug}`);
      }
    } catch (_error) {
      // Error handled globally
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (!isPending && !canCreateGroup) {
      e.preventDefault();
      openModal("You've reached the maximum number of groups allowed on your current plan.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && React.isValidElement(children) ? (
        <DialogTrigger render={children} onClick={handleTriggerClick} />
      ) : children ? (
        <DialogTrigger onClick={handleTriggerClick}>{children}</DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-112.5">
        <DialogHeader className="items-center space-y-4">
          <SiteLogo variant="icon" href={null} logoClassName="w-12 h-12 text-primary" />
          <DialogTitle className="text-xl">Create A New Group</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
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
                    Group Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="My group name"
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
              name="description"
              render={({ field }) => (
                <Field data-invalid={!!form.formState.errors.description}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-semibold text-foreground"
                  >
                    Group Description
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    placeholder="e.g. support, savings, or fundraising purposes"
                    {...field}
                    className="min-h-20"
                    aria-invalid={!!form.formState.errors.description}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {form.formState.errors.description ? (
                      <FieldError>{form.formState.errors.description.message}</FieldError>
                    ) : (
                      <span />
                    )}
                    <span>{descriptionValue.length}/300 characters</span>
                  </div>
                </Field>
              )}
            />

            <Field>
              <FieldLabel className="text-sm font-semibold text-foreground" isRequired>
                Currency
              </FieldLabel>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start font-normal text-foreground"
              >
                🇰🇪 KES (Kenyan Shillings)
              </Button>
            </Field>

            <Button
              type="submit"
              className="w-full bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
              isLoading={createGroupMutation.isPending}
            >
              Create Group
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialogForm;
