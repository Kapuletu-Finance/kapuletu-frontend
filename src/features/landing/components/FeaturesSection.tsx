import { BellRing, CheckCircle2, ShieldCheck, Users, Wallet } from "lucide-react";
import type React from "react";
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
    <div className="bg-card text-card-foreground p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="w-full py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to run your group
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-balance">
            Say goodbye to messy spreadsheets and disputes. Kapuletu brings clarity and trust to
            your group finances.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Wallet className="h-6 w-6 text-primary" />}
            title="Transparent Ledger"
            description="Keep track of every contribution, fine, and withdrawal. All members have real-time visibility into the group's finances."
          />
          <FeatureCard
            icon={<BellRing className="h-6 w-6 text-primary" />}
            title="Automated Reminders"
            description="Never miss a payment schedule again. Kapuletu automatically sends SMS and Email reminders to members."
          />
          <FeatureCard
            icon={<Users className="h-6 w-6 text-primary" />}
            title="Loan Management"
            description="Seamlessly issue, track, and manage member loans, interest calculations, and repayment schedules."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6 text-primary" />}
            title="Bank-grade Security"
            description="Your group's financial data is encrypted and securely stored. We prioritize your privacy and data protection."
          />
          <FeatureCard
            icon={<CheckCircle2 className="h-6 w-6 text-primary" />}
            title="Role-based Access"
            description="Assign specific roles like Chairperson, Treasurer, or Secretary with granular access controls."
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
