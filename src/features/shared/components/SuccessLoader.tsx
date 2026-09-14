"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface SuccessLoaderProps {
  className?: string;
  size?: number;
}

export const SuccessLoader: React.FC<SuccessLoaderProps> = ({ className, size = 48 }) => {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center text-primary", className)}
      style={{ width: size, height: size }}
    >
      <svg
        className="w-full h-full success-loader-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
        role="img"
        aria-label="Success"
      >
        <title>Success</title>
        <circle
          className="success-loader-circle"
          cx="26"
          cy="26"
          r="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path
          className="success-loader-check"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 27l7 7 16-16"
        />
      </svg>
      <style>{`
        .success-loader-svg {
          animation: loaderScale 0.3s ease-in-out forwards;
        }
        .success-loader-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: loaderCircle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .success-loader-check {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: loaderCheck 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
        }

        @keyframes loaderScale {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes loaderCircle {
          0% {
            stroke-dashoffset: 166;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes loaderCheck {
          0% {
            stroke-dashoffset: 48;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};
