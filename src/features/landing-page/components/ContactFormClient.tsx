"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { apiClient as api } from "@/lib/api-client";

const contactSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  topic: z.string().min(1, "Please select a topic"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactFormClient: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await api.post("/support/public/contact", data);
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Failed to send contact message", error);
      setSubmitError("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center space-y-4">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
          <IconLibrary name="check" className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Message Sent!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thank you for reaching out. We have received your message and our support team will get
          back to you shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-4 text-primary hover:underline text-sm font-medium"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {submitError && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
          {submitError}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="first_name"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            First name
          </label>
          <input
            {...register("first_name")}
            type="text"
            id="first_name"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="John"
          />
          {errors.first_name && (
            <span className="text-xs text-red-500">{errors.first_name.message}</span>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="last_name"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Last name
          </label>
          <input
            {...register("last_name")}
            type="text"
            id="last_name"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Doe"
          />
          {errors.last_name && (
            <span className="text-xs text-red-500">{errors.last_name.message}</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="john@example.com"
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="topic"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          How can we help?
        </label>
        <select
          {...register("topic")}
          id="topic"
          defaultValue=""
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled>
            Select a topic
          </option>
          <option value="sales">Sales Inquiry</option>
          <option value="billing">Billing & Subscriptions</option>
          <option value="technical">Technical Support</option>
          <option value="other">Other</option>
        </select>
        {errors.topic && <span className="text-xs text-red-500">{errors.topic.message}</span>}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Message
        </label>
        <textarea
          {...register("message")}
          id="message"
          rows={5}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Please describe your issue in detail..."
        />
        {errors.message && <span className="text-xs text-red-500">{errors.message.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full sm:w-auto gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
};
