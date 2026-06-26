import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
          Welcome to Kapuletu
        </h1>
        <p className="text-lg text-muted-foreground">Your personal finance companion.</p>
        <div className="flex flex-row items-center justify-center gap-4 pt-4">
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
            Sign Up
          </Link>
          <Link href="/login" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
