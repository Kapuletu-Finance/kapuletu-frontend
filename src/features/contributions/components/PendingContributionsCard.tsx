import CardWithIcon from "@/features/shared/components/CardWithIcon";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface PendingContributionsCardProps {
  value?: number;
}

const PendingContributionsCard = ({ value = 0 }: PendingContributionsCardProps) => {
  return (
    <CardWithIcon
      label="Awaiting approval"
      value={value}
      icon={<IconLibrary name="clock" className="w-5 h-5 text-primary-foreground" />}
    />
  );
};

export default PendingContributionsCard;
