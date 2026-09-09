import Link from "next/link";
import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";

export default function ConceptualGuidesPage() {
  const concepts = [
    {
      title: "How contributions flow through KapuLetu",
      link: "/docs/conceptual/contribution-flow",
      desc: "Understand the lifecycle from receipt to ledger.",
    },
    {
      title: "How WhatsApp integration works",
      link: "/docs/whatsapp",
      desc: "The magic behind automatic M-Pesa processing.",
    },
    {
      title: "How approval works",
      link: "/docs/contributions",
      desc: "Why we require manual approval for automated entries.",
    },
    {
      title: "How the ledger works",
      link: "/docs/reconciliation",
      desc: "Understanding the immutable financial record.",
    },
    {
      title: "How permissions work",
      link: "/docs/groups",
      desc: "Role-based access control for Treasurers and Assistants.",
    },
    {
      title: "What happens when you edit a transaction",
      link: "/docs/contributions",
      desc: "Audit trails and correction procedures.",
    },
  ];

  return (
    <DocsArticle
      title="How KapuLetu Works"
      description="Conceptual guides to help you understand the philosophy and mechanics behind the KapuLetu platform."
      difficulty="Intermediate"
    >
      <p className="mb-6">
        While the rest of the documentation focuses on <strong>how to do things</strong>{" "}
        (procedural), this section focuses on <strong>why things work the way they do</strong>{" "}
        (conceptual). Understanding these concepts will make you a much more effective KapuLetu
        Treasurer.
      </p>

      <div className="grid grid-cols-1 gap-4 my-8">
        {concepts.map((concept, idx) => (
          <Link
            key={idx}
            href={concept.link}
            className="p-5 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors flex flex-col justify-center"
          >
            <h3 className="font-bold text-foreground text-lg mb-1">{concept.title}</h3>
            <p className="text-muted-foreground text-sm">{concept.desc}</p>
          </Link>
        ))}
      </div>

      <DocsCallout type="tip" title="Not sure where to start?">
        We highly recommend reading{" "}
        <Link
          href="/docs/conceptual/contribution-flow"
          className="text-primary hover:underline font-medium"
        >
          How contributions flow through KapuLetu
        </Link>{" "}
        first, as it is the core mechanic of the entire platform.
      </DocsCallout>
    </DocsArticle>
  );
}
