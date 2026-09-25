import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";

export default function WhatIsACampaignPage() {
  return (
    <DocsArticle
      title="What is a Campaign?"
      description="Understand the relationship between groups and campaigns."
      difficulty="Beginner"
    >
      <div className="space-y-6 text-sm">
        <section>
          <h2 className="text-xl font-semibold mb-3">Understanding Campaigns</h2>
          <p className="text-muted-foreground mb-4">
            A <strong>campaign</strong> is a specific fundraising activity that takes place inside a
            group. While a group acts as a container for related fundraising activities, the
            campaign is where the actual tracking of contributions, targets, and deadlines happens.
          </p>
          <p className="text-muted-foreground mb-4">
            For example, you might have a group for your church, and within that group, you can
            create various campaigns such as a "Building Fund", a "Wedding Fundraiser", or a
            "Funeral Fundraising" for a member.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Why Use Groups for Campaigns?</h2>
          <p className="text-muted-foreground mb-4">
            Groups come in handy especially when a treasurer is handling multiple campaigns or
            fundraising activities inside a related ecosystem. Examples include a church, a family,
            a chama, or related communities.
          </p>
          <DocsCallout type="tip">
            By grouping related campaigns together, you share the same member list across them,
            simplifying management and reporting for the entire community.
          </DocsCallout>
        </section>
      </div>
    </DocsArticle>
  );
}
