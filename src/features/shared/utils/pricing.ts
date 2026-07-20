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
        titleColor: "text-plan-bronze",
        iconColor: "text-plan-bronze",
        borderColor: "border-plan-bronze",
        radioClass:
          "data-checked:bg-plan-bronze data-checked:border-plan-bronze dark:data-checked:bg-plan-bronze",
        btnClass:
          "bg-gradient-to-r from-plan-bronze-from to-plan-bronze-to hover:opacity-90 text-plan-bronze-fg w-full tracking-wider font-semibold shadow-sm",
      };
    case "silver":
      return {
        titleColor: "text-plan-silver",
        iconColor: "text-plan-silver",
        borderColor: "border-plan-silver",
        radioClass:
          "data-checked:bg-plan-silver data-checked:border-plan-silver dark:data-checked:bg-plan-silver",
        btnClass:
          "bg-gradient-to-r from-plan-silver-from to-plan-silver-to hover:opacity-90 text-plan-silver-fg w-full tracking-wider font-semibold shadow-sm",
      };
    case "gold":
      return {
        titleColor: "text-plan-gold",
        iconColor: "text-plan-gold",
        borderColor: "border-plan-gold",
        radioClass:
          "data-checked:bg-plan-gold data-checked:border-plan-gold dark:data-checked:bg-plan-gold",
        btnClass:
          "bg-gradient-to-r from-plan-gold-from to-plan-gold-to hover:opacity-90 text-plan-gold-fg w-full tracking-wider font-semibold shadow-sm",
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
