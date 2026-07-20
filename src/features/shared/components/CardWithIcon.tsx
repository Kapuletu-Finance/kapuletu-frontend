import type React from "react";
import { Card } from "@/components/ui/card";

interface CardWithIconProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}

const CardWithIcon: React.FC<CardWithIconProps> = ({ label, value, icon }) => {
  return (
    <Card className="shadow-sm p-5 flex flex-row items-center justify-between">
      <div className="space-y-1 text-left">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className="text-2xl text-foreground">{value}</p>
      </div>
      <div className="bg-primary p-3 rounded-xl shrink-0">{icon}</div>
    </Card>
  );
};

export default CardWithIcon;
