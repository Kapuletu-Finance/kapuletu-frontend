import type React from "react";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const CoreValuesSection: React.FC = () => {
  type IconName = React.ComponentProps<typeof IconLibrary>["name"];
  const values: Array<{ icon: IconName; title: string; description: string }> = [
    {
      icon: "shield-check" as IconName,
      title: "Security First",
      description:
        "We protect your data and funds with bank-level encryption and unalterable ledger technology.",
    },
    {
      icon: "search" as IconName,
      title: "Absolute Transparency",
      description:
        "Every member sees exactly where their contributions go. No hidden fees, no opaque reporting.",
    },
    {
      icon: "users" as IconName,
      title: "Community Driven",
      description:
        "Built closely with the communities we serve. Your feedback directly shapes our roadmap.",
    },
    {
      icon: "zap" as IconName,
      title: "Radical Simplicity",
      description:
        "Powerful tools should not require a finance degree. We design for the everyday treasurer.",
    },
  ];

  return (
    <section className="w-full py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These are the principles that guide every feature we build and every decision we make.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="bg-card rounded-2xl p-6 text-center shadow-sm border border-border hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <IconLibrary name={val.icon} className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">{val.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
