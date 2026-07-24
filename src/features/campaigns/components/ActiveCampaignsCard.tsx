import CardWithIcon from "@/features/shared/components/CardWithIcon";
import IconLibrary from "@/features/shared/components/IconLibrary";

const ActiveCampaignsCard = () => {
  return (
    <CardWithIcon
      label="Total campaigns"
      value={0}
      icon={<IconLibrary name="transaction" className="w-5 h-5 text-primary-foreground" />}
    />
  );
};

export default ActiveCampaignsCard;
