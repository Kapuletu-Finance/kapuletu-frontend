import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/features/shared/components/FeatureCard";
import IconLibrary, { type IconName } from "@/features/shared/components/IconLibrary";

const PublicCampaignReportBottom = () => {
  const features: { icon: IconName; title: string; description: string }[] = [
    {
      icon: "group",
      title: "Campaign Management",
      description:
        "Set up specific fundraising campaigns, track targets, and monitor member contributions towards goal progress.",
    },
    {
      icon: "report",
      title: "100% transparent",
      description:
        "Keep track of every contribution, expense, and payout. Treasurers and members get real-time, automated updates.",
    },
    {
      icon: "shield-check",
      title: "Tamper-proof Ledger",
      description: "Every approved contribution is recorded securely and cannot be altered.",
    },
    {
      icon: "analytics",
      title: "Analytics & Reports",
      description:
        "Get accurate reports and insights to help you plan better and make smarter descisions.",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-background">
      {/* Left Column: Headline & CTA */}
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
            Simplify group finance. <br />
            Build{" "}
            <span className="text-primary relative inline-block">
              trust
              <svg
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                className="absolute left-0 -bottom-1.5 w-full h-3 text-burnt-amber/90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M5 8C30 5 70 3 95 4C60 8 30 14 15 15C40 13 60 14 85 14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>{" "}
            together
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            KapuLetu simplifies treasury management by enabling financial leaders to track
            contributions, monitor expenses, reconcile inbox, and maintain secure financial records,
            all in one place.
          </p>
        </div>

        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 py-6 text-base font-semibold shadow-sm">
          Get started
        </Button>
      </div>

      {/* Right Column: Feature Cards Grid */}
      <div className="lg:col-span-7">
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((item) => (
            <FeatureCard
              key={item.title}
              icon={<IconLibrary name={item.icon} className="w-6 h-6 text-primary" />}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicCampaignReportBottom;
