import { Suspense } from "react";
import { SubscriptionsPage } from "@/features/admin/components/finance/SubscriptionsPage";

export default function FinanceSubscriptionsRoute() {
  // useSearchParams (the ?state= filter) needs a Suspense boundary.
  return (
    <Suspense>
      <SubscriptionsPage />
    </Suspense>
  );
}
