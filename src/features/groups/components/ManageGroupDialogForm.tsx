"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { GroupInfo } from "@/features/groups/components/GroupCard";
import { useUpdateGroupMutation } from "@/features/groups/services/mutations";
import IconLibrary from "@/features/shared/components/IconLibrary";

const manageGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().max(300, "Description cannot exceed 300 characters").optional(),
});

type ManageGroupFormData = z.infer<typeof manageGroupSchema>;

interface ManageGroupDialogFormProps {
  group: GroupInfo;
  children?: React.ReactNode;
}

const ManageGroupDialogForm: React.FC<ManageGroupDialogFormProps> = ({ group, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const updateGroupMutation = useUpdateGroupMutation(group.id);

  const form = useForm<ManageGroupFormData>({
    defaultValues: {
      name: group.name,
      description: group.description || "",
    },
    resolver: zodResolver(manageGroupSchema),
  });

  const descriptionValue = form.watch("description") ?? "";

  const onSubmit = (data: ManageGroupFormData) => {
    updateGroupMutation.mutate(
      {
        name: data.name,
        description: data.description || null,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && React.isValidElement(children) ? (
        <DialogTrigger render={children} />
      ) : children ? (
        <DialogTrigger>{children}</DialogTrigger>
      ) : null}

      <DialogContent className="rounded-3xl sm:max-w-112.5 p-6">
        <DialogHeader className="items-center space-y-4">
          <div className="rounded-full bg-primary/10 p-3">
            <IconLibrary name="group" className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl font-medium">Manage My Group</DialogTitle>
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
              <FieldLabel className="text-sm font-semibold text-foreground">
                Group Status
              </FieldLabel>
              <Select disabled value={group.status === "Archived" ? "Archived" : "Active"}>
                <SelectTrigger className="w-full text-foreground opacity-100 bg-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="Archived">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                      Archived
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Button
              type="submit"
              className="w-full bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
              disabled={updateGroupMutation.isPending}
            >
              {updateGroupMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageGroupDialogForm;
