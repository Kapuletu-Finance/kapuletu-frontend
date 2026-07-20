import { Clock } from "lucide-react";
import CardWithIcon from "@/features/shared/components/CardWithIcon";

const PendingContributionsCard = () => {
  return (
    <CardWithIcon
      label="Pending contributions"
      value={0}
      icon={<Clock className="w-5 h-5 text-primary-foreground" />}
    />
  );
};

export default PendingContributionsCard;
