"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface LabelProps extends React.ComponentProps<"label"> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        data-slot="label"
        className={cn(
          "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-destructive">*</span>}
      </label>
    )
  }
)
Label.displayName = "Label"

export { Label }
