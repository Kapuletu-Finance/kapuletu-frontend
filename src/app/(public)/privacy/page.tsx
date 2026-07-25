import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <Card className="w-full max-w-3xl p-4 md:p-8">
        <CardHeader className="flex flex-col items-center mb-4">
          <SiteLogo width={48} height={48} className="mb-6" />
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            At KapuLetu, we are committed to protecting your personal information and your right to
            privacy. If you have any questions or concerns about our policy, or our practices with
            regards to your personal information, please contact us.
          </p>
          <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on
            the website, express an interest in obtaining information about us or our products and
            services.
          </p>
          <h2 className="text-xl font-bold text-foreground">2. Placeholder Section</h2>
          <p>
            This is a placeholder page for the Privacy Policy. Please replace this content with your
            actual privacy policy before launching your application to production.
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

export default PrivacyPage;
