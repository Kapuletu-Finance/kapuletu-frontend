import CardWithIcon from "@/features/shared/components/CardWithIcon";
import IconLibrary from "@/features/shared/components/IconLibrary";

const TotalGroupsCard = () => {
  return (
    <CardWithIcon
      label="Total number of groups"
      value={0}
      icon={<IconLibrary name="group" className="w-5 h-5 text-primary-foreground" />}
    />
  );
};

export default TotalGroupsCard;
