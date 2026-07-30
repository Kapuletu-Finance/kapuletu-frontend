import type React from "react";
import { Card } from "@/components/ui/card";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Card>
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  );
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="w-full py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to manage your treasury
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-balance">
            Say goodbye to messy spreadsheets and manual reconciliations. Kapuletu brings clarity,
            automation, and trust to your organization's finances.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<IconLibrary name="campaign" className="h-6 w-6 text-primary" />}
            title="Transparent Ledger"
            description="Keep track of every contribution, expense, and payout. Treasurers and members get real-time, automated updates."
          />
          <FeatureCard
            icon={<IconLibrary name="bell-ring" className="h-6 w-6 text-primary" />}
            title="Automated Reminders"
            description="Never miss a payment schedule again. Kapuletu automatically sends SMS and Email reminders to members."
          />
          <FeatureCard
            icon={<IconLibrary name="megaphone" className="h-6 w-6 text-primary" />}
            title="Campaign Management"
            description="Set up specific fundraising campaigns, track targets, and monitor member contributions towards goal progress."
          />
          <FeatureCard
            icon={<IconLibrary name="shield-check" className="h-6 w-6 text-primary" />}
            title="Bank-grade Security"
            description="Your financial data is encrypted and securely stored. We prioritize your privacy and data protection."
          />
          <FeatureCard
            icon={<IconLibrary name="check-circle" className="h-6 w-6 text-primary" />}
            title="Role-based Access"
            description="Assign specific roles like Chairperson, Treasurer, or Auditor with granular access controls."
          />
          <FeatureCard
            icon={
              <SiteLogo
                variant="icon"
                className="h-6 w-6 text-primary"
                logoClassName="w-full h-full"
              />
            }
            title="Analytics & Reports"
            description="Generate beautiful, easy-to-understand financial reports and statements with a single click."
          />
        </div>
      </div>
    </section>
  );
};
