"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SuccessLoader } from "@/features/shared/components/SuccessLoader";

export const ForgotPasswordSuccessView = () => {
  const router = useRouter();

  return (
    <div className="w-full max-w-md mx-auto pb-4 flex flex-col items-center">
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="text-xl font-bold mb-2 text-foreground">
          Your password has been reset successfully!
        </h1>
        <p className="text-sm text-muted-foreground px-4">
          You can now login to your account using your new password.
        </p>
      </div>

      <div className="mb-12">
        <SuccessLoader size={80} />
      </div>

      <Button className="w-full font-medium py-6" onClick={() => router.push("/sign-in")}>
        Continue
      </Button>
    </div>
  );
};
