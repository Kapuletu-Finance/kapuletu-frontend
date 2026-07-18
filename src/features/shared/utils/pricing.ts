export const getTierStyles = (id: string) => {
  switch (id) {
    case "basic":
      return {
        titleColor: "text-foreground",
        iconColor: "text-muted-foreground",
        borderColor: "border-muted-foreground",
        radioClass:
          "data-checked:bg-foreground data-checked:border-foreground dark:data-checked:bg-foreground",
        btnClass:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground w-full tracking-wider font-semibold",
      };
    case "bronze":
      return {
        titleColor: "text-burnt-amber",
        iconColor: "text-burnt-amber",
        borderColor: "border-burnt-amber",
        radioClass:
          "data-checked:bg-burnt-amber data-checked:border-burnt-amber dark:data-checked:bg-burnt-amber",
        btnClass:
          "bg-burnt-amber hover:bg-burnt-amber/90 text-white w-full tracking-wider font-semibold",
      };
    case "silver":
      return {
        titleColor: "text-primary",
        iconColor: "text-primary",
        borderColor: "border-primary",
        radioClass:
          "data-checked:bg-primary data-checked:border-primary dark:data-checked:bg-primary",
        btnClass:
          "bg-primary hover:bg-primary/90 text-primary-foreground w-full tracking-wider font-semibold",
      };
    case "gold":
      return {
        titleColor: "text-refined-blue",
        iconColor: "text-refined-blue",
        borderColor: "border-refined-blue",
        radioClass:
          "data-checked:bg-refined-blue data-checked:border-refined-blue dark:data-checked:bg-refined-blue",
        btnClass:
          "bg-refined-blue hover:bg-refined-blue/90 text-white w-full tracking-wider font-semibold",
      };
    default:
      return {
        titleColor: "text-foreground",
        iconColor: "text-primary",
        borderColor: "border-primary",
        radioClass:
          "data-checked:bg-primary data-checked:border-primary dark:data-checked:bg-primary",
        btnClass: "w-full",
      };
  }
};

export const pricings = [
  {
    ctaText: "GET STARTED",
    currency: "Ksh.",
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
    price: 0,
    tagline: "Best for exploring the platform on your own.",
  },
  {
    ctaText: "UPGRADE TO BRONZE",
    currency: "Ksh.",
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
    price: 500,
    tagline: "Best for small teams running occasional fundraisers.",
  },
  {
    ctaText: "UPGRADE TO SILVER",
    currency: "Ksh.",
    features: [
      "Up to 5 groups and 15 campaigns per group",
      "Track up to 500 contributions and 1,500 messages",
      "Bulk-forward WhatsApp messages",
      "Edit, split, & adjust contributions",
      "Daily / weekly digests",
      "AI auto-approval for transactions",
      "Custom PDF/Excel reports",
      "Priority email and live chat support",
    ],
    id: "silver",
    name: "Silver",
    period: "month",
    price: 1000,
    tagline: "Best for growing organizations with regular fundraising.",
  },
  {
    ctaText: "UPGRADE TO GOLD",
    currency: "Ksh.",
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
    price: 1500,
    tagline: "Best for large organizations needing scale and advanced control.",
  },
];
