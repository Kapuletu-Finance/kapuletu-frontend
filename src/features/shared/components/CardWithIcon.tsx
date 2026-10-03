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
      <div className="bg-primary/10 size-12 flex items-center justify-center rounded-full shrink-0">
        <div className="text-primary *:size-6">{icon}</div>
      </div>
    </Card>
  );
};

export default CardWithIcon;
