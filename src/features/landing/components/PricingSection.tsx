import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import { getTierStyles } from "@/features/shared/utils/pricing";

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 px-4 max-w-7xl mx-auto space-y-12">
      <div className="text-center flex flex-col items-center space-y-3">
        <SiteLogo />
        <h2 className="text-3xl font-bold tracking-tight font-sans text-foreground">
          Choose your plan
        </h2>
        <p className="text-muted-foreground max-w-md leading-relaxed">
          Select the perfect plan for your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {pricings.map((pricing) => {
          const styles = getTierStyles(pricing.id);

          return (
            <Card
              key={pricing.id}
              className="flex flex-col justify-between border border-border bg-card shadow-sm rounded-2xl p-4 transition-all hover:shadow-md"
            >
              <div>
                <CardHeader className="p-0 space-y-4">
                  <div className="text-xl font-bold font-sans tracking-tight">
                    {pricing.currency} <span className="text-2xl">{pricing.price}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      /{pricing.period}
                    </span>
                  </div>

                  <h3
                    className={`text-4xl font-bold font-sans tracking-tight ${styles.titleColor}`}
                  >
                    {pricing.name}
                  </h3>

                  <p className="text-sm text-muted-foreground min-h-10 leading-relaxed">
                    {pricing.tagline}
                  </p>
                </CardHeader>

                <hr className="my-6 border-border" />

                <CardContent className="p-0">
                  <ul className="space-y-4">
                    {pricing.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-foreground/90 leading-normal"
                      >
                        <Check
                          className={`h-5 w-5 shrink-0 mt-0.5 ${styles.iconColor}`}
                          strokeWidth={3}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <CardFooter className="p-4">
                <Button className={`rounded-xl py-6 uppercase ${styles.btnClass}`}>
                  <Link href={`/checkout?tier=${pricing.id}`}>{pricing.ctaText}</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

const pricings = [
  {
    ctaText: "CHOOSE BASIC",
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
