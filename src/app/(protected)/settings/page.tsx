import { Suspense } from "react";
import { UserSettingsLayout } from "@/features/auth/components/settings/UserSettingsLayout";

export default function SettingsPage() {
  return (
    <Suspense>
      <UserSettingsLayout />
    </Suspense>
  );
}
