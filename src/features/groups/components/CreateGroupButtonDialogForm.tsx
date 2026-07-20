"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type * as React from "react";
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

const createGroupSchema = z.object({
  currency: z.string(),
  description: z.string().max(300, "Description cannot exceed 300 characters").optional(),
  name: z.string().min(1, "Group name is required"),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

const CreateGroupDialogForm: React.FC = () => {
  const form = useForm<CreateGroupFormData>({
    defaultValues: {
      currency: "KES",
      description: "",
      name: "",
    },
    resolver: zodResolver(createGroupSchema),
  });

  const descriptionValue = form.watch("description") ?? "";

  const onSubmit = (data: CreateGroupFormData) => {
    console.log("Creating group:", data);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:text-base" />
        }
      >
        <IconLibrary name="add" className="mr-1.5 h-5 w-5" /> Create New Group
      </DialogTrigger>

      <DialogContent className="rounded-3xl sm:max-w-112.5">
        <DialogHeader className="items-center space-y-4">
          <div className="rounded-full bg-primary/10 p-3">
            <div className="text-2xl text-primary">🔒</div>
          </div>
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
                  >
                    Group Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="My group name"
                    {...field}
                    className="rounded-xl"
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
                    className="min-h-20 rounded-xl"
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
              <FieldLabel className="text-sm font-semibold text-foreground">Currency</FieldLabel>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start rounded-xl font-normal text-foreground"
              >
                🇰🇪 KES (Kenyan Shillings)
              </Button>
            </Field>

            <Button
              type="submit"
              className="w-full rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
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
