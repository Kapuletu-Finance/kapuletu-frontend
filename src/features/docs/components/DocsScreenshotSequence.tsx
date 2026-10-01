"use client";
import Image from "next/image";
import type React from "react";

interface Step {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  image?: string;
  secondaryImage?: string;
}

interface DocsScreenshotSequenceProps {
  steps: Step[];
  alt?: string;
}

export const DocsScreenshotSequence: React.FC<DocsScreenshotSequenceProps> = ({
  steps,
  alt = "Guided screenshot",
}) => {
  return (
    <div className="my-8 space-y-12">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground font-bold text-sm mt-0.5">
              {index + 1}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-muted-foreground mt-2 leading-relaxed">{step.description}</p>
            </div>
          </div>

          <div className="ml-11 border border-border rounded-lg overflow-hidden bg-card">
            {step.secondaryImage ? (
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="relative aspect-[16/9] bg-muted flex items-center justify-center p-2">
                  <Image
                    src={step.image || "/shared/screenshot.png"}
                    alt={`${alt} - Step ${index + 1} - Action`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain"
                  />
                </div>
                <div className="relative aspect-[16/9] bg-muted flex items-center justify-center p-2">
                  <Image
                    src={step.secondaryImage}
                    alt={`${alt} - Step ${index + 1} - Result`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="relative aspect-[16/9] bg-muted flex items-center justify-center">
                <Image
                  src={step.image || "/shared/screenshot.png"}
                  alt={`${alt} - Step ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
