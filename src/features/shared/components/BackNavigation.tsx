import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface BackNavigationProps {
  href: string;
  label: string;
  className?: string;
}

export const BackNavigation: React.FC<BackNavigationProps> = ({ href, label, className = "" }) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`p-0 h-auto w-fit text-muted-foreground hover:text-foreground hover:bg-transparent justify-start mb-4 gap-1.5 transition-colors ${className}`}
      onClick={() => router.push(href)}
    >
      <IconLibrary name="arrow-left" className="size-4" />
      <span className="font-medium text-sm">{label}</span>
    </Button>
  );
};
