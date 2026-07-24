import { Suspense } from "react";
import PricingPaymentContent from "@/features/shared/components/PricingPaymentContent";

const CheckoutPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted">
      <Suspense fallback={<div className="text-muted-foreground p-8">Loading checkout...</div>}>
        <PricingPaymentContent />
      </Suspense>
    </div>
  );
};

export default CheckoutPage;
