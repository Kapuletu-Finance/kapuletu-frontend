"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCampaignMutation } from "@/features/campaigns/services/mutations";

const formSchema = z.object({
  report_title: z.string().min(1, "Report title is required"),
  report_footer: z.string().min(1, "Report footer is required"),
});

type FormValues = z.infer<typeof formSchema>;

export interface EditCampaignSettingsDialogProps {
  campaignSlug: string;
  initialTitle: string;
  initialFooter: string;
  children: React.ReactElement;
}

const EditCampaignSettingsDialog: React.FC<EditCampaignSettingsDialogProps> = ({
  campaignSlug,
  initialTitle,
  initialFooter,
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const updateCampaign = useUpdateCampaignMutation(campaignSlug);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      report_title: initialTitle,
      report_footer: initialFooter,
    },
  });

  // Reset form when dialog opens with latest values
  React.useEffect(() => {
    if (open) {
      form.reset({
        report_title: initialTitle,
        report_footer: initialFooter,
      });
    }
  }, [open, initialTitle, initialFooter, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateCampaign.mutateAsync({
        settings: {
          report_title: data.report_title,
          report_footer: data.report_footer,
        },
      });
      setOpen(false);
    } catch (_error) {
      // Error handled globally
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Report Template</DialogTitle>
          <DialogDescription>
            Update the header and footer that appear on your campaign updates, PDF, and Excel
            reports. Click the variables to insert them.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="report_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Header</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter report header"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[
                      "[Campaign Name]",
                      "[Campaign Description]",
                      "[Total Raised]",
                      "[Target Amount]",
                      "[Amount Remaining]",
                      "[Payment Instructions]",
                    ].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() =>
                          form.setValue(
                            "report_title",
                            field.value + (field.value.endsWith(" ") ? "" : " ") + v,
                          )
                        }
                        className="text-xs bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary px-2 py-1 rounded-full transition-colors"
                      >
                        + {v.replace(/[[\]]/g, "")}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="report_footer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Footer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter report footer"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[
                      "[Campaign Name]",
                      "[Campaign Description]",
                      "[Total Raised]",
                      "[Target Amount]",
                      "[Amount Remaining]",
                      "[Payment Instructions]",
                    ].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() =>
                          form.setValue(
                            "report_footer",
                            field.value + (field.value.endsWith(" ") ? "" : " ") + v,
                          )
                        }
                        className="text-xs bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary px-2 py-1 rounded-full transition-colors"
                      >
                        + {v.replace(/[[\]]/g, "")}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={updateCampaign.isPending}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCampaignSettingsDialog;
