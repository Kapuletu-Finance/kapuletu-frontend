import * as React from "react";
import { Button } from "@/components/ui/button";
import type { IconName } from "@/features/shared/components/IconLibrary";
import IconLibrary from "@/features/shared/components/IconLibrary";

export interface ButtonWithIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconName: IconName;
  label: string;
  description?: string;
}

const ButtonWithIcon = React.forwardRef<HTMLButtonElement, ButtonWithIconProps>(
  ({ iconName, label, description, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={`h-auto py-4 px-4 border-border border flex items-center justify-start gap-4 w-full hover:bg-primary/5 transition-colors bg-background ${className || ""}`}
        {...props}
      >
        <IconLibrary
          name={iconName}
          className="text-burnt-amber size-6 shrink-0"
          strokeWidth={1.5}
        />
        <div className="flex flex-col items-start gap-0.5 text-left">
          <span className="text-primary font-semibold text-sm leading-snug whitespace-normal wrap-break-word">
            {label}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground font-medium">{description}</span>
          )}
        </div>
      </Button>
    );
  },
);
ButtonWithIcon.displayName = "ButtonWithIcon";

export default ButtonWithIcon;
