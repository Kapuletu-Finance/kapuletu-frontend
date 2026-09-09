"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LabeledSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  labelOn?: string;
  labelOff?: string;
}

export const LabeledSwitch: React.FC<LabeledSwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  labelOn = "Enabled",
  labelOff = "Disabled",
}) => {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      disabled={disabled}
      className={cn(
        "flex items-center justify-between w-[5.5rem] rounded-full px-1.5 h-8 shrink-0 transition-colors cursor-pointer",
        checked ? "bg-primary flex-row-reverse" : "bg-muted flex-row",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "text-[11px] font-bold truncate px-1",
          checked ? "text-primary-foreground" : "text-muted-foreground"
        )}
      >
        {checked ? labelOn : labelOff}
      </span>
      <div className="w-6 h-6 bg-white rounded-full shadow-sm shrink-0" />
    </button>
  );
};
