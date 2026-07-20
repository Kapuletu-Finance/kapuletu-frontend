import CardWithIcon from "@/features/shared/components/CardWithIcon";
import IconLibrary from "@/features/shared/components/IconLibrary";

const TotalContributionsCard = () => {
  return (
    <CardWithIcon
      label="Total contributions"
      value="Ksh. 0"
      icon={<IconLibrary name="transaction" className="w-5 h-5 text-primary-foreground" />}
    />
  );
};

export default TotalContributionsCard;
