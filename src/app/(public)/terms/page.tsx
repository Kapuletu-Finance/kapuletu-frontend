import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <Card className="w-full max-w-3xl">
        <CardHeader className="flex flex-col items-center mb-4">
          <SiteLogo width={48} height={48} className="mb-6" />
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Welcome to KapuLetu. These Terms of Service constitute a legally binding agreement made
            between you and KapuLetu, concerning your access to and use of our website and services.
          </p>
          <h2 className="text-xl font-bold text-foreground">1. Agreement to Terms</h2>
          <p>
            By accessing the website, you agree that you have read, understood, and agree to be
            bound by all of these Terms of Service.
          </p>
          <h2 className="text-xl font-bold text-foreground">2. Placeholder Section</h2>
          <p>
            This is a placeholder page for the Terms of Service. Please replace this content with
            your actual legal terms before launching your application to production.
          </p>
          <div className="pt-8">
            <Link
              href="/sign-up"
              className="text-primary hover:underline font-medium inline-flex items-center"
            >
              <IconLibrary name="arrow-left" className="w-4 h-4 mr-1.5" /> Back
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsPage;
