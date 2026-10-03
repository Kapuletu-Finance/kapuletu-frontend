import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { env } from "@/env";
import { ContactFormClient } from "@/features/landing-page/components/ContactFormClient";
import { LandingFooter } from "@/features/landing-page/components/LandingFooter";
import { LandingHeader } from "@/features/landing-page/components/LandingHeader";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const metadata: Metadata = {
  title: "Contact Support | KapuLetu",
  description: "Get help with your KapuLetu account, ask questions, or report issues.",
};

export default async function SupportPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get(env.NEXT_PUBLIC_ROLE_COOKIE_NAME)?.value;
  const targetHref = role === "admin" ? "/admin" : role === "treasurer" ? "/treasurer" : "/sign-in";
  const buttonLabel = role ? "Go to Workspace" : "Log In to Workspace";
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-8">
              <span className="text-sm font-bold uppercase tracking-wider text-primary">
                Get in Touch
              </span>
              <div className="h-1 w-12 bg-primary mt-2" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
              How can we <span className="text-primary">help?</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-12">
              Whether you have a question about features, pricing, or need technical help, our team
              is ready to answer all your questions.
            </p>

            {/* Personalized Workspace Support Callout */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="bg-primary/10 p-3 rounded-full shrink-0">
                <IconLibrary name="shield-check" className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Already a KapuLetu User?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Log in to your account for faster, personalized support. Premium users get
                  priority responses directly inside the workspace.
                </p>
              </div>
              <Link
                href={targetHref}
                className="shrink-0 bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                {buttonLabel}
              </Link>
            </div>

            <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6">Contact our Team</h2>

                <ContactFormClient />
              </div>
              <div className="bg-muted px-6 py-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <IconLibrary name="mail" className="w-4 h-4" />
                    <span>support@kapuletu.co.ke</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconLibrary name="info" className="w-4 h-4" />
                    <span>info@kapuletu.co.ke</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <IconLibrary name="phone" className="w-4 h-4" />
                    <span>+254143933472</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
