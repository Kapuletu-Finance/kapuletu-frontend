import { Suspense } from "react";
import { ForgotPasswordResetForm } from "@/features/auth/components/ForgotPasswordResetForm";

export default function ForgotPasswordResetPage() {
  return (
    <Suspense>
      <ForgotPasswordResetForm />
    </Suspense>
  );
}
