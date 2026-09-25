"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { GroupInfo } from "@/features/groups/components/GroupCard";
import {
  useArchiveGroupMutation,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
  useUploadGroupCoverPhotoMutation,
} from "@/features/groups/services/mutations";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import type { Currency } from "@/features/shared/types";

const editGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().max(300, "Description cannot exceed 300 characters").optional(),
  currency: z.string().optional(),
});

type EditGroupFormData = z.infer<typeof editGroupSchema>;

interface EditGroupDialogFormProps {
  group: GroupInfo & { currency?: Currency; total_raised?: number };
  children?: React.ReactNode;
}

const EditGroupDialogForm: React.FC<EditGroupDialogFormProps> = ({ group, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const updateGroupMutation = useUpdateGroupMutation(group.id);
  const archiveGroupMutation = useArchiveGroupMutation(group.id);
  const deleteGroupMutation = useDeleteGroupMutation(group.id);
  const uploadCoverMutation = useUploadGroupCoverPhotoMutation(group.id);

  const [deleteConfirmation, setDeleteConfirmation] = React.useState("");

  const form = useForm<EditGroupFormData>({
    defaultValues: {
      name: group.name,
      description: group.description || "",
      currency: group.currency || "KES",
    },
    resolver: zodResolver(editGroupSchema),
  });

  const descriptionValue = form.watch("description") ?? "";

  const onSubmit = async (data: EditGroupFormData) => {
    try {
      await updateGroupMutation.mutateAsync({
        name: data.name,
        description: data.description || null,
        currency: data.currency as Currency,
      });
      setIsOpen(false);
    } catch (_error) {
      // Error handled globally
    }
  };

  const handleArchive = async () => {
    try {
      await archiveGroupMutation.mutateAsync();
      setIsOpen(false);
    } catch (_error) {}
  };

  const handleDelete = async () => {
    if (deleteConfirmation !== group.name) {
      toast.error("Group name does not match.");
      return;
    }
    try {
      await deleteGroupMutation.mutateAsync();
      setIsOpen(false);
    } catch (_error) {}
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadCoverMutation.mutateAsync(file);
    } catch (_error) {}
  };

  const hasTransactions = (group.total_raised || 0) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && React.isValidElement(children) ? (
        <DialogTrigger render={children} />
      ) : children ? (
        <DialogTrigger>{children}</DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-[600px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="items-center space-y-4">
          <SiteLogo variant="icon" href={null} logoClassName="w-12 h-12 text-primary" />
          <DialogTitle className="text-xl font-medium">Group Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4">
          <TabsList variant="line" className="w-full justify-start border-b">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="danger" className="text-destructive">
              Danger Zone
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <Field data-invalid={!!form.formState.errors.name}>
                      <FieldLabel className="text-sm font-semibold" isRequired>
                        Group Name
                      </FieldLabel>
                      <Input
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
                      <FieldLabel className="text-sm font-semibold">Group Description</FieldLabel>
                      <Textarea
                        placeholder="e.g. support, savings, or fundraising purposes"
                        {...field}
                        className="min-h-20"
                        aria-invalid={!!form.formState.errors.description}
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
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

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel className="text-sm font-semibold">Currency</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={hasTransactions}
                      >
                        <SelectTrigger className={hasTransactions ? "bg-muted/50 opacity-70" : ""}>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KES">
                            <div className="flex items-center gap-2">KES - Kenyan Shilling</div>
                          </SelectItem>
                          <SelectItem value="USD">
                            <div className="flex items-center gap-2">USD - US Dollar</div>
                          </SelectItem>
                          <SelectItem value="EUR">
                            <div className="flex items-center gap-2">EUR - Euro</div>
                          </SelectItem>
                          <SelectItem value="GBP">
                            <div className="flex items-center gap-2">GBP - British Pound</div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {hasTransactions && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Currency cannot be changed because this group has processed transactions.
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-primary py-6 text-base font-semibold"
                  isLoading={updateGroupMutation.isPending}
                >
                  Save Changes
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="branding" className="mt-6 space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-1">Cover Photo</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Upload a high quality image to represent this group on public pages.
                </p>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/10 hover:bg-muted/30 transition-colors">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadCoverMutation.isPending}
                    className="max-w-[250px] cursor-pointer"
                  />
                  {uploadCoverMutation.isPending && (
                    <p className="text-xs text-muted-foreground mt-2">Uploading...</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="danger" className="mt-6 space-y-6">
            <div className="border border-border rounded-lg p-4 bg-muted/10 space-y-4">
              <div>
                <h4 className="text-sm font-semibold">Archive Group</h4>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Archiving hides the group from active views but preserves all financial history.
                  You can restore it later.
                </p>
                <Button
                  variant="outline"
                  onClick={handleArchive}
                  isLoading={archiveGroupMutation.isPending}
                  disabled={group.status === "Archived"}
                >
                  {group.status === "Archived" ? "Already Archived" : "Archive Group"}
                </Button>
              </div>
            </div>

            <div className="border border-destructive/20 rounded-lg p-4 bg-destructive/5 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-destructive">Delete Group</h4>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Permanently delete this group and all its data. This action is irreversible.
                </p>
                {hasTransactions ? (
                  <p className="text-sm font-medium text-destructive mb-3">
                    Cannot delete: This group has processed transactions. Please archive instead.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <Input
                      placeholder={`Type "${group.name}" to confirm`}
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      className="border-destructive/30 bg-background"
                    />
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleteConfirmation !== group.name || deleteGroupMutation.isPending}
                      isLoading={deleteGroupMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      Permanently Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupDialogForm;
