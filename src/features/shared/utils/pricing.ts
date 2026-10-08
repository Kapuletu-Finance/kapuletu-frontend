export const getTierStyles = (id: string) => {
  if (id === "basic") {
    return {
      titleColor: "text-foreground",
      iconColor: "text-muted-foreground",
      borderColor: "border-muted-foreground",
      radioClass:
        "data-checked:bg-foreground data-checked:border-foreground dark:data-checked:bg-foreground",
      btnClass:
        "bg-secondary hover:bg-secondary/80 text-secondary-foreground w-full tracking-wider font-semibold",
    };
  }

  return {
    titleColor: "text-primary",
    iconColor: "text-primary",
    borderColor: "border-primary",
    radioClass: "data-checked:bg-primary data-checked:border-primary dark:data-checked:bg-primary",
    btnClass:
      "bg-primary hover:bg-primary/90 text-primary-foreground w-full tracking-wider font-semibold shadow-sm",
  };
};

/**
 * Marketing copy for each plan, keyed by plan code. Prices, currency and trial length come from the API
 * (/finance/available-plans and /finance/pricing-config); "{trial_days}" is filled in at render time.
 */
export const pricings = [
  {
    ctaText: "GET STARTED",
    features: [
      "Manage 1 group and 1 campaign",
      "Track up to 30 contributions and 30 messages",
      "Log details using our straightforward manual entry tool.",
      "Monitor everything in one place with your personal workspace",
      "Access FAQs and our community forum for support",
    ],
    id: "basic",
    name: "Basic",
    period: "month",
    tagline: "Best for exploring the platform on your own.",
  },
  {
    ctaText: "UPGRADE TO BRONZE",
    features: [
      "Run up to 3 campaigns under one group",
      "Track up to 50 contributions and 150 messages",
      "Convert WhatsApp messages directly into donation records",
      "Split contributions across different campaigns",
      "Monthly summaries and downloadable PDF reports",
      "Standard email support",
    ],
    id: "bronze",
    name: "Bronze",
    period: "month",
    tagline: "Best for small teams running occasional fundraisers.",
  },
  {
    ctaText: "UPGRADE TO SILVER",
    features: [
      "Up to 5 groups and 15 campaigns per group",
      "Track up to 500 contributions and 1,500 messages",
      "Bulk-forward WhatsApp messages",
      "Edit, split, & adjust contributions",
      "Daily / weekly digests",
      "AI auto-approval for inbox",
      "Custom PDF/Excel reports",
      "Priority email and live chat support",
    ],
    id: "silver",
    name: "Silver",
    period: "month",
    tagline: "Best for growing organizations with regular fundraising.",
  },
  {
    ctaText: "UPGRADE TO GOLD",
    features: [
      "Unlimited groups, campaigns, and members",
      "Up to 10,000 messages monthly",
      "WhatsApp, manual entry, and custom system integrations",
      "Edit, split, & adjust contributions",
      "Automated report scheduling",
      "Enterprise-grade auditing",
      "Dedicated account manager and phone support",
    ],
    id: "gold",
    name: "Gold",
    period: "month",
    tagline: "Best for large organizations needing scale and advanced control.",
  },
  {
    ctaText: "START {trial_days}-DAY FREE TRIAL",
    features: [
      "Unlock ALL Premium features for {trial_days} days",
      "Unlimited groups, campaigns, and members",
      "Up to 10,000 messages monthly",
      "WhatsApp, manual entry, and custom system integrations",
      "Enterprise-grade auditing and insights",
      "No credit card required for trial",
    ],
    id: "professional",
    name: "Professional",
    period: "month",
    tagline: "Experience the full power of KapuLetu absolutely free.",
  },
];
