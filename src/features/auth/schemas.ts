import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "Email address is required." })
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
  password: z.string({ message: "Password is required." }).min(1, "Password is required."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    confirmPassword: z
      .string({ message: "Please confirm your password." })
      .min(1, "Please confirm your password."),
    email: z
      .string({ message: "Email address is required." })
      .min(1, "Email address is required.")
      .email("Please enter a valid email address."),
    firstName: z
      .string({ message: "First name is required." })
      .min(1, "First name is required.")
      .min(2, "First name must be at least 2 characters."),
    lastName: z
      .string({ message: "Last name is required." })
      .min(1, "Last name is required.")
      .min(2, "Last name must be at least 2 characters."),
    password: z
      .string({ message: "Password is required." })
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters long."),
    phoneNumber: z
      .string({ message: "Phone number is required." })
      .min(1, "Phone number is required.")
      .min(10, "Please enter a valid phone number (e.g., +254...)."),
    role: z.enum(["admin", "treasurer"], {
      message: "Please select a valid role.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  phoneNumber: z
    .string({ message: "Phone number is required." })
    .min(1, "Phone number is required.")
    .min(10, "Please enter a valid phone number."),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    confirmPassword: z
      .string({ message: "Please confirm your password." })
      .min(1, "Please confirm your password."),
    password: z
      .string({ message: "Password is required." })
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters long."),
    token: z.string({ message: "Reset token is missing." }).min(1, "Reset token is missing."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    confirmNewPassword: z
      .string({ message: "Please confirm your new password." })
      .min(1, "Please confirm your new password."),
    currentPassword: z
      .string({ message: "Current password is required." })
      .min(1, "Current password is required."),
    newPassword: z
      .string({ message: "New password is required." })
      .min(1, "New password is required.")
      .min(8, "New password must be at least 8 characters long."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match.",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const updateProfileSchema = z.object({
  email: z
    .string({ message: "Email address is required." })
    .min(1, "Email address is required.")
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),
  firstName: z
    .string({ message: "First name is required." })
    .min(1, "First name is required.")
    .min(2, "First name must be at least 2 characters.")
    .optional()
    .or(z.literal("")),
  lastName: z
    .string({ message: "Last name is required." })
    .min(1, "Last name is required.")
    .min(2, "Last name must be at least 2 characters.")
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string({ message: "Phone number is required." })
    .min(1, "Phone number is required.")
    .min(10, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const verifySchema = z.object({
  code: z
    .string({ message: "Verification code is required." })
    .min(1, "Verification code is required.")
    .min(4, "Verification code must be at least 4 characters."),
});

export type VerifyFormData = z.infer<typeof verifySchema>;
