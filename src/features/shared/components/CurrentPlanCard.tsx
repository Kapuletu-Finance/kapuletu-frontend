import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IconName } from "@/features/shared/components/IconLibrary";
import IconLibrary from "@/features/shared/components/IconLibrary";

type PlanType = "free" | "bronze" | "silver" | "gold";

interface CurrentPlanCardProps {
  plan: PlanType;
}

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({ plan }) => {
  const config = PLAN_CONFIG[plan];

  return (
    <>
      <Card className="border border-primary/50 bg-primary/20 group-data-[collapsible=icon]:hidden overflow-hidden">
        <CardContent className="flex flex-col items-center space-y-2">
          <div className="flex items-center gap-2">
            <div className={config.iconWrapperClass}>
              <IconLibrary name={config.icon} className={config.iconClass} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-foreground text-sm sm:text-base">
                Current Plan :
              </span>
              <span className="font-bold tracking-wider text-foreground text-sm sm:text-base">
                {config.name}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Next billing date: 22 July 2026
          </p>

          <Link href="/subscriptions" className="w-full">
            <Button className="w-full font-semibold">{config.buttonText}</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Collapsed Icon View */}
      <div className="hidden group-data-[collapsible=icon]:flex justify-center shrink-0">
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          <div className={config.iconWrapperClass}>
            <IconLibrary name={config.icon} className={config.iconClass} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentPlanCard;

interface PlanConfig {
  name: string;
  icon: IconName;
  iconWrapperClass: string;
  iconClass: string;
  buttonText: string;
}

const PLAN_CONFIG: Record<PlanType, PlanConfig> = {
  free: {
    name: "FREE",
    icon: "gift",
    iconWrapperClass: "flex items-center justify-center",
    iconClass: "w-5 h-5 text-muted-foreground",
    buttonText: "Unlock all premium features free for 14 days",
  },
  bronze: {
    name: "BRONZE",
    icon: "star",
    iconWrapperClass:
      "flex items-center justify-center p-1.5 rounded-md bg-gradient-to-br from-plan-bronze-from to-plan-bronze-to shadow-inner border border-white/20",
    iconClass: "w-4 h-4 text-plan-bronze-fg fill-plan-bronze-fg",
    buttonText: "Manage Subscription",
  },
  silver: {
    name: "SILVER",
    icon: "star",
    iconWrapperClass: "flex items-center justify-center",
    iconClass: "w-6 h-6 text-plan-silver fill-plan-silver",
    buttonText: "Manage Subscription",
  },
  gold: {
    name: "GOLD",
    icon: "star",
    iconWrapperClass:
      "flex items-center justify-center p-1.5 rounded-md bg-gradient-to-br from-plan-gold-from to-plan-gold-to shadow-inner border border-white/20",
    iconClass: "w-4 h-4 text-plan-gold-fg fill-plan-gold-fg",
    buttonText: "Manage Subscription",
  },
};
