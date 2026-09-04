import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { LandingFooter } from "@/features/landing-page/components/LandingFooter";
import { LandingHeader } from "@/features/landing-page/components/LandingHeader";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const metadata: Metadata = {
  title: "Contact Support | KapuLetu",
  description: "Get help with your KapuLetu account, ask questions, or report issues.",
};

export default function SupportPage() {
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
                href="/dashboard"
                className="shrink-0 bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                Go to Workspace
              </Link>
            </div>

            <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6">Contact our Team</h2>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="first-name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        First name
                      </label>
                      <input
                        type="text"
                        id="first-name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="last-name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Last name
                      </label>
                      <input
                        type="text"
                        id="last-name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="topic"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      How can we help?
                    </label>
                    <select
                      id="topic"
                      defaultValue=""
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="" disabled>
                        Select a topic
                      </option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="billing">Billing & Subscriptions</option>
                      <option value="technical">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Please describe your issue in detail..."
                    />
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full sm:w-auto"
                  >
                    Send Message
                  </button>
                </form>
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
