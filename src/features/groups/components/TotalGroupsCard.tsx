import { Users } from "lucide-react";
import CardWithIcon from "@/features/shared/components/CardWithIcon";

const TotalGroupsCard = () => {
  return (
    <CardWithIcon
      label="Total number of groups"
      value={0}
      icon={<Users className="w-5 h-5 text-primary-foreground" />}
    />
  );
};

export default TotalGroupsCard;
