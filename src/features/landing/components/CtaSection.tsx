import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CtaSection = () => {
  return (
    <section className="w-full py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
          Ready to empower your financial group?
        </h2>
        <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 text-balance">
          Join hundreds of chamas and investment groups already using Kapuletu to achieve their
          financial goals.
        </p>
        <Link href="/sign-up">
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full text-base h-14 px-10 shadow-lg hover:shadow-xl transition-all"
          >
            Create Your Group Now
          </Button>
        </Link>
      </div>
    </section>
  );
};
