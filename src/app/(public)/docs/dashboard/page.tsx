import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const metadata: Metadata = {
  title: "Understanding the Dashboard | KapuLetu Docs",
  description: "Learn how to read and interpret your treasury's central dashboard.",
};

export default function DashboardIndexPage() {
  return (
    <DocsArticle
      title="Understanding the Dashboard"
      description="A high-level summary of your workspace."
      difficulty="Beginner"
    >
      <DocsCallout type="info">
        The dashboard provides a simple, high-level summary of your finances.
      </DocsCallout>

      <div className="mt-8 mb-12 border border-border rounded-lg overflow-hidden bg-card shadow-sm">
        <div className="relative aspect-[16/9] sm:aspect-[2/1] bg-muted flex items-center justify-center">
          <Image
            src="/docs/dashboard/full-dashboard.png"
            alt="KapuLetu Dashboard Overview"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover sm:object-contain"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-6 border-b border-border pb-2">
        Dashboard Overview
      </h2>

      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="p-5 border border-border bg-card rounded-xl">
          <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <IconLibrary name="zap" className="w-5 h-5 text-primary" />
            1. Quick Actions
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Quickly{" "}
            <Link href="/docs/contributions" className="text-primary hover:underline">
              add contributions
            </Link>{" "}
            or{" "}
            <Link href="/docs/campaigns" className="text-primary hover:underline">
              create campaigns
            </Link>
            .
          </p>
          <div className="relative aspect-[21/9] w-full bg-muted rounded-lg overflow-hidden mt-4 border border-border">
            <Image
              src="/docs/dashboard/quick-actions.png"
              alt="Quick Actions"
              fill
              className="object-cover sm:object-contain"
            />
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="p-5 border border-border bg-card rounded-xl">
          <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <IconLibrary name="analytics" className="w-5 h-5 text-primary" />
            2. Overview Metrics
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">Your core metrics:</p>
          <div className="relative aspect-[21/9] w-full bg-muted rounded-lg overflow-hidden mb-4 border border-border">
            <Image
              src="/docs/dashboard/overview-metrics.png"
              alt="Overview Metrics"
              fill
              className="object-cover sm:object-contain"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-muted/30 border border-border rounded-lg">
              <span className="font-semibold text-sm block mb-1">
                <Link href="/docs/groups" className="hover:text-primary transition-colors">
                  Total Groups
                </Link>
              </span>
              <span className="text-xs text-muted-foreground">
                The total number of organizations you manage.
              </span>
            </div>
            <div className="p-3 bg-muted/30 border border-border rounded-lg">
              <span className="font-semibold text-sm block mb-1">
                <Link href="/docs/campaigns" className="hover:text-primary transition-colors">
                  Active Campaigns
                </Link>
              </span>
              <span className="text-xs text-muted-foreground">
                Fundraisers that are currently running.
              </span>
            </div>
            <div className="p-3 bg-muted/30 border border-border rounded-lg">
              <span className="font-semibold text-sm block mb-1">
                <Link href="/docs/groups" className="hover:text-primary transition-colors">
                  Active Groups
                </Link>
              </span>
              <span className="text-xs text-muted-foreground">Groups with ongoing activities.</span>
            </div>
            <div className="p-3 bg-muted/30 border border-border rounded-lg border-l-4 border-l-destructive">
              <span className="font-semibold text-sm block mb-1">Pending Approvals</span>
              <span className="text-xs text-muted-foreground">
                Crucial! Shows unverified transactions waiting in your{" "}
                <Link href="/docs/contributions" className="text-primary hover:underline">
                  Inbox
                </Link>
                .
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Campaigns List */}
          <div className="p-5 border border-border bg-card rounded-xl">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <IconLibrary name="target" className="w-5 h-5 text-primary" />
              3. Active Campaigns
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Monitor the progress of your ongoing fundraising efforts at a glance.
            </p>
            <div className="relative aspect-[4/3] w-full bg-muted rounded-lg overflow-hidden mb-4 border border-border">
              <Image
                src="/docs/dashboard/active-campaigns.png"
                alt="Active Campaigns List"
                fill
                className="object-cover sm:object-contain"
              />
            </div>
            <Link
              href="/docs/campaigns"
              className="text-sm text-primary font-medium hover:underline"
            >
              Learn more about Campaigns &rarr;
            </Link>
          </div>

          {/* Recent Activities */}
          <div className="p-5 border border-border bg-card rounded-xl">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <IconLibrary name="activity" className="w-5 h-5 text-primary" />
              4. Recent Activities
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              View the latest actions taken in your workspace.
            </p>
            <div className="relative aspect-[4/3] w-full bg-muted rounded-lg overflow-hidden border border-border">
              <Image
                src="/docs/dashboard/recent-activities.png"
                alt="Recent Activities feed"
                fill
                className="object-cover sm:object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </DocsArticle>
  );
}
