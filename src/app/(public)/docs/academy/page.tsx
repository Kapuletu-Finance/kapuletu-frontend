import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsVideo } from "@/features/docs/components/DocsVideo";

export default function AcademyIndexPage() {
  return (
    <DocsArticle
      title="Video Academy"
      description="Watch and learn. Master KapuLetu through our comprehensive video library."
      difficulty="Beginner"
    >
      <div className="space-y-12 my-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Introduction to KapuLetu</h2>
          <DocsVideo title="The core philosophy and dashboard overview" duration="4:15" />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. The WhatsApp Bot</h2>
          <DocsVideo title="How to connect and forward M-Pesa messages" duration="3:30" />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Reconciliation Masterclass</h2>
          <DocsVideo title="End-of-month balancing made easy" duration="6:45" />
        </section>
      </div>
    </DocsArticle>
  );
}
