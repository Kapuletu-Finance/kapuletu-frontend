"use client";
import Image from "next/image";
import type React from "react";
import { useState } from "react";

interface Step {
  title: string;
  description: string;
}

interface DocsScreenshotSequenceProps {
  steps: Step[];
  alt?: string;
}

export const DocsScreenshotSequence: React.FC<DocsScreenshotSequenceProps> = ({
  steps,
  alt = "Guided screenshot",
}) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="my-8 border border-border rounded-lg overflow-hidden bg-card">
      <div className="relative aspect-[16/9] bg-muted flex items-center justify-center border-b border-border">
        {/* We use the placeholder screenshot.png for all steps for now */}
        <div className="w-full h-full relative">
          <Image
            src="/shared/screenshot.png"
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
          {/* A highlight indicator that points to the current step */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg shadow-black/20 text-lg border-4 border-background transition-transform duration-300 scale-110">
              {activeStep + 1}
            </div>
          </div>
        </div>
      </div>
      <div className="p-0">
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`flex-1 p-4 text-left transition-colors ${activeStep === index ? "bg-muted/50" : "hover:bg-muted/20"}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep === index ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"}`}
                >
                  {index + 1}
                </span>
                <div>
                  <h6
                    className={`text-sm font-semibold ${activeStep === index ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.title}
                  </h6>
                  {activeStep === index && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed animate-in fade-in slide-in-from-top-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
