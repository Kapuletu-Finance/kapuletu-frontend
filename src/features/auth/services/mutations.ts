import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCookie, setCookie } from "cookies-next";

import { toast } from "sonner";
import { env } from "@/env";
import { AUTH_LOCAL_STORAGE_KEYS } from "@/features/auth/keys";
import type {
  ChangePasswordFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  SignInFormData,
  SignUpFormData,
  UpdateProfileFormData,
  VerifyFormData,
} from "@/features/auth/schemas";
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  RegisterOut,
  ResendCodeRequest,
  ResetPasswordRequest,
  SignInResponse,
  SignUpRequest,
  UpdateProfileRequest,
  VerifyPhoneRequest,
  VerifyRequest,
} from "@/features/auth/types";
import { AUTH_URLS } from "@/features/auth/urls";
import type { AutomationSettings, ReportingSettings } from "@/features/shared/types";
import { apiClient } from "@/lib/api-client";

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: async (data: SignInFormData) => {
      // Backend LoginIn expects a single `identifier` field (email or phone number)
      const response = await apiClient.post<SignInResponse>(AUTH_URLS.SIGN_IN, {
        identifier: data.identifier,
        password: data.password,
      });
      return response.data;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Invalid email or password. Please try again.",
      );
    },
    onSuccess: (data) => {
      if (data.requires_2fa) {
        toast.success("We've sent a 6-digit code to your phone and email.");
        return; // UI will handle transition
      }

      toast.success("Welcome back!");
      setCookie(env.NEXT_PUBLIC_ROLE_COOKIE_NAME, data.role, { maxAge: 604800, path: "/" });
      localStorage.removeItem(AUTH_LOCAL_STORAGE_KEYS.VERIFY_EMAIL_ALERT_DISMISSED);

      // If phone number is not yet verified, redirect to the verify-phone page
      if (!data.phone_number_verified) {
        window.location.href = "/verify-phone";
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");

      if (from) {
        window.location.href = from;
      } else if (data.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/treasurer";
      }
    },
  });
};

export const useVerify2FAMutation = () => {
  return useMutation({
    mutationFn: async (data: { token: string; code: string }) => {
      const response = await apiClient.post<SignInResponse>("/auth/verify-2fa", {
        two_fa_token: data.token,
        code: data.code,
      });
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Invalid verification code.");
    },
    onSuccess: (data) => {
      toast.success("Welcome back!");
      setCookie(env.NEXT_PUBLIC_ROLE_COOKIE_NAME, data.role, { maxAge: 604800, path: "/" });
      localStorage.removeItem(AUTH_LOCAL_STORAGE_KEYS.VERIFY_EMAIL_ALERT_DISMISSED);

      if (!data.phone_number_verified) {
        window.location.href = "/verify-phone";
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");

      if (from) {
        window.location.href = from;
      } else if (data.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/treasurer";
      }
    },
  });
};

export const useResend2FAMutation = () => {
  return useMutation({
    mutationFn: async (data: { token: string }) => {
      const response = await apiClient.post<{ message: string }>("/auth/resend-2fa", {
        two_fa_token: data.token,
      });
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to resend 2FA code.");
    },
    onSuccess: (data) => {
      toast.success(data.message || "2FA code resent successfully.");
    },
  });
};

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: async (data: SignUpFormData) => {
      // Backend RegisterIn has no role field — all registrations create treasurers
      const requestPayload: SignUpRequest = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
        phone_number: data.phoneNumber,
        marketing_consent: data.marketingConsent,
      };

      const response = await apiClient.post<RegisterOut>(AUTH_URLS.SIGN_UP, requestPayload);
      return response.data;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Registration failed. Please verify your details and try again.",
      );
    },
    onSuccess: () => {
      toast.success("Account created! Verification code sent to your email and WhatsApp.");
      localStorage.removeItem(AUTH_LOCAL_STORAGE_KEYS.VERIFY_EMAIL_ALERT_DISMISSED);
      // Redirect to phone verification page
      window.location.href = "/verify-phone";
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      // Backend ForgotPasswordIn uses `identifier` (email or phone number)
      const requestPayload: ForgotPasswordRequest = {
        identifier: data.identifier,
      };
      const response = await apiClient.post<{ message: string }>(
        AUTH_URLS.FORGOT_PASSWORD,
        requestPayload,
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to request password reset.");
    },
    onSuccess: (data) => {
      toast.success(data.message || "Verification code sent to your email and WhatsApp!");
    },
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      // Backend ResetPasswordIn: identifier + code (6-digit OTP) + new_password
      const requestPayload: ResetPasswordRequest = {
        code: data.code,
        identifier: data.identifier,
        new_password: data.password,
      };
      const response = await apiClient.post<{ message: string }>(
        AUTH_URLS.RESET_PASSWORD,
        requestPayload,
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to reset password.");
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password has been reset successfully!");
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordFormData) => {
      // Backend ChangePasswordIn uses `old_password`, not `current_password`
      const requestPayload: ChangePasswordRequest = {
        new_password: data.newPassword,
        old_password: data.oldPassword,
      };
      const response = await apiClient.post<{ message: string }>(
        AUTH_URLS.CHANGE_PASSWORD,
        requestPayload,
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to change password.");
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password changed successfully!");
    },
  });
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: async (data: UpdateProfileFormData) => {
      // Backend UpdateProfileIn has no email field
      const requestPayload: UpdateProfileRequest = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
      };
      const response = await apiClient.patch<{ message: string }>(AUTH_URLS.ME, requestPayload);
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update profile.");
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
  });
};

export const useVerifyEmailConfirmMutation = () => {
  return useMutation({
    mutationFn: async (data: VerifyFormData) => {
      const requestPayload: VerifyRequest = {
        code: data.code,
      };
      const response = await apiClient.post<{ message: string }>(
        AUTH_URLS.VERIFY_EMAIL_CONFIRM,
        requestPayload,
      );
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to verify email code.");
    },
    onSuccess: (data) => {
      toast.success(data.message || "Email verified successfully!");
    },
  });
};

export const useVerifyEmailRequestMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<{ message: string }>(AUTH_URLS.VERIFY_EMAIL_REQUEST);
      return response.data;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to request email verification code.",
      );
    },
    onSuccess: (data) => {
      toast.success(data.message || "Verification code sent to your email and WhatsApp!");
    },
  });
};

/**
 * Verify phone number after registration.
 * Backend /auth/verify expects: identifier (phone/email) + code (6-digit OTP).
 * The identifier should be stored in localStorage after sign-up.
 */
export const useVerifyPhoneConfirmMutation = () => {
  return useMutation({
    mutationFn: async (data: VerifyPhoneRequest) => {
      const response = await apiClient.post<{ message: string }>(AUTH_URLS.VERIFY_PHONE, data);
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to verify phone code.");
    },
    onSuccess: (data) => {
      toast.success(data.message || "Phone number verified successfully!");
      setCookie("phone_verified", "true", { path: "/" });
    },
  });
};

/**
 * Resend registration OTP code.
 * Backend /auth/resend-code expects: identifier (phone/email).
 */
export const useResendCodeMutation = () => {
  return useMutation({
    mutationFn: async (data: ResendCodeRequest) => {
      const response = await apiClient.post<{ message: string }>(AUTH_URLS.RESEND_CODE, data);
      return response.data;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to request phone verification code.",
      );
    },
    onSuccess: (data) => {
      toast.success(data.message || "Verification code sent to your email and WhatsApp!");
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      // The proxy intercepts this and clears cookies
      const response = await apiClient.post<{ message: string }>("/auth/logout");
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to sign out.");
    },
    onSuccess: () => {
      toast.success("Signed out successfully.");
      deleteCookie(env.NEXT_PUBLIC_ROLE_COOKIE_NAME, { path: "/" });
      localStorage.removeItem(AUTH_LOCAL_STORAGE_KEYS.VERIFY_EMAIL_ALERT_DISMISSED);
      window.location.href = "/sign-in";
    },
  });
};

export const useUpdateAutomationSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AutomationSettings) => {
      const response = await apiClient.put("/settings/me/automation/auto-approve", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Automation settings updated");
      queryClient.invalidateQueries({ queryKey: ["settings", "me"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update settings");
    },
  });
};

export const useUpdateReportingSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ReportingSettings) => {
      const response = await apiClient.put("/settings/me/reports/frequency", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Reporting settings updated");
      queryClient.invalidateQueries({ queryKey: ["settings", "me"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update settings");
    },
  });
};

export const useCancelSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<{ message: string }>("/finance/cancel-subscription");
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Subscription auto-renew cancelled");
      queryClient.invalidateQueries({ queryKey: ["finance", "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["settings", "me"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to cancel subscription");
    },
  });
};

export const useUpdateBillingSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      auto_renew_subscription: boolean;
      billing_email?: string | null;
    }) => {
      const response = await apiClient.put("/settings/me/billing", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Billing settings updated");
      queryClient.invalidateQueries({ queryKey: ["finance", "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["settings", "me"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update billing settings");
    },
  });
};

export const useUpdateAuthSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      allow_ai_training?: boolean;
      two_factor_enabled?: boolean;
      two_factor_channel?: string | null;
    }) => {
      // Backend expects allow_ai_training to be required, but we can just fetch and send all.
      // We should ideally pass the full SettingsIn object.
      const response = await apiClient.post("/auth/settings", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Security settings updated");
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update security settings");
    },
  });
};
