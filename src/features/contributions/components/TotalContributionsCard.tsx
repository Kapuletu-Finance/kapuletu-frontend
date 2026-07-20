import { Banknote } from "lucide-react";
import CardWithIcon from "@/features/shared/components/CardWithIcon";

const TotalContributionsCard = () => {
  return (
    <CardWithIcon
      label="Total contributions"
      value="Ksh. 0"
      icon={<Banknote className="w-5 h-5 text-primary-foreground" />}
    />
  );
};

export default TotalContributionsCard;
