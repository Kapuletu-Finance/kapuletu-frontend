import { ArrowRight, BellRing, CheckCircle2, ShieldCheck, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur border-b border-border bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <SiteLogo variant="full" className="text-xl" logoClassName="h-[1em] w-[1em]" />
          <nav className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="rounded-full">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 flex flex-col items-center text-center px-4 relative overflow-hidden">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 text-balance">
            Modern Finance Management for <span className="text-primary">Groups & Chamas</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 text-balance">
            Transparent tracking, automated collections, and seamless loan management—all in one
            secure platform designed for your group's success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-full text-base h-12 px-8">
                Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full text-base h-12 px-8 bg-transparent"
              >
                See How It Works
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything you need to run your group
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-balance">
                Say goodbye to messy spreadsheets and disputes. Kapuletu brings clarity and trust to
                your group finances.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <FeatureCard
                icon={<Wallet className="h-6 w-6 text-primary" />}
                title="Transparent Ledger"
                description="Keep track of every contribution, fine, and withdrawal. All members have real-time visibility into the group's finances."
              />
              <FeatureCard
                icon={<BellRing className="h-6 w-6 text-primary" />}
                title="Automated Reminders"
                description="Never miss a payment schedule again. Kapuletu automatically sends SMS and Email reminders to members."
              />
              <FeatureCard
                icon={<Users className="h-6 w-6 text-primary" />}
                title="Loan Management"
                description="Seamlessly issue, track, and manage member loans, interest calculations, and repayment schedules."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6 text-primary" />}
                title="Bank-grade Security"
                description="Your group's financial data is encrypted and securely stored. We prioritize your privacy and data protection."
              />
              <FeatureCard
                icon={<CheckCircle2 className="h-6 w-6 text-primary" />}
                title="Role-based Access"
                description="Assign specific roles like Chairperson, Treasurer, or Secretary with granular access controls."
              />
              <FeatureCard
                icon={
                  <SiteLogo
                    variant="icon"
                    className="h-6 w-6 text-primary"
                    logoClassName="w-full h-full"
                  />
                }
                title="Analytics & Reports"
                description="Generate beautiful, easy-to-understand financial reports and statements with a single click."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
              Ready to empower your financial group?
            </h2>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 text-balance">
              Join hundreds of chamas and investment groups already using Kapuletu to achieve their
              financial goals.
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full text-base h-14 px-10 shadow-lg hover:shadow-xl transition-all"
              >
                Create Your Group Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-border bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <SiteLogo
              variant="icon"
              className="h-6 w-6"
              logoClassName="w-full h-full text-muted-foreground"
            />
            <span className="font-semibold text-foreground">Kapuletu Finance</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Kapuletu. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-card text-card-foreground p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default Home;
