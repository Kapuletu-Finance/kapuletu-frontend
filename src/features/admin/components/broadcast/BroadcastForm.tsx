"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useSendBroadcastMutation } from "@/features/admin/services/mutations";

const formSchema = z.object({
  target_type: z.enum(["all_members", "specific_member", "custom_selection"]),
  title: z.string().min(5, "Title must be at least 5 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message too long"),
  channels: z.array(z.enum(["in_app", "email", "whatsapp"])).min(1, "Select at least one channel"),
});

export const BroadcastForm: React.FC = () => {
  const mutation = useSendBroadcastMutation();
  const [confirmData, setConfirmData] = useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    // biome-ignore lint/suspicious/noExplicitAny: Workaround for zodResolver type inferencing
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      target_type: "all_members",
      title: "",
      message: "",
      channels: ["in_app"],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setConfirmData(values);
  };

  const handleConfirm = () => {
    if (!confirmData) return;
    mutation.mutate(confirmData, {
      onSuccess: () => {
        form.reset();
        setConfirmData(null);
      },
      onError: () => {
        setConfirmData(null);
      },
    });
  };

  const channels = [
    { id: "in_app", label: "In-App Notification" },
    { id: "email", label: "Email" },
    { id: "whatsapp", label: "WhatsApp (SMS)" },
  ] as const;

  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Compose Broadcast</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="target_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all_members">All Active Members</SelectItem>
                    <SelectItem value="specific_member" disabled>
                      Specific Member (Coming Soon)
                    </SelectItem>
                    <SelectItem value="custom_selection" disabled>
                      Custom Segment (Coming Soon)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select who should receive this broadcast.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject / Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Important Platform Update" {...field} />
                </FormControl>
                <FormDescription>Used as email subject and in-app alert title.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message Body</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your message here..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Keep it direct and functional. Max 500 characters. ({field.value.length}/500)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="channels"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Channels</FormLabel>
                  <FormDescription>
                    Select which platforms to deliver this message through.
                  </FormDescription>
                </div>
                <div className="flex gap-6 flex-wrap">
                  {channels.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="channels"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== item.id),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutation.isPending}>
            Review & Send Broadcast
          </Button>
        </form>
      </Form>

      <AlertDialog open={confirmData !== null} onOpenChange={() => setConfirmData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Broadcast?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to send a message to{" "}
              <strong>{confirmData?.target_type.replace("_", " ")}</strong> via{" "}
              {confirmData?.channels.join(", ")}. This action cannot be undone and will immediately
              dispatch the communications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={mutation.isPending}>
              {mutation.isPending ? "Sending..." : "Confirm & Send"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
