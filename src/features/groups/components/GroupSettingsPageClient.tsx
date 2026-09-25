"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/env";
import {
  useArchiveGroupMutation,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
  useUploadGroupCoverPhotoMutation,
} from "@/features/groups/services/mutations";
import { useGroupHistoryQuery, useGroupsQuery } from "@/features/groups/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PageLayout from "@/features/shared/components/PageLayout";
import type { AuditLogOut, Currency, GroupOut } from "@/features/shared/types";

const editGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().max(300, "Description cannot exceed 300 characters").optional(),
  currency: z.string().optional(),
  primary_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color code")
    .optional()
    .or(z.literal("")),
  card_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color code")
    .optional()
    .or(z.literal("")),
  tagline: z.string().max(100, "Tagline cannot exceed 100 characters").optional(),
});

type EditGroupFormData = z.infer<typeof editGroupSchema>;

const GroupSettingsForm = ({ group }: { group: GroupOut }) => {
  const router = useRouter();
  const updateGroupMutation = useUpdateGroupMutation(group.id);
  const archiveGroupMutation = useArchiveGroupMutation(group.id);
  const deleteGroupMutation = useDeleteGroupMutation(group.id);
  const uploadCoverMutation = useUploadGroupCoverPhotoMutation(group.id);

  const [deleteConfirmation, setDeleteConfirmation] = React.useState("");

  const currentSettings = (group.settings_override || {}) as Record<string, unknown>;

  const form = useForm<EditGroupFormData>({
    defaultValues: {
      name: group.name,
      description: group.description || "",
      currency: group.currency || "KES",
      primary_color: (currentSettings.primary_color as string) || "",
      card_color: (currentSettings.card_color as string) || "",
      tagline: (currentSettings.tagline as string) || "",
    },
    resolver: zodResolver(editGroupSchema),
  });

  const descriptionValue = form.watch("description") ?? "";

  const onSubmit = async (data: EditGroupFormData) => {
    try {
      const newSettings = {
        ...currentSettings,
        primary_color: data.primary_color || undefined,
        card_color: data.card_color || undefined,
        tagline: data.tagline || undefined,
      };

      await updateGroupMutation.mutateAsync({
        name: data.name,
        description: data.description || null,
        currency: data.currency as Currency,
        settings_override: newSettings,
      });
    } catch (_error) {}
  };

  const handleArchive = async () => {
    try {
      await archiveGroupMutation.mutateAsync();
    } catch (_error) {}
  };

  const handleDelete = async () => {
    if (deleteConfirmation !== group.name) {
      toast.error("Group name does not match.");
      return;
    }
    try {
      await deleteGroupMutation.mutateAsync();
      router.push("/treasurer/groups");
    } catch (_error) {}
  };

  const hasTransactions = (group.total_funds_raised || 0) > 0;
  const coverPhotoUrl =
    group.settings_override && typeof group.settings_override === "object"
      ? ((group.settings_override as Record<string, unknown>).cover_photo as string)
      : null;
  const fullCoverPhotoUrl = coverPhotoUrl
    ? coverPhotoUrl.startsWith("http")
      ? coverPhotoUrl
      : `/api${coverPhotoUrl}`
    : null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fullCoverPhotoUrl) {
      if (
        !window.confirm(
          "Are you sure you want to replace the existing cover photo? The old photo will be permanently deleted.",
        )
      ) {
        e.target.value = "";
        return;
      }
    } else {
      if (!window.confirm("Are you sure you want to upload this cover photo?")) {
        e.target.value = "";
        return;
      }
    }

    try {
      await uploadCoverMutation.mutateAsync(file);
    } catch (_error) {}
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-card border-border shadow-sm">
      <Tabs defaultValue="general" className="w-full">
        <TabsList variant="line" className="w-full justify-start border-b">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="danger" className="text-destructive">
            Danger Zone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
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
                      className="min-h-24"
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
                      <SelectTrigger
                        className={
                          hasTransactions
                            ? "bg-muted/50 opacity-70 w-full sm:w-1/2"
                            : "w-full sm:w-1/2"
                        }
                      >
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
                className="w-full sm:w-auto bg-primary px-8 py-6 text-base font-semibold"
                isLoading={updateGroupMutation.isPending}
              >
                Save Changes
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="branding" className="mt-8 space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Cover Photo</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a high quality image to represent this group on public pages.
                  </p>
                  <div className="border-2 border-dashed border-border rounded-lg overflow-hidden flex flex-col items-center justify-center bg-muted/10 hover:bg-muted/30 transition-colors relative min-h-[300px] group/upload">
                    {fullCoverPhotoUrl ? (
                      <img
                        src={fullCoverPhotoUrl}
                        alt="Cover"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/upload:opacity-40 transition-opacity"
                      />
                    ) : null}
                    <div className="relative z-10 flex flex-col items-center p-8 bg-background/80 backdrop-blur-sm rounded-lg m-4 border shadow-sm">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadCoverMutation.isPending}
                        className="max-w-[250px] cursor-pointer"
                      />
                      {uploadCoverMutation.isPending && (
                        <p className="text-sm text-muted-foreground mt-3 font-medium">
                          Uploading...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                <FormField
                  control={form.control}
                  name="primary_color"
                  render={({ field }) => (
                    <Field data-invalid={!!form.formState.errors.primary_color}>
                      <FieldLabel className="text-sm font-semibold">Brand Color (Hex)</FieldLabel>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="color"
                          className="w-12 h-10 p-1 cursor-pointer shrink-0"
                          value={field.value || "#000000"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Input
                          placeholder="#CFA94B"
                          {...field}
                          aria-invalid={!!form.formState.errors.primary_color}
                        />
                      </div>
                      {form.formState.errors.primary_color && (
                        <FieldError>{form.formState.errors.primary_color.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="card_color"
                  render={({ field }) => (
                    <Field data-invalid={!!form.formState.errors.card_color}>
                      <FieldLabel className="text-sm font-semibold">
                        Card Background Color
                      </FieldLabel>
                      <div className="flex gap-2 items-center">
                        <Input
                          type="color"
                          className="w-12 h-10 p-1 cursor-pointer shrink-0"
                          value={field.value || "#ffffff"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Input
                          placeholder="#F8FAFC"
                          {...field}
                          aria-invalid={!!form.formState.errors.card_color}
                        />
                      </div>
                      {form.formState.errors.card_color && (
                        <FieldError>{form.formState.errors.card_color.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <Field data-invalid={!!form.formState.errors.tagline}>
                      <FieldLabel className="text-sm font-semibold">Group Tagline</FieldLabel>
                      <Input
                        placeholder="e.g. Empowering our community"
                        {...field}
                        aria-invalid={!!form.formState.errors.tagline}
                      />
                      {form.formState.errors.tagline && (
                        <FieldError>{form.formState.errors.tagline.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto bg-primary px-8 py-6 text-base font-semibold"
                isLoading={updateGroupMutation.isPending}
              >
                Save Branding Settings
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="history" className="mt-8 space-y-6">
          <GroupHistoryTab groupId={group.id} />
        </TabsContent>

        <TabsContent value="danger" className="mt-8 space-y-6 max-w-2xl">
          <div className="border border-border rounded-lg p-6 bg-muted/10 space-y-4">
            <div>
              <h4 className="text-base font-semibold">Archive Group</h4>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Archiving hides the group from active views but preserves all financial history. You
                can restore it later.
              </p>
              <Button
                variant="outline"
                onClick={handleArchive}
                isLoading={archiveGroupMutation.isPending}
                disabled={group.status === "archived"}
              >
                {group.status === "archived" ? "Already Archived" : "Archive Group"}
              </Button>
            </div>
          </div>

          <div className="border border-destructive/20 rounded-lg p-6 bg-destructive/5 space-y-4">
            <div>
              <h4 className="text-base font-semibold text-destructive">Delete Group</h4>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Permanently delete this group and all its data. This action is irreversible.
              </p>
              {hasTransactions ? (
                <p className="text-sm font-medium text-destructive mb-3">
                  Cannot delete: This group has processed transactions. Please archive instead.
                </p>
              ) : (
                <div className="space-y-4 max-w-sm">
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
    </Card>
  );
};

const GroupHistoryTab = ({ groupId }: { groupId: string }) => {
  const { data: historyLogs, isLoading } = useGroupHistoryQuery(groupId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!historyLogs || historyLogs.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-lg bg-muted/10">
        <IconLibrary name="clock" className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <h4 className="text-sm font-semibold">No history found</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Activity and settings changes will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {historyLogs.map((log: AuditLogOut) => (
        <div key={log.log_id} className="flex gap-4 p-4 border border-border rounded-lg bg-card">
          <div className="mt-1">
            <IconLibrary name="activity" className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{log.action}</p>
            {log.details && (
              <p className="text-xs text-muted-foreground mt-1">{JSON.stringify(log.details)}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {format(new Date(log.created_at), "MMM d, yyyy h:mm a")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const GroupSettingsPageClient = () => {
  const params = useParams();
  const groupSlug = typeof params.groupSlug === "string" ? params.groupSlug : "";

  const { data: groupsData, isLoading } = useGroupsQuery({ limit: 100 });
  const group = groupsData?.items?.find((g) => g.slug === groupSlug || g.id === groupSlug);

  return (
    <PageLayout
      actionButton={
        <Link href={`/treasurer/groups/${groupSlug}`}>
          <Button variant="outline" className="gap-2">
            <IconLibrary name="arrow-left" className="w-4 h-4" />
            Back to Group
          </Button>
        </Link>
      }
    >
      <div className="flex flex-col items-start w-full pb-12">
        <div className="w-full max-w-4xl mx-auto mb-8 pl-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Group Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your group's details, branding, and advanced settings.
          </p>
        </div>

        {isLoading ? (
          <Card className="w-full max-w-4xl mx-auto p-8 space-y-8 bg-card border-none">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </Card>
        ) : group ? (
          <GroupSettingsForm group={group} />
        ) : (
          <div className="w-full py-20 text-center text-muted-foreground text-lg">
            Group not found.
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default GroupSettingsPageClient;
