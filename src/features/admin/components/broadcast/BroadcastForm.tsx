"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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

import { useSendBroadcastMutation } from "@/features/admin/services/mutations";

const formSchema = z.object({
  target_type: z.enum(["all_members", "active_subscribers", "treasurers", "marketing_opt_in"]),
  title: z.string().min(5, "Title must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
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
      channels: ["email"],
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: form.getValues("message"),
    onUpdate: ({ editor }) => {
      form.setValue("message", editor.getHTML(), { shouldValidate: true });
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert min-h-[150px] p-4 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent rounded-md border",
      },
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
        editor?.commands.setContent("");
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-card p-6 rounded-lg border shadow-sm h-fit">
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
                      <SelectItem value="active_subscribers">Active Subscribers Only</SelectItem>
                      <SelectItem value="treasurers">Treasurers Only</SelectItem>
                      <SelectItem value="marketing_opt_in">
                        Marketing Opt-In (Consented Users)
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
              render={() => (
                <FormItem>
                  <FormLabel>Message Body</FormLabel>
                  <FormControl>
                    <div className="border rounded-md">
                      <div className="border-b p-2 flex gap-2 bg-muted/50 rounded-t-md">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => editor?.chain().focus().toggleBold().run()}
                          className={editor?.isActive("bold") ? "bg-muted" : ""}
                        >
                          Bold
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => editor?.chain().focus().toggleItalic().run()}
                          className={editor?.isActive("italic") ? "bg-muted" : ""}
                        >
                          Italic
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                          className={editor?.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
                        >
                          H2
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => editor?.chain().focus().toggleBulletList().run()}
                          className={editor?.isActive("bulletList") ? "bg-muted" : ""}
                        >
                          List
                        </Button>
                      </div>
                      <EditorContent editor={editor} className="bg-background rounded-b-md" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Use {"{{first_name}}"} to personalize the message. Supports HTML formatting.
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
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm h-fit sticky top-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>Live Preview</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Email</span>
        </h2>
        <div className="border rounded-lg overflow-hidden bg-background mt-4 flex flex-col min-h-[400px]">
          <div className="bg-muted p-4 border-b">
            <div className="text-sm text-muted-foreground mb-1">
              To: {form.watch("target_type").replace("_", " ")}
            </div>
            <div className="text-sm font-semibold">
              Subject: {form.watch("title") || "No Subject"}
            </div>
          </div>
          <div
            className="p-6 prose dark:prose-invert max-w-none flex-1"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: intentionally rendering rich text preview
            dangerouslySetInnerHTML={{
              __html:
                form.watch("message") ||
                "<p class='text-muted-foreground'>Start typing to see preview...</p>",
            }}
          />
        </div>
      </div>

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
              {mutation.isPending ? "Queuing..." : "Confirm & Send"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
