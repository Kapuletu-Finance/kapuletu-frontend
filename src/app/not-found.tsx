import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="flex flex-col items-center mb-8">
        <SiteLogo width={48} height={48} className="mb-6" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">404</h1>
        <h2 className="text-xl font-medium text-muted-foreground mb-6">Page not found</h2>
        <p className="text-center text-muted-foreground max-w-md mb-8 leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s
          get you back on track.
        </p>
        <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
