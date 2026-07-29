import { Suspense } from "react";
import { ForgotPasswordVerifyForm } from "@/features/auth/components/ForgotPasswordVerifyForm";

export default function ForgotPasswordVerifyPage() {
  return (
    <Suspense>
      <ForgotPasswordVerifyForm />
    </Suspense>
  );
}
