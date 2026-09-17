"use client";

import { deleteCookie } from "cookies-next";
import { CheckCircle2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SocialIcon } from "react-social-icons";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/features/auth/services/mutations";
import { useGetMeQuery } from "@/features/auth/services/queries";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const WaitlistPage: React.FC = () => {
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();
  const router = useRouter();

  // Poll every 10 seconds to check if they've been approved
  const { data: user } = useGetMeQuery({ refetchInterval: 10000 });

  useEffect(() => {
    if (user && user.is_waitlisted === false) {
      deleteCookie("is_waitlisted", { path: "/" });
      router.push("/sign-in");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
        <SiteLogo />
        <Button variant="ghost" className="gap-2" onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-4">
            <CheckCircle2 className="h-4 w-4" />
            <span>You're on the waitlist!</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Welcome to <span className="text-primary">KapuLetu</span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            Thank you for joining our community! We're currently in a closed testing phase to ensure
            the best possible experience for our users. We've saved your spot and will notify you
            the moment your workspace is ready.
          </p>

          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wider font-semibold">
              Follow our journey
            </p>
            <div className="flex items-center justify-center gap-6">
              <SocialIcon
                url="https://www.youtube.com/@Kapuletu"
                target="_blank"
                fgColor="currentColor"
                bgColor="transparent"
                className="!h-12 !w-12 hover:scale-110 transition-transform duration-300 text-muted-foreground hover:text-primary"
              />
              <SocialIcon
                url="https://www.linkedin.com/in/kapuletu-group-435017418/"
                target="_blank"
                fgColor="currentColor"
                bgColor="transparent"
                className="!h-12 !w-12 hover:scale-110 transition-transform duration-300 text-muted-foreground hover:text-primary"
              />
              <SocialIcon
                url="https://www.facebook.com/profile.php?id=61590911615988"
                target="_blank"
                fgColor="currentColor"
                bgColor="transparent"
                className="!h-12 !w-12 hover:scale-110 transition-transform duration-300 text-muted-foreground hover:text-primary"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} KapuLetu Group. All rights reserved.
      </footer>
    </div>
  );
};

export default WaitlistPage;
