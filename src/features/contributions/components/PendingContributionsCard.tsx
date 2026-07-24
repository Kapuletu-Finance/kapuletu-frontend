import CardWithIcon from "@/features/shared/components/CardWithIcon";
import IconLibrary from "@/features/shared/components/IconLibrary";

const PendingContributionsCard = () => {
  return (
    <CardWithIcon
      label="Awaiting approval"
      value={0}
      icon={<IconLibrary name="clock" className="w-5 h-5 text-primary-foreground" />}
    />
  );
};

export default PendingContributionsCard;
