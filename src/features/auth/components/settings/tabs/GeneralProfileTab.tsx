import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, User as UserIcon } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { ChangePasswordDialog } from "@/features/auth/components/ChangePasswordDialog";
import { type UpdateProfileFormData, updateProfileSchema } from "@/features/auth/schemas";
import { useUpdateProfileMutation } from "@/features/auth/services/mutations";
import { useGetMeQuery } from "@/features/auth/services/queries";

export const GeneralProfileTab: React.FC = () => {
  const { data: user, isLoading: isUserLoading } = useGetMeQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const [language, setLanguage] = React.useState("english");

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    values: user
      ? {
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          phoneNumber: user.phone_number || "",
        }
      : undefined,
  });

  const onSubmit = (data: UpdateProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={updateProfileMutation.isPending} className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UserIcon className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-lg text-foreground tracking-tight">
                Personal Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error} className="space-y-2">
                    <FieldLabel htmlFor={field.name} className="font-semibold text-sm">
                      First Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="text"
                      className="bg-background border-border"
                      {...field}
                      aria-invalid={!!fieldState.error}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error} className="space-y-2">
                    <FieldLabel htmlFor={field.name} className="font-semibold text-sm">
                      Last Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="text"
                      className="bg-background border-border"
                      {...field}
                      aria-invalid={!!fieldState.error}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Field className="space-y-2">
                <FieldLabel htmlFor="email" className="font-semibold text-sm">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  className="bg-muted border-border cursor-not-allowed"
                  value={user?.email || ""}
                  readOnly
                />
              </Field>

              <Field className="space-y-2">
                <FieldLabel htmlFor="password" className="font-semibold text-sm">
                  Password
                </FieldLabel>
                <ChangePasswordDialog>
                  <div className="relative cursor-pointer group">
                    <Input
                      id="password"
                      type="password"
                      className="bg-background border-border cursor-pointer group-hover:border-primary/50 transition-colors pointer-events-none"
                      value="************"
                      readOnly
                    />
                    <div className="absolute inset-0 z-10" />
                  </div>
                </ChangePasswordDialog>
              </Field>

              <Field className="space-y-2">
                <FieldLabel htmlFor="language" className="font-semibold text-sm">
                  Preferred Language
                </FieldLabel>
                <Select
                  value={language}
                  onValueChange={(value) => {
                    if (value !== null) setLanguage(value);
                  }}
                >
                  <SelectTrigger id="language" className="bg-background border-border">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="swahili">Swahili</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-foreground">Profile Photo</h4>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex flex-col items-center justify-center overflow-hidden shrink-0 border border-border relative">
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-primary flex justify-center">
                    <div className="w-10 h-12 rounded-t-full bg-primary-foreground/20 -mt-2" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-amber-700/80 mt-1 z-10" />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 px-4 gap-2 text-xs font-semibold rounded-full border-primary/40 text-primary hover:bg-primary/5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Photo
                  </Button>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    JPG, PNG, OR JPEG, MAX SIZE 5MB
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-start">
              <Button
                type="submit"
                className="w-40 font-semibold"
                isLoading={updateProfileMutation.isPending}
              >
                Save Changes
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};
