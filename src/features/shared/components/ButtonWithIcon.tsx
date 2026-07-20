import { Button } from "@/components/ui/button";
import type { IconName } from "@/features/shared/components/IconLibrary";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface ButtonWithIconProps {
  iconName: IconName;
  label: string;
  onClick?: () => void;
}

const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  iconName,
  label = "Create a group",
  onClick,
}) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-auto py-4 px-4 border-primary border rounded-xl flex items-center justify-between w-full hover:bg-primary/5 transition-colors"
    >
      <span className="text-left text-primary font-semibold text-sm leading-snug whitespace-normal wrap-break-word pr-2">
        {label}
      </span>
      <IconLibrary name={iconName} className="text-burnt-amber size-6 shrink-0" strokeWidth={1.5} />
    </Button>
  );
};

export default ButtonWithIcon;
