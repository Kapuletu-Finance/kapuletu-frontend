import CardWithIcon from "@/features/shared/components/CardWithIcon";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface TotalContributionsCardProps {
  value?: number;
}

const TotalContributionsCard = ({ value = 0 }: TotalContributionsCardProps) => {
  return (
    <CardWithIcon
      label="Active groups"
      value={value}
      icon={<IconLibrary name="badge-check" className="w-5 h-5 text-primary-foreground" />}
    />
  );
};

export default TotalContributionsCard;
