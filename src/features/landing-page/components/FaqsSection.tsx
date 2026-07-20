import { ChevronDown } from "lucide-react";

export const FaqsSection = () => {
  return (
    <section id="faqs" className="w-full py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about KapuLetu.
          </p>
        </div>
        <div className="space-y-4">
          <details className="group border border-border rounded-lg p-6 [&_summary::-webkit-details-marker]:hidden bg-card">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-semibold text-foreground">
              What is KapuLetu?
              <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                <ChevronDown className="h-5 w-5" />
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              KapuLetu is a modern group finance platform designed to help treasurers, committees,
              associations, and organizations manage contributions with transparency and ease.
            </p>
          </details>
          <details className="group border border-border rounded-lg p-6 [&_summary::-webkit-details-marker]:hidden bg-card">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-semibold text-foreground">
              How do I create a group?
              <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                <ChevronDown className="h-5 w-5" />
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Simply sign up for an account, click on "Create Group" from your dashboard, and follow
              the simple setup wizard to add your group details and members.
            </p>
          </details>
          <details className="group border border-border rounded-lg p-6 [&_summary::-webkit-details-marker]:hidden bg-card">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-semibold text-foreground">
              Is my data secure?
              <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                <ChevronDown className="h-5 w-5" />
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Yes, we use bank-grade encryption to protect your financial data. Your privacy and
              data security are our top priorities.
            </p>
          </details>
          <details className="group border border-border rounded-lg p-6 [&_summary::-webkit-details-marker]:hidden bg-card">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-semibold text-foreground">
              How much does it cost?
              <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                <ChevronDown className="h-5 w-5" />
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We offer a flexible pricing model tailored for groups of all sizes. You can start for
              free and upgrade as your group's needs grow.
            </p>
          </details>
          <details className="group border border-border rounded-lg p-6 [&_summary::-webkit-details-marker]:hidden bg-card">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-semibold text-foreground">
              Can I track individual contributions?
              <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                <ChevronDown className="h-5 w-5" />
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Absolutely. Our transparent ledger allows you to track every member's individual
              contributions, fines, and withdrawals in real-time.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};
