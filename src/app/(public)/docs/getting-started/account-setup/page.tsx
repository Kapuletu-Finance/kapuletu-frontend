import type { Metadata } from "next";
import Link from "next/link";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsScreenshotSequence } from "@/features/docs/components/DocsScreenshotSequence";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const metadata: Metadata = {
  title: "Account Setup | KapuLetu Docs",
  description: "Learn how to sign up, sign in, and secure your KapuLetu account.",
};

export default function AccountSetupPage() {
  const authSteps = [
    {
      title: "Creating Your Account",
      description: (
        <span>
          Navigate to the <strong>Sign Up</strong> page. Enter your official name, email address,
          and a secure password. Your email will be used as your primary identifier for official
          treasury reports.
        </span>
      ),
      image: "/docs/getting-started/account-signup.png",
    },
    {
      title: "Signing In",
      description: (
        <span>
          Once registered, navigate to the <strong>Sign In</strong> page. Enter your credentials to
          securely access your centralized treasury workspace.
        </span>
      ),
      image: "/docs/getting-started/account-signin.png",
    },
    {
      title: "Password Recovery",
      description: (
        <span>
          Forgot your password? Click <strong>'Forgot Password'</strong> on the login screen. You
          will receive a secure reset link to your registered email address.
        </span>
      ),
      image: "/docs/getting-started/account-recovery.png",
    },
  ];

  return (
    <DocsArticle
      title="Account Setup"
      description="Learn how to sign up, sign in, and secure your KapuLetu account."
      difficulty="Beginner"
      estimatedTime="2 min"
    >
      <h2 className="text-2xl font-bold mt-8 mb-4 border-b border-border pb-2">Authentication</h2>
      <p className="text-muted-foreground mb-8">
        Getting access to your treasury is quick and secure. Follow these steps to register and log
        in to the platform.
      </p>

      <DocsScreenshotSequence steps={authSteps} alt="Account setup steps" />

      <div className="mt-12 p-6 border border-primary/20 bg-primary/5 rounded-xl flex flex-col items-center text-center">
        <h3 className="text-xl font-bold mb-2">Ready to explore?</h3>
        <p className="text-muted-foreground mb-6">
          Now that you are logged in, let's take a tour of your new treasury workspace.
        </p>
        <Link
          href="/docs/getting-started/workspace"
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Next: Understanding the Workspace &rarr;
        </Link>
      </div>
    </DocsArticle>
  );
}
