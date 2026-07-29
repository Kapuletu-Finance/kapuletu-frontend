import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMySubscriptionQuery } from "@/features/auth/services/queries";
import type { IconName } from "@/features/shared/components/IconLibrary";
import IconLibrary from "@/features/shared/components/IconLibrary";

type PlanType = "free" | "bronze" | "silver" | "gold";

const CurrentPlanCard = () => {
  const { isMobile, setOpenMobile } = useSidebar();
  const { data, isLoading } = useGetMySubscriptionQuery();

  const planName = data?.active_plan?.toLowerCase() as PlanType;
  const plan = PLAN_CONFIG[planName] ? planName : "free";
  const config = PLAN_CONFIG[plan];

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const formattedDate = data?.expiry_date
    ? new Date(data.expiry_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No expiry";

  return (
    <>
      <Card className="border border-primary/50 bg-primary/20 group-data-[collapsible=icon]:hidden overflow-hidden">
        <CardContent className="flex flex-col items-center space-y-2">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Skeleton className="w-8 h-8 rounded-md" />
            ) : (
              <div className={config.iconWrapperClass}>
                <IconLibrary name={config.icon} className={config.iconClass} />
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-foreground text-sm sm:text-base">
                Current Plan :
              </span>
              {isLoading ? (
                <Skeleton className="h-5 w-16" />
              ) : (
                <span className="font-bold tracking-wider text-foreground text-sm sm:text-base">
                  {config.name}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium h-5">
            {isLoading ? <Skeleton className="h-4 w-40" /> : `Next billing date: ${formattedDate}`}
          </p>

          <Link href="/subscriptions" className="w-full" onClick={handleClick}>
            <Button className="w-full font-semibold">{config.buttonText}</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Collapsed Icon View */}
      <Button
        variant="ghost"
        className="hidden group-data-[collapsible=icon]:flex justify-center shrink-0 w-full hover:bg-transparent h-auto p-0"
        onClick={handleClick}
      >
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          <div className={config.iconWrapperClass}>
            <IconLibrary name={config.icon} className={config.iconClass} />
          </div>
        </div>
      </Button>
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
    iconWrapperClass:
      "flex items-center justify-center p-1.5 rounded-md bg-secondary shadow-inner border border-white/20",
    iconClass: "w-4 h-4 text-secondary-foreground",
    buttonText: "Unlock all premium features free for 14 days",
  },
  bronze: {
    name: "BRONZE",
    icon: "star",
    iconWrapperClass:
      "flex items-center justify-center p-1.5 rounded-md bg-primary shadow-inner border border-white/20",
    iconClass: "w-4 h-4 text-primary-foreground fill-primary-foreground",
    buttonText: "Manage Subscription",
  },
  silver: {
    name: "SILVER",
    icon: "star",
    iconWrapperClass:
      "flex items-center justify-center p-1.5 rounded-md bg-primary shadow-inner border border-white/20",
    iconClass: "w-4 h-4 text-primary-foreground fill-primary-foreground",
    buttonText: "Manage Subscription",
  },
  gold: {
    name: "GOLD",
    icon: "star",
    iconWrapperClass:
      "flex items-center justify-center p-1.5 rounded-md bg-primary shadow-inner border border-white/20",
    iconClass: "w-4 h-4 text-primary-foreground fill-primary-foreground",
    buttonText: "Manage Subscription",
  },
};
