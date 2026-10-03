import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const FeaturesSection = () => {
  return (
    <section id="features" className="w-full py-32 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-20">
          <div className="mb-8">
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              Simple Workflow
            </span>
            <div className="h-1 w-12 bg-primary mt-2"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            From payment to balance in seconds
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Say goodbye to messy spreadsheets. KapuLetu makes it incredibly easy to track every
            shilling your group receives, from the moment it's sent to the final record.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Step 1: Ingestion */}
          <div className="col-span-1 md:col-span-7 bg-muted/40 rounded-2xl p-8 border border-border/40 hover:bg-muted/60 transition-colors">
            <div className="text-sm font-bold uppercase tracking-wider text-primary mb-6">
              01. Receive
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Forward M-Pesa Messages</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-md">
              Just forward any M-Pesa payment SMS to KapuLetu. We automatically read the amount,
              date, and sender for you. No manual typing needed.
            </p>

            {/* Minimal UI representation */}
            <div className="bg-background rounded-lg p-4 border border-border shadow-sm max-w-sm text-sm">
              <div className="text-muted-foreground mb-2">Incoming message...</div>
              <div className="text-foreground font-medium">
                SGE23KL9 Confirmed. Ksh 5,000 sent to...
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between font-bold">
                <span className="text-green-600 dark:text-green-400">Recorded: Ksh 5,000</span>
                <span className="text-primary">Receipt: SGE23KL9</span>
              </div>
            </div>
          </div>

          {/* Step 2: Inbox */}
          <div className="col-span-1 md:col-span-5 bg-muted/40 rounded-2xl p-8 border border-border/40 hover:bg-muted/60 transition-colors">
            <div className="text-sm font-bold uppercase tracking-wider text-primary mb-6">
              02. Check
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Review & Confirm</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              All forwarded messages land in your KapuLetu Inbox. Just double-check the details,
              pick what the money is for, and approve it.
            </p>

            <div className="flex flex-col gap-2">
              <div className="px-3 py-2 bg-background border border-border rounded flex justify-between items-center shadow-sm">
                <span className="text-sm font-bold">Waiting: SGE23KL9</span>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="px-3 py-2 bg-background border border-border rounded flex justify-between items-center shadow-sm opacity-50">
                <span className="text-sm font-bold">Confirmed: RTT99XX1</span>
              </div>
            </div>
          </div>

          {/* Step 3: Ledger */}
          <div className="col-span-1 md:col-span-4 bg-muted/40 rounded-2xl p-8 border border-border/40 hover:bg-muted/60 transition-colors">
            <div className="text-sm font-bold uppercase tracking-wider text-primary mb-6">
              03. Save
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Digital Records</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Once approved, payments are securely saved in your group's permanent digital record
              book. Never lose track of a payment again.
            </p>
          </div>

          {/* Step 4: Campaigns */}
          <div className="col-span-1 md:col-span-4 bg-muted/40 rounded-2xl p-8 border border-border/40 hover:bg-muted/60 transition-colors">
            <div className="text-sm font-bold uppercase tracking-wider text-primary mb-6">
              04. Organize
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Track Different Funds</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Separate your money into specific goals—like 'Welfare', 'Merry-go-round', or 'Annual
              Trip'—and see balances for each easily.
            </p>
          </div>

          {/* Step 5: Multi-group */}
          <div className="col-span-1 md:col-span-4 bg-muted/40 rounded-2xl p-8 border border-border/40 hover:bg-muted/60 transition-colors">
            <div className="text-sm font-bold uppercase tracking-wider text-primary mb-6">
              05. Manage
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Multiple Groups</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Are you the treasurer for a Chama and a church group? Manage all your groups easily
              using just one login account.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
