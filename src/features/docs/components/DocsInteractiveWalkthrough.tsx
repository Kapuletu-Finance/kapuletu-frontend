"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DocsInteractiveWalkthroughProps {
  scenario: string;
}

export const DocsInteractiveWalkthrough: React.FC<DocsInteractiveWalkthroughProps> = ({
  scenario,
}) => {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Start", instruction: "Click 'Add Contribution' to begin." },
    { title: "Select Member", instruction: "Choose 'John Doe' from the dropdown." },
    { title: "Enter Amount", instruction: "Type '500' in the amount field." },
    { title: "Complete", instruction: "Click 'Save'. Great job!" },
  ];

  return (
    <div className="my-8 border border-primary/20 bg-card rounded-xl overflow-hidden shadow-sm">
      <div className="bg-primary/5 p-4 border-b border-primary/20">
        <h3 className="font-semibold text-primary flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          Interactive Walkthrough: {scenario}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Try it yourself in this safe, simulated environment.
        </p>
      </div>

      <div className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-muted/10 relative">
        <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
          Step {step + 1} of {steps.length}
        </div>

        <div className="max-w-sm text-center">
          <h4 className="font-bold text-lg mb-2">{steps[step].title}</h4>
          <p className="mb-6">{steps[step].instruction}</p>

          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Simulate Action</Button>
          ) : (
            <Button variant="outline" onClick={() => setStep(0)}>
              Restart Walkthrough
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
