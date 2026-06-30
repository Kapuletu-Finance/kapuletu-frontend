import { useMutation } from "@tanstack/react-query";
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
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  UpdateProfileRequest,
  VerifyRequest,
} from "@/features/auth/types";
import { AUTH_URLS } from "@/features/auth/urls";
import { apiClient } from "@/lib/api-client";

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: async (data: SignInFormData) => {
      // Map form data to backend expected snake_case DTO
      const requestPayload: SignInRequest = {
        password: data.password,
      };

      if (data.identifier.includes("@")) {
        requestPayload.email = data.identifier;
      } else {
        requestPayload.phone_number = data.identifier;
      }
      const response = await apiClient.post<AuthResponse>(AUTH_URLS.SIGN_IN, requestPayload);
      return response.data;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Invalid email or password. Please try again.",
      );
    },
    onSuccess: (data) => {
      toast.success("Sign in successful!");
      setCookie(env.NEXT_PUBLIC_ROLE_COOKIE_NAME, data.role, { maxAge: 604800, path: "/" });
      localStorage.removeItem(AUTH_LOCAL_STORAGE_KEYS.VERIFY_EMAIL_ALERT_DISMISSED);

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

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: async (data: SignUpFormData) => {
      // Map form data to backend expected snake_case DTO
      const requestPayload: SignUpRequest = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
        phone_number: data.phoneNumber,
        role: data.role,
      };

      const response = await apiClient.post<AuthResponse>(AUTH_URLS.SIGN_UP, requestPayload);
      return response.data;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Registration failed. Please verify your details and try again.",
      );
    },
    onSuccess: (data) => {
      toast.success("Account created successfully!");
      setCookie(env.NEXT_PUBLIC_ROLE_COOKIE_NAME, data.role, { maxAge: 604800, path: "/" });
      localStorage.removeItem(AUTH_LOCAL_STORAGE_KEYS.VERIFY_EMAIL_ALERT_DISMISSED);

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

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      const requestPayload: ForgotPasswordRequest = {
        phone_number: data.phoneNumber,
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
      toast.success(data.message || "Instructions sent!");
    },
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      const requestPayload: ResetPasswordRequest = {
        new_password: data.password,
        token: data.token,
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
      const requestPayload: ChangePasswordRequest = {
        current_password: data.currentPassword,
        new_password: data.newPassword,
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
      const requestPayload: UpdateProfileRequest = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
      };
      const response = await apiClient.patch<AuthResponse>(AUTH_URLS.ME, requestPayload);
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

export const useVerifyMutation = () => {
  return useMutation({
    mutationFn: async (data: VerifyFormData) => {
      const requestPayload: VerifyRequest = {
        code: data.code,
      };
      const response = await apiClient.post<{ message: string }>(AUTH_URLS.VERIFY, requestPayload);
      return response.data;
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to verify code.");
    },
    onSuccess: (data) => {
      toast.success(data.message || "Account verified successfully!");
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
