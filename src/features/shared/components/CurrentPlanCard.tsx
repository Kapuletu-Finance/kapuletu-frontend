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
      <div
        className={`rounded-2xl ${config.bgClass} ${config.textClass} shadow-lg border-none group-data-[collapsible=icon]:hidden overflow-hidden`}
      >
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium tracking-tight text-sm sm:text-base">Current Plan :</span>
            <div className="flex items-center gap-2">
              <div className={config.iconWrapperClass}>
                <IconLibrary name={config.icon} className={config.iconClass} />
              </div>
              <span className="font-bold tracking-wider">{config.name}</span>
            </div>
          </div>

          <div
            className={`w-full py-3 px-4 rounded-2xl text-center cursor-pointer hover:opacity-90 transition-opacity ${config.buttonClass}`}
          >
            <p className="text-sm font-semibold leading-tight">{config.buttonText}</p>
          </div>
        </div>
      </div>

      {/* Collapsed Icon View */}
      <div className="hidden group-data-[collapsible=icon]:flex justify-center shrink-0">
        <div
          className={`flex items-center justify-center size-10 rounded-sm cursor-pointer hover:opacity-80 transition-opacity ${config.bgClass} ${config.textClass}`}
        >
          <IconLibrary name={config.icon} className="size-5 fill-current" />
        </div>
      </div>
    </>
  );
};

export default CurrentPlanCard;

const PLAN_CONFIG = {
  free: {
    name: "FREE",
    bgClass: "bg-gradient-to-r from-plan-free-from to-plan-free-to",
    textClass: "text-plan-free-fg",
    icon: "gift" as IconName,
    iconWrapperClass: "",
    iconClass: "w-6 h-6",
    buttonText: "Unlock all premium features free for 14 days",
    buttonClass: "bg-background text-foreground shadow-sm",
  },
  bronze: {
    name: "BRONZE",
    bgClass: "bg-gradient-to-r from-plan-bronze-from to-plan-bronze-to",
    textClass: "text-plan-bronze-fg",
    icon: "star" as IconName,
    iconWrapperClass:
      "bg-gradient-to-br from-amber-500 to-amber-700 border border-white/40 p-1.5 rounded-full shadow-inner",
    iconClass: "w-4 h-4 text-amber-100 fill-amber-100",
    buttonText: "Manage Subscription",
    buttonClass: "bg-background text-foreground shadow-sm",
  },
  silver: {
    name: "SILVER",
    bgClass: "bg-gradient-to-r from-plan-silver-from to-plan-silver-to",
    textClass: "text-plan-silver-fg",
    icon: "star" as IconName,
    iconWrapperClass:
      "bg-gradient-to-br from-slate-300 to-slate-500 border border-white/40 p-1.5 rounded-full shadow-inner",
    iconClass: "w-4 h-4 text-slate-100 fill-slate-100",
    buttonText: "Manage Subscription",
    buttonClass: "bg-background text-foreground shadow-sm",
  },
  gold: {
    name: "GOLD",
    bgClass: "bg-gradient-to-r from-plan-gold-from to-plan-gold-to",
    textClass: "text-plan-gold-fg",
    icon: "star" as IconName,
    iconWrapperClass:
      "bg-gradient-to-br from-yellow-300 to-amber-500 border border-white/40 p-1.5 rounded-full shadow-inner",
    iconClass: "w-4 h-4 text-yellow-100 fill-yellow-100",
    buttonText: "Manage Subscription",
    buttonClass: "bg-background text-foreground shadow-sm",
  },
};
