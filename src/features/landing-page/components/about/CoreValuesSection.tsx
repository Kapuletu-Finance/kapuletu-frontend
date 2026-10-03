import type React from "react";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const CoreValuesSection: React.FC = () => {
  type IconName = React.ComponentProps<typeof IconLibrary>["name"];
  const values: Array<{ icon: IconName; title: string; description: string }> = [
    {
      icon: "shield-check" as IconName,
      title: "Security First",
      description:
        "We keep your money and data safe using the same level of protection as major banks.",
    },
    {
      icon: "search" as IconName,
      title: "Complete Openness",
      description:
        "Everyone sees exactly where the money goes. No hidden fees or confusing reports.",
    },
    {
      icon: "users" as IconName,
      title: "Built for You",
      description:
        "We listen to the groups we serve and build features based on what you actually need.",
    },
    {
      icon: "zap" as IconName,
      title: "Very Simple to Use",
      description:
        "You don't need a finance degree to use our app. We designed it for everyday people.",
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
