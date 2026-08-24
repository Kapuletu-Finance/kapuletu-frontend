"use client";

import type React from "react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useInjectTrainingSampleMutation } from "@/features/admin/services/mutations";
import { useAITrainingPoolQuery } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const TrainingPoolTab: React.FC = () => {
  const { data: pool, isLoading } = useAITrainingPoolQuery();
  const { mutate: injectSample, isPending } = useInjectTrainingSampleMutation();

  const [isInjectOpen, setIsInjectOpen] = useState(false);
  const [rawText, setRawText] = useState("");
  const [jsonGroundTruth, setJsonGroundTruth] = useState(
    '{\n  "amount": 0,\n  "sender_name": "",\n  "reference": ""\n}',
  );
  const [jsonError, setJsonError] = useState("");

  const handleInject = () => {
    try {
      const parsedTruth = JSON.parse(jsonGroundTruth);
      setJsonError("");
      injectSample(
        { text: rawText, ground_truth: parsedTruth },
        {
          onSuccess: () => {
            setIsInjectOpen(false);
            setRawText("");
            setJsonGroundTruth('{\n  "amount": 0,\n  "sender_name": "",\n  "reference": ""\n}');
          },
        },
      );
    } catch (_e) {
      setJsonError("Invalid JSON format");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Ground Truth Dataset</h3>
          <p className="text-sm text-muted-foreground">
            {pool?.length || 0} approved samples currently in the training pool.
          </p>
        </div>
        <Dialog open={isInjectOpen} onOpenChange={setIsInjectOpen}>
          <DialogTrigger className={buttonVariants({ variant: "default", className: "gap-2" })}>
            <IconLibrary name="add" className="h-4 w-4" /> Inject Synthetic Sample
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Inject Training Sample</DialogTitle>
              <DialogDescription>
                Manually teach the AI a new SMS format by providing the raw text and the expected
                JSON output.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="raw-sms" className="text-sm font-medium">
                  Raw SMS Message
                </label>
                <Textarea
                  id="raw-sms"
                  placeholder="e.g. You have received Ksh 500 from John Doe..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="expected-json" className="text-sm font-medium">
                    Expected JSON Output (Ground Truth)
                  </label>
                  {jsonError && <span className="text-xs text-destructive">{jsonError}</span>}
                </div>
                <Textarea
                  id="expected-json"
                  value={jsonGroundTruth}
                  onChange={(e) => {
                    setJsonGroundTruth(e.target.value);
                    setJsonError("");
                  }}
                  className="font-mono text-sm min-h-[150px] bg-muted/50"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsInjectOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleInject}
                disabled={isPending || !rawText.trim() || !jsonGroundTruth.trim()}
              >
                {isPending ? "Injecting..." : "Inject Sample"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Sample ID</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Raw Text snippet</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pool && pool.length > 0 ? (
              pool.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/20">
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    {item.id.split("-")[0]}...
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {item.source === "treasurer_correction" ? "Correction" : "Synthetic"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm max-w-[300px] truncate">{item.text}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No training samples available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
