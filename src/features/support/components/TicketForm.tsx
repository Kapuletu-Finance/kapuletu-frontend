"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Lock } from "lucide-react";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { useCreateTicketMutation } from "../services/mutations";

const formSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  priority: z.string().min(1, "Please select a priority"),
  message: z.string().min(10, "Please provide more details"),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onSuccess: () => void;
}

export const TicketForm: React.FC<Props> = ({ onSuccess }) => {
  const { mutateAsync: createTicket, isPending } = useCreateTicketMutation();
  // Assume basic plan for demo logic; in reality this comes from user context
  const isBasicPlan = true;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      category: "",
      priority: "standard",
      message: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createTicket(values);
      toast.success("Ticket created successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to create ticket");
    }
  };

  const selectedPriority = form.watch("priority");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Briefly describe your issue..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing Inquiry</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="general">General Question</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="standard">Standard (24h SLA)</SelectItem>
                    <SelectItem value="high">High (8h SLA)</SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        Urgent (2h SLA){" "}
                        {isBasicPlan && <Lock className="w-3 h-3 text-muted-foreground" />}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {selectedPriority === "urgent" && isBasicPlan && (
          <Alert variant="default" className="bg-muted/50">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertTitle>Upgrade Required</AlertTitle>
            <AlertDescription className="text-sm">
              Urgent priority tickets with a guaranteed 2-hour SLA are exclusively available on our
              Enterprise Plan. Your ticket will be processed as Standard unless you upgrade.
            </AlertDescription>
            <Button variant="link" className="px-0 h-auto mt-2 text-primary">
              Upgrade Plan Now
            </Button>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide steps to reproduce, or detailed questions..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Submitting..." : "Submit Ticket"}
        </Button>
      </form>
    </Form>
  );
};
