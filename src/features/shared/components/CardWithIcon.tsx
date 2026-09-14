import type React from "react";
import { Card } from "@/components/ui/card";

interface CardWithIconProps {
  label: string;
  value: number | string | React.ReactNode;
  icon: React.ReactNode;
}

const CardWithIcon: React.FC<CardWithIconProps> = ({ label, value, icon }) => {
  return (
    <Card className="border-none bg-background flex flex-row items-center justify-between">
      <div className="flex flex-col gap-1 text-left">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="text-xl text-foreground font-medium">{value}</div>
      </div>
      <div className="bg-primary size-12 flex items-center justify-center rounded-md shrink-0">
        {icon}
      </div>
    </Card>
  );
};

export default CardWithIcon;
