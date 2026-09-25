import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";

export default function WhatIsAGroupPage() {
  return (
    <DocsArticle
      title="What is a Group?"
      description="Understand the core organizational structure in KapuLetu."
      difficulty="Beginner"
    >
      <div className="space-y-6 text-sm">
        <section>
          <h2 className="text-xl font-semibold mb-3">The Concept of a Group</h2>
          <p className="text-muted-foreground mb-4">
            In KapuLetu, a <strong>group</strong> is the highest-level organizational container. It
            represents an ecosystem or a community—such as a church, a family, a chama, or an alumni
            association.
          </p>
          <p className="text-muted-foreground mb-4">
            A group does not hold members directly; rather, it serves as the home for all your{" "}
            <strong>campaigns</strong> (the actual fundraising activities). When you manage a group,
            you are managing the collection of campaigns that belong to that specific community.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Why Use Groups?</h2>
          <p className="text-muted-foreground mb-4">
            If you are a treasurer handling finances for multiple unrelated communities (e.g., your
            church and your family chama), creating separate groups ensures that the campaigns,
            reporting, and settings for each community are kept strictly isolated from one another.
          </p>
          <DocsCallout type="info">
            You can seamlessly switch between different groups using the Group Switcher in the top
            navigation bar without needing to log in and out.
          </DocsCallout>
        </section>
      </div>
    </DocsArticle>
  );
}
