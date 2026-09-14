import Link from "next/link";
import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";

export default function ExpensesIndexPage() {
  const guides = [
    {
      title: "Understanding expenses & Recording an expense",
      link: "/docs/expenses/understanding-expenses",
    },
    { title: "Expense categories & Adding evidence", link: "/docs/expenses/categories-evidence" },
    { title: "Editing & Approving expenses", link: "/docs/expenses/editing-approving" },
    { title: "Expense history & Expense reports", link: "/docs/expenses/history-reports" },
    { title: "Gross vs net totals, Surplus, and Deficit", link: "/docs/expenses/totals-surplus" },
    { title: "Expense reconciliation", link: "/docs/expenses/expense-reconciliation" },
  ];

  return (
    <DocsArticle
      title="Expenses"
      description="Track outflows, attach evidence, and monitor your group's net balance."
      difficulty="Intermediate"
    >
      <DocsCallout type="warning">
        Only approved expenses will affect your group's Net Balance on the dashboard.
      </DocsCallout>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        {guides.map((guide, idx) => (
          <Link
            key={idx}
            href={guide.link}
            className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors shadow-sm"
          >
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>
    </DocsArticle>
  );
}
