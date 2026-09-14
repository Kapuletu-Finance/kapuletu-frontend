"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAvailablePlansQuery } from "@/features/finance/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import { getTierStyles, pricings } from "@/features/shared/utils/pricing";
import { cn } from "@/lib/utils";

interface PricingSectionProps {
  hideLogo?: boolean;
  className?: string;
  currentPlan?: string;
  isLoggedIn?: boolean;
}

export const PricingSection = ({
  hideLogo,
  className,
  currentPlan,
  isLoggedIn,
}: PricingSectionProps) => {
  const { data: dynamicPlans, isLoading } = useGetAvailablePlansQuery();
  return (
    <section id="pricing" className={cn("py-16 px-4 max-w-7xl mx-auto space-y-12", className)}>
      <div className="text-center flex flex-col items-center space-y-3">
        {!hideLogo && <SiteLogo />}
        <h2 className="text-3xl font-bold tracking-tight font-sans text-foreground">
          Choose your plan
        </h2>
        <p className="text-muted-foreground max-w-md leading-relaxed">
          Select the perfect plan for your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {isLoading &&
          ["sk1", "sk2", "sk3", "sk4"].map((id) => (
            <Skeleton key={id} className="h-[500px] w-full rounded-xl" />
          ))}
        {!isLoading &&
          pricings.map((pricing) => {
            const styles = getTierStyles(pricing.id);

            // Merge dynamic price if available
            const dynamicPlan = dynamicPlans?.find(
              (p) => p.name.toLowerCase() === pricing.id.toLowerCase(),
            );
            const displayPrice = dynamicPlan ? dynamicPlan.price : pricing.price;

            return (
              <Card
                key={pricing.id}
                className="flex flex-col justify-between border border-border bg-card transition-all"
              >
                <div>
                  <CardHeader className="space-y-4">
                    <div className="text-xl font-bold font-sans tracking-tight">
                      {pricing.currency} <span className="text-2xl">{displayPrice}</span>
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

                  <CardContent>
                    <ul className="space-y-4">
                      {pricing.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-foreground/90 leading-normal"
                        >
                          <IconLibrary
                            name="check"
                            className={`h-5 w-5 shrink-0 mt-0.5 ${styles.iconColor}`}
                            strokeWidth={3}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>

                <CardFooter>
                  <Button
                    className={`py-6 uppercase ${styles.btnClass}`}
                    disabled={currentPlan?.toLowerCase() === pricing.id.toLowerCase()}
                  >
                    <Link
                      href={
                        currentPlan?.toLowerCase() === pricing.id.toLowerCase()
                          ? "#"
                          : pricing.id === "basic"
                            ? isLoggedIn
                              ? "/checkout?tier=basic"
                              : "/sign-up"
                            : `/checkout?tier=${pricing.id}`
                      }
                      className="w-full h-full flex items-center justify-center"
                    >
                      {currentPlan?.toLowerCase() === pricing.id.toLowerCase()
                        ? "Current Plan"
                        : isLoggedIn && pricing.id === "basic"
                          ? "Select Plan"
                          : pricing.ctaText}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </section>
  );
};
