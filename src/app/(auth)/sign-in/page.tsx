import { Suspense } from "react";
import { SignInForm } from "@/features/auth/components/SignInForm";

const SignInPage = () => {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
};

export default SignInPage;
