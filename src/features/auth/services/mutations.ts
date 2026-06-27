import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type {
  ChangePasswordFormData,
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
  UpdateProfileFormData,
  VerifyFormData,
} from "@/features/auth/schemas";
import type {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  VerifyRequest,
} from "@/features/auth/types";
import { AUTH_URLS } from "@/features/auth/urls";
import { apiClient } from "@/lib/api-client";

export const useLoginMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      // Map form data to backend expected snake_case DTO
      const requestPayload: LoginRequest = {
        email: data.email,
        password: data.password,
      };
      const response = await apiClient.post<AuthResponse>(AUTH_URLS.LOGIN, requestPayload);
      return response.data;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Invalid email or password. Please try again.",
      );
    },
    onSuccess: (data) => {
      toast.success("Login successful!");
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");

      if (from) {
        router.push(from);
      } else if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/treasurer");
      }
    },
  });
};

export const useRegisterMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Map form data to backend expected snake_case DTO
      const requestPayload: RegisterRequest = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
        phone_number: data.phoneNumber,
        role: data.role,
      };

      const response = await apiClient.post<AuthResponse>(AUTH_URLS.REGISTER, requestPayload);
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
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");

      if (from) {
        router.push(from);
      } else if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/treasurer");
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
