import Link from "next/link";
import { Suspense } from "react";
import IconLibrary from "@/features/shared/components/IconLibrary";
import PricingPaymentContent from "@/features/shared/components/PricingPaymentContent";

const CheckoutPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted relative">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
        <Link
          href="/treasurer"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors hover:bg-muted/50 hover:text-foreground h-9 px-4 py-2 text-muted-foreground"
        >
          <IconLibrary name="chevron-left" className="mr-2 h-4 w-4" />
          GO BACK
        </Link>
      </div>

      <Suspense fallback={<div className="text-muted-foreground p-8">Loading checkout...</div>}>
        <PricingPaymentContent />
      </Suspense>
    </div>
  );
};

export default CheckoutPage;
