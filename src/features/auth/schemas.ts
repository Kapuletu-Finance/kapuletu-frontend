import { z } from "zod";

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required."),
  phoneNumber: z.string().min(10, "Please enter a valid phone number."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    confirmPassword: z.string().min(1, "Please confirm your password."),
    email: z.string().email("Please enter a valid email address."),
    firstName: z.string().min(2, "First name must be at least 2 characters."),
    lastName: z.string().min(2, "Last name must be at least 2 characters."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    phoneNumber: z.string().min(10, "Please enter a valid phone number."),
    role: z.enum(["admin", "treasurer"], {
      message: "Please select a role.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  phoneNumber: z.string().min(10, "Please enter a valid phone number."),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    confirmPassword: z.string().min(1, "Please confirm your password."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    token: z.string().min(1, "Token is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    confirmNewPassword: z.string().min(1, "Please confirm your new password."),
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match.",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const updateProfileSchema = z.object({
  email: z.string().email("Please enter a valid email address.").optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters.").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters.").optional(),
  phoneNumber: z.string().min(10, "Please enter a valid phone number.").optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const verifySchema = z.object({
  code: z.string().min(4, "Verification code is required."),
});

export type VerifyFormData = z.infer<typeof verifySchema>;
