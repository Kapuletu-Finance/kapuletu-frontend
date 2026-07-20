import { Wallet } from "lucide-react";
import CardWithIcon from "@/features/shared/components/CardWithIcon";

const ActiveCampaignsCard = () => {
  return (
    <CardWithIcon
      label="Active campaigns"
      value={0}
      icon={<Wallet className="w-5 h-5 text-primary-foreground" />}
    />
  );
};

export default ActiveCampaignsCard;
