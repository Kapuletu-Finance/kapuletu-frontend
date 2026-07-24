import { Button } from "@/components/ui/button";
import type { IconName } from "@/features/shared/components/IconLibrary";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface ButtonWithIconProps {
  iconName: IconName;
  label: string;
  description?: string;
  onClick?: () => void;
}

const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  iconName,
  label,
  description,
  onClick,
}) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-auto py-4 px-4 border-border border rounded-xl flex items-center justify-start gap-4 w-full hover:bg-primary/5 transition-colors bg-background"
    >
      <IconLibrary name={iconName} className="text-burnt-amber size-6 shrink-0" strokeWidth={1.5} />
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
};

export default ButtonWithIcon;
