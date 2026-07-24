import CardWithIcon from "@/features/shared/components/CardWithIcon";
import IconLibrary from "@/features/shared/components/IconLibrary";

const TotalContributionsCard = () => {
  return (
    <CardWithIcon
      label="Active groups"
      value={0}
      icon={<IconLibrary name="badge-check" className="w-5 h-5 text-primary-foreground" />}
    />
  );
};

export default TotalContributionsCard;
