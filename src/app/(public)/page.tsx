import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <SiteLogo variant="full" className="text-4xl sm:text-6xl" logoClassName="h-[1em] w-[1em]" />
        <p className="text-lg">Built for Group Finance</p>
        <div className="flex flex-row items-center justify-center gap-4 pt-4">
          <Button>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
          <Button variant="outline">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
