import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "default";
  disabled?: boolean;
}

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  className,
  size = "default",
  disabled = false,
}: SegmentedControlProps<T>) => (
  <div className={cn("inline-flex gap-1 rounded-lg bg-muted p-1", className)} role="group">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        aria-pressed={value === option.value}
        disabled={disabled}
        onClick={() => onChange(option.value)}
        className={cn(
          "flex-1 rounded-md font-medium transition-colors",
          size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
          value === option.value
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
);
