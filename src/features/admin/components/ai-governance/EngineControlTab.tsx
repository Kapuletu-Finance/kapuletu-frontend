"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  useTriggerAITrainingMutation,
  useUpdateAIConfigMutation,
} from "@/features/admin/services/mutations";
import { useAIConfigQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const EngineControlTab: React.FC = () => {
  const { data: config, isLoading } = useAIConfigQuery();
  const { mutate: updateConfig, isPending: isUpdating } = useUpdateAIConfigMutation();
  const { mutate: triggerTraining, isPending: isTraining } = useTriggerAITrainingMutation();

  const [trainingMode, setTrainingMode] = useState<string>("periodic");
  const [threshold, setThreshold] = useState<number>(50);
  const [isTrainDialogOpen, setIsTrainDialogOpen] = useState(false);
  const [epochs, setEpochs] = useState<number>(10);

  useEffect(() => {
    if (config) {
      setTrainingMode(config.training_mode || "periodic");
      setThreshold(config.continuous_threshold || 50);
    }
  }, [config]);

  const handleSaveConfig = () => {
    updateConfig({
      training_mode: trainingMode,
      continuous_threshold: threshold,
    });
  };

  const handleTriggerTraining = () => {
    triggerTraining(
      { epochs },
      {
        onSuccess: () => {
          setIsTrainDialogOpen(false);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-sm">
        <CardHeader className="bg-muted/30 border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <IconLibrary name="settings" className="h-5 w-5 text-primary" />
                Training Policy Configuration
              </CardTitle>
              <CardDescription className="mt-1.5">
                Manage how and when the Kapuletu NLP engine updates its weights.
              </CardDescription>
            </div>
            <Button onClick={handleSaveConfig} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Policy"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <div className="space-y-4">
            <h4 className="text-sm font-medium leading-none">Training Strategy</h4>
            <RadioGroup
              value={trainingMode}
              onValueChange={setTrainingMode}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="relative">
                <Label
                  htmlFor="mode-periodic"
                  className={`flex flex-col cursor-pointer border rounded-xl p-4 transition-colors ${
                    trainingMode === "periodic"
                      ? "bg-primary/5 border-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">Periodic (Manual)</span>
                    <RadioGroupItem value="periodic" id="mode-periodic" />
                  </div>
                  <span className="text-sm text-muted-foreground font-normal leading-relaxed">
                    The model only trains when manually triggered by an admin. Best for strict
                    governance and preventing data poisoning.
                  </span>
                </Label>
              </div>
              <div className="relative">
                <Label
                  htmlFor="mode-continuous"
                  className={`flex flex-col cursor-pointer border rounded-xl p-4 transition-colors ${
                    trainingMode === "continuous"
                      ? "bg-primary/5 border-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">Continuous (Auto-batch)</span>
                    <RadioGroupItem value="continuous" id="mode-continuous" />
                  </div>
                  <span className="text-sm text-muted-foreground font-normal leading-relaxed">
                    The model automatically triggers a training job once the threshold of approved
                    samples is reached.
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div
            className={`space-y-4 pt-4 border-t transition-opacity duration-300 ${trainingMode !== "continuous" ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium leading-none">Continuous Threshold</h4>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Number of approved samples required before auto-triggering a training job.
                </p>
              </div>
              <span className="text-2xl font-bold font-mono">{threshold}</span>
            </div>
            <Slider
              value={[threshold]}
              onValueChange={(v) => {
                if (Array.isArray(v)) setThreshold(v[0]);
                else if (typeof v === "number") setThreshold(v as number);
              }}
              min={10}
              max={500}
              step={10}
              className="py-4"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-destructive">
            <IconLibrary name="brain" className="h-5 w-5" />
            Deploy Training Job
          </CardTitle>
          <CardDescription>
            Manually dispatch a SageMaker training job using all approved ground-truth samples.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isTrainDialogOpen} onOpenChange={setIsTrainDialogOpen}>
            <DialogTrigger
              className={buttonVariants({
                variant: "destructive",
                className: "w-full sm:w-auto gap-2",
              })}
            >
              <IconLibrary name="zap" className="h-4 w-4" /> Trigger AI Retraining Now
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configure Training Job</DialogTitle>
                <DialogDescription>
                  This action will consume compute resources. Ensure the ground truth pool is
                  sufficiently large.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Training Epochs</Label>
                  <Input
                    type="number"
                    value={epochs}
                    onChange={(e) => setEpochs(parseInt(e.target.value, 10) || 10)}
                    min={1}
                    max={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher epochs may lead to better accuracy but increase compute time. Default is
                    10.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsTrainDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleTriggerTraining} disabled={isTraining}>
                  {isTraining ? "Dispatching..." : "Dispatch Job"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};
