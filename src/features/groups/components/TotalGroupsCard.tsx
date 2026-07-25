import CardWithIcon from "@/features/shared/components/CardWithIcon";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface TotalGroupsCardProps {
  value?: number;
}

const TotalGroupsCard = ({ value = 0 }: TotalGroupsCardProps) => {
  return (
    <CardWithIcon
      label="Total number of groups"
      value={value}
      icon={<IconLibrary name="group" className="w-5 h-5 text-primary-foreground" />}
    />
  );
};

export default TotalGroupsCard;
