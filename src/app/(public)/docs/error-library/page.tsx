import Link from "next/link";
import React from "react";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsCallout } from "@/features/docs/components/DocsCallout";

export default function ErrorLibraryIndexPage() {
  const errors = [
    {
      code: "ERR_WHATSAPP_01",
      message: "Contribution could not be processed",
      solution:
        "The M-Pesa message format was unrecognized. Ensure you forward the full message without edits.",
    },
    {
      code: "ERR_AUTH_02",
      message: "Session expired",
      solution: "Your login session timed out for security reasons. Please log in again.",
    },
    {
      code: "ERR_PERM_03",
      message: "Insufficient permissions",
      solution:
        "You need the 'Admin' or 'Lead Treasurer' role to perform this action. Contact your group creator.",
    },
    {
      code: "ERR_DUP_04",
      message: "Duplicate transaction detected",
      solution:
        "This M-Pesa code has already been recorded in the ledger. Check the contribution history.",
    },
    {
      code: "ERR_LEDGER_05",
      message: "Cannot edit closed activity",
      solution:
        "This fundraising activity has been closed. You must reopen it to edit its contributions.",
    },
  ];

  return (
    <DocsArticle
      title="Error Message Library"
      description="Look up specific error codes and system messages to find immediate solutions."
      difficulty="Intermediate"
    >
      <DocsCallout type="info" title="How to use this library">
        Press <kbd className="bg-muted px-1 rounded text-xs">Ctrl</kbd> +{" "}
        <kbd className="bg-muted px-1 rounded text-xs">F</kbd> (or Cmd+F on Mac) to search for the
        exact text of the error message you received.
      </DocsCallout>

      <div className="overflow-x-auto my-8 border border-border rounded-lg shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium w-1/4">Error Message</th>
              <th className="px-6 py-4 font-medium">What it means & How to fix it</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {errors.map((err, idx) => (
              <tr key={idx} className="bg-card hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-semibold text-destructive">{err.message}</span>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">{err.code}</div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{err.solution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Can't find your error?</p>
        <Link href="/contact" className="text-sm font-medium text-primary hover:underline">
          Contact our support team
        </Link>
      </div>
    </DocsArticle>
  );
}
