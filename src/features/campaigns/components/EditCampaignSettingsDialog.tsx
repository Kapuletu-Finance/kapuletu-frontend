"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCampaignMutation } from "@/features/campaigns/services/mutations";
import IconLibrary from "@/features/shared/components/IconLibrary";

const formSchema = z.object({
  report_title: z.string().min(1, "Report title is required"),
  report_footer: z.string().min(1, "Report footer is required"),
  blank_slots: z.number().min(0, "Cannot be negative"),
  remove_watermark: z.boolean(),
  paid_indicator: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export interface EditCampaignSettingsDialogProps {
  campaignSlug: string;
  initialTitle: string;
  initialFooter: string;
  initialBlankSlots: number;
  initialRemoveWatermark: boolean;
  initialPaidIndicator: string;
  children: React.ReactElement;
}

const EditCampaignSettingsDialog: React.FC<EditCampaignSettingsDialogProps> = ({
  campaignSlug,
  initialTitle,
  initialFooter,
  initialBlankSlots,
  initialRemoveWatermark,
  initialPaidIndicator,
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const updateCampaign = useUpdateCampaignMutation(campaignSlug);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      report_title: initialTitle,
      report_footer: initialFooter,
      blank_slots: initialBlankSlots,
      remove_watermark: initialRemoveWatermark,
      paid_indicator: initialPaidIndicator,
    },
  });

  // Reset form when dialog opens with latest values
  React.useEffect(() => {
    if (open) {
      form.reset({
        report_title: initialTitle,
        report_footer: initialFooter,
        blank_slots: initialBlankSlots,
        remove_watermark: initialRemoveWatermark,
        paid_indicator: initialPaidIndicator,
      });
    }
  }, [
    open,
    initialTitle,
    initialFooter,
    initialBlankSlots,
    initialRemoveWatermark,
    initialPaidIndicator,
    form,
  ]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateCampaign.mutateAsync({
        settings: {
          report_title: data.report_title,
          report_footer: data.report_footer,
          blank_slots: data.blank_slots,
          remove_watermark: data.remove_watermark,
          paid_indicator: data.paid_indicator,
        },
      });
      setOpen(false);
    } catch (_error) {
      // Error handled globally
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Report Template</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
            {/* Header Section */}
            <div className="space-y-4 rounded-xl border border-border bg-card p-5">
              <div className="mb-2">
                <h3 className="font-semibold text-foreground text-sm">Report Title</h3>
              </div>
              <FormField
                control={form.control}
                name="report_title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Type your report header here..."
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <div className="pt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Available Variables:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "[Campaign Name]",
                          "[Campaign Description]",
                          "[Total Raised]",
                          "[Target Amount]",
                          "[Amount Remaining]",
                          "[Payment Instructions]",
                        ].map((v) => (
                          <Button
                            key={v}
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              form.setValue(
                                "report_title",
                                field.value + (field.value.endsWith(" ") ? "" : " ") + v,
                              )
                            }
                            className="text-xs h-7 px-3"
                          >
                            + {v.replace(/[[\]]/g, "")}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer Section */}
            <div className="space-y-4 rounded-xl border border-border bg-card p-5">
              <div className="mb-2">
                <h3 className="font-semibold text-foreground text-sm">Report Footer</h3>
              </div>
              <FormField
                control={form.control}
                name="report_footer"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Type your report footer here..."
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <div className="pt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Available Variables:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "[Campaign Name]",
                          "[Campaign Description]",
                          "[Total Raised]",
                          "[Target Amount]",
                          "[Amount Remaining]",
                          "[Payment Instructions]",
                        ].map((v) => (
                          <Button
                            key={v}
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              form.setValue(
                                "report_footer",
                                field.value + (field.value.endsWith(" ") ? "" : " ") + v,
                              )
                            }
                            className="text-xs h-7 px-3"
                          >
                            + {v.replace(/[[\]]/g, "")}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Advanced Settings */}
            <Accordion className="w-full rounded-xl border border-border overflow-hidden">
              <AccordionItem value="advanced" className="border-none">
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="text-sm font-semibold">Advanced Layout Settings</div>
                </AccordionTrigger>
                <AccordionContent className="p-5 border-t border-border bg-card">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="blank_slots"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blank Slots</FormLabel>
                          <div className="text-xs text-muted-foreground mb-3">
                            Empty numbered lines to motivate more contributions.
                          </div>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              className="w-full max-w-[120px]"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paid_indicator"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Paid Status Indicator</FormLabel>
                          <div className="text-xs text-muted-foreground mb-3">
                            Text or emoji appended to paid contributions.
                          </div>
                          <FormControl>
                            <Input placeholder="\u2713 or [PAID]" className="w-full" {...field} />
                          </FormControl>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {["\u2713", "\u2705", "\ud83d\udcaf", "[PAID]"].map((preset) => (
                              <Button
                                key={preset}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => form.setValue("paid_indicator", preset)}
                                className="h-7 text-xs px-3"
                              >
                                {preset}
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="remove_watermark"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2 flex flex-row items-center justify-between rounded-xl border border-border bg-card p-5">
                          <div className="space-y-1">
                            <FormLabel className="text-sm font-semibold">
                              Include KapuLetu Watermark
                            </FormLabel>
                            <div className="text-xs text-muted-foreground">
                              Show "Powered by KapuLetu" on your reports.
                            </div>
                          </div>
                          <FormControl>
                            <LabeledSwitch
                              checked={!field.value}
                              onCheckedChange={(checked) => field.onChange(!checked)}
                              labelOn="YES"
                              labelOff="NO"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

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
