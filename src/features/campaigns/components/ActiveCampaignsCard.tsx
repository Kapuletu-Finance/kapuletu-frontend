import CardWithIcon from "@/features/shared/components/CardWithIcon";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface ActiveCampaignsCardProps {
  value?: number;
}

const ActiveCampaignsCard = ({ value = 0 }: ActiveCampaignsCardProps) => {
  return (
    <CardWithIcon
      label="Total campaigns"
      value={value}
      icon={<IconLibrary name="inbox" className="w-5 h-5 text-primary-foreground" />}
    />
  );
};

export default ActiveCampaignsCard;
