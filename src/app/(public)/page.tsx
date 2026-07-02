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
          <Link href="/sign-up">
            <Button>Sign Up</Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
