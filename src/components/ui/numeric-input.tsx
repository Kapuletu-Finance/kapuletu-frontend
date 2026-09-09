import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { cn } from "@/lib/utils";

export interface NumericInputProps extends Omit<NumericFormatProps, "customInput" | "type"> {
  className?: string;
  onChangeValue?: (value: number | undefined) => void;
}

export const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ className, onChangeValue, onValueChange, ...props }, ref) => {
    return (
      <NumericFormat
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        getInputRef={ref}
        thousandSeparator={true}
        allowNegative={false}
        decimalScale={2}
        onValueChange={(values, sourceInfo) => {
          if (onValueChange) {
            onValueChange(values, sourceInfo);
          }
          if (onChangeValue) {
            onChangeValue(values.floatValue);
          }
        }}
        {...props}
      />
    );
  }
);
NumericInput.displayName = "NumericInput";
